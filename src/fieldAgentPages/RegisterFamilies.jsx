import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Snackbar,
  Alert,
} from '@mui/material';
import { getAllPrograms, registerFamily } from '../services/FamilyService';

const RegisterFamilies = () => {
  const [programs, setPrograms] = useState([]);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [familyData, setFamilyData] = useState({
    Address: '',
    Status: '',
  });

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      const programs = await getAllPrograms();
      setPrograms(programs);
    } catch (error) {
      console.error('Error fetching programs', error);
      setNotification({
        open: true,
        message: 'Error fetching programs',
        severity: 'error',
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFamilyData({
      ...familyData,
      [name]: value,
    });
  };

  const handleOpenDialog = (program) => {
    setSelectedProgram(program);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedProgram(null);
    setFamilyData({
      Address: '',
      Status: '',
    });
  };

  const handleRegisterFamily = async () => {
    if (!familyData.Address || !familyData.Status) {
      setNotification({
        open: true,
        message: 'Address and Status are required',
        severity: 'error',
      });
      return;
    }

    try {
      await registerFamily({ ...familyData, ProgramID: selectedProgram.ProgramID });
      setNotification({
        open: true,
        message: 'Family registered successfully',
        severity: 'success',
      });
      handleCloseDialog();
    } catch (error) {
      console.error('Error registering family', error);
      setNotification({
        open: true,
        message: 'Error registering family',
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

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom align="center">
        Register Families
      </Typography>
      <Grid container spacing={3} sx={{ marginTop: 3 }}>
        {programs.map((program) => (
          <Grid item xs={12} sm={6} md={4} key={program.ProgramID}>
            <Card sx={{ maxWidth: 345, margin: 'auto' }}>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {program.ProgramName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {program.Description}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary" onClick={() => handleOpenDialog(program)}>
                  Register Family
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Register Family for {selectedProgram?.ProgramName}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="Address"
            label="Address"
            type="text"
            fullWidth
            value={familyData.Address}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="Status"
            label="Status"
            type="text"
            fullWidth
            value={familyData.Status}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleRegisterFamily} color="primary">
            Register
          </Button>
        </DialogActions>
      </Dialog>
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

export default RegisterFamilies;
