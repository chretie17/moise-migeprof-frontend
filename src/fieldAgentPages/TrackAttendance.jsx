import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Snackbar,
  Alert,
  CircularProgress,
  FormControlLabel,
  Checkbox,
  Avatar,
  CardHeader,
} from '@mui/material';
import { getAllPrograms, getFamilies } from '../services/Familyservice';
import { addOrUpdateAttendance, getAttendances } from '../services/AttendanceService';

const ManageAttendance = () => {
  const [programs, setPrograms] = useState([]);
  const [families, setFamilies] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const [loadingPrograms, setLoadingPrograms] = useState(true);
  const [loadingFamilies, setLoadingFamilies] = useState(true);
  const [selectedProgram, setSelectedProgram] = useState(null);

  useEffect(() => {
    fetchPrograms();
    fetchFamilies();
    fetchAttendances();
  }, []);

  const fetchPrograms = async () => {
    try {
      const programs = await getAllPrograms();
      setPrograms(programs);
      setLoadingPrograms(false);
    } catch (error) {
      console.error('Error fetching programs', error);
      setNotification({
        open: true,
        message: 'Error fetching programs',
        severity: 'error',
      });
      setLoadingPrograms(false);
    }
  };

  const fetchFamilies = async () => {
    try {
      const families = await getFamilies();
      setFamilies(families);
      setLoadingFamilies(false);
    } catch (error) {
      console.error('Error fetching families', error);
      setNotification({
        open: true,
        message: 'Error fetching families',
        severity: 'error',
      });
      setLoadingFamilies(false);
    }
  };

  const fetchAttendances = async () => {
    try {
      const attendance = await getAttendances();
      setAttendance(attendance);
    } catch (error) {
      console.error('Error fetching attendances', error);
    }
  };

  const handleProgramSelect = (programID) => {
    setSelectedProgram(programID);
  };

  const handleAttendanceChange = async (status, programID, familyID) => {
    try {
      const userID = 2; // Hardcoded user ID
      await addOrUpdateAttendance({ ProgramID: programID, FamilyID: familyID, Status: status, UserID: userID });
      fetchAttendances(); // Refresh attendance data
      setNotification({
        open: true,
        message: `Attendance ${status} recorded successfully`,
        severity: 'success',
      });
    } catch (error) {
      console.error(`Error recording attendance as ${status}`, error);
      setNotification({
        open: true,
        message: `Error recording attendance as ${status}`,
        severity: 'error',
      });
    }
  };

  const handleCloseNotification = () => {
    setNotification({
      open: false,
      message: '',
      severity: 'success',
    });
  };

  const getFamilyAttendanceStatus = (programID, familyID) => {
    const attended = attendance.find(
      (att) => att.ProgramID === programID && att.FamilyID === familyID
    );
    return attended ? attended.Status : 'Absent';
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom align="center">
        Manage Attendance
      </Typography>
      <Typography variant="h6" gutterBottom align="center">
        Programs
      </Typography>
      {loadingPrograms ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3} sx={{ marginBottom: 3 }}>
          {programs.map((program) => (
            <Grid item xs={12} sm={6} md={4} key={program.ProgramID}>
              <Card
                sx={{
                  maxWidth: 345,
                  margin: 'auto',
                  border: selectedProgram === program.ProgramID ? '2px solid #1976d2' : 'none',
                  boxShadow: selectedProgram === program.ProgramID ? '0 4px 8px rgba(0, 0, 0, 0.2)' : 'none',
                }}
                onClick={() => handleProgramSelect(program.ProgramID)}
              >
                <CardHeader
                  avatar={<Avatar aria-label="program">{program.ProgramName.charAt(0)}</Avatar>}
                  title={program.ProgramName}
                  subheader={program.Description}
                />
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      {selectedProgram && (
        <>
          <Typography variant="h5" gutterBottom align="center" sx={{ marginTop: 3 }}>
            Families in Program {programs.find((program) => program.ProgramID === selectedProgram)?.ProgramName}
          </Typography>
          {loadingFamilies ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Grid container spacing={3}>
              {families
                .filter((family) => family.Programs.some((program) => program.ProgramID === selectedProgram))
                .map((family) => (
                  <Grid item xs={12} sm={6} md={4} key={family.FamilyID}>
                    <Card sx={{ maxWidth: 345, margin: 'auto' }}>
                      <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                          {family.FamilyHeadName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Status: {family.Status}
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={getFamilyAttendanceStatus(selectedProgram, family.FamilyID) === 'Present'}
                                onChange={() => handleAttendanceChange('Present', selectedProgram, family.FamilyID)}
                                color="primary"
                              />
                            }
                            label="Present"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={getFamilyAttendanceStatus(selectedProgram, family.FamilyID) === 'Absent'}
                                onChange={() => handleAttendanceChange('Absent', selectedProgram, family.FamilyID)}
                                color="secondary"
                              />
                            }
                            label="Absent"
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
            </Grid>
          )}
        </>
      )}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
      >
        <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ManageAttendance;
