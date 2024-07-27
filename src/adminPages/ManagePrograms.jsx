import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Snackbar,
  Alert,
  Typography,
  Grid,
  Switch,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import GroupIcon from '@mui/icons-material/Group';
import { getAllPrograms, createProgram, updateProgram, deleteProgram, toggleProgramStatus } from '../services/ProgramService';
import { getFamilies } from '../services/Familyservice'; // Adjust the import based on your actual service structure

const ManagePrograms = () => {
  const [programs, setPrograms] = useState([]);
  const [families, setFamilies] = useState([]);
  const [open, setOpen] = useState(false);
  const [viewFamiliesOpen, setViewFamiliesOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [newProgram, setNewProgram] = useState({
    ProgramName: '',
    Description: '',
    Thumbnail: '',
  });
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    fetchPrograms();
    fetchAllFamilies();
  }, []);

  const fetchPrograms = async () => {
    try {
      const programs = await getAllPrograms();
      setPrograms(programs);
    } catch (error) {
      console.error('Error fetching programs', error);
    }
  };

  const fetchAllFamilies = async () => {
    try {
      const families = await getFamilies();
      setFamilies(families);
    } catch (error) {
      console.error('Error fetching families', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProgram({
      ...newProgram,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setNewProgram({
        ...newProgram,
        Thumbnail: reader.result.split(',')[1], // Remove the data:image/...;base64, prefix
      });
    };
    reader.readAsDataURL(file);
  };

  const handleCreateProgram = async () => {
    try {
      if (editMode && selectedProgram) {
        await updateProgram(selectedProgram.ProgramID, newProgram);
        setNotification({
          open: true,
          message: 'Program updated successfully',
          severity: 'success',
        });
      } else {
        await createProgram(newProgram);
        setNotification({
          open: true,
          message: 'Program created successfully',
          severity: 'success',
        });
      }
      setOpen(false);
      fetchPrograms(); // Refresh the program list
    } catch (error) {
      console.error('Error creating/updating program', error);
      setNotification({
        open: true,
        message: 'Error creating/updating program',
        severity: 'error',
      });
    }
  };

  const handleEditProgram = (program) => {
    setSelectedProgram(program);
    setNewProgram({
      ProgramName: program.ProgramName,
      Description: program.Description,
      Thumbnail: '', // Reset thumbnail for editing
    });
    setEditMode(true);
    setOpen(true);
  };

  const handleDeleteProgram = async (programId) => {
    try {
      await deleteProgram(programId);
      setNotification({
        open: true,
        message: 'Program deleted successfully',
        severity: 'success',
      });
      fetchPrograms(); // Refresh the program list
    } catch (error) {
      console.error('Error deleting program', error);
      setNotification({
        open: true,
        message: 'Error deleting program',
        severity: 'error',
      });
    }
  };

  const handleToggleStatus = async (programId) => {
    try {
      await toggleProgramStatus(programId);
      setNotification({
        open: true,
        message: 'Program status updated successfully',
        severity: 'success',
      });
      fetchPrograms(); // Refresh the program list
    } catch (error) {
      console.error('Error toggling program status', error);
      setNotification({
        open: true,
        message: 'Error toggling program status',
        severity: 'error',
      });
    }
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setEditMode(false);
    setNewProgram({
      ProgramName: '',
      Description: '',
      Thumbnail: '',
    });
  };

  const handleCloseNotification = () => {
    setNotification({
      open: false,
      message: '',
      severity: 'success',
    });
  };

  const handleCloseViewFamilies = () => {
    setViewFamiliesOpen(false);
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Manage Programs
      </Typography>
      <Grid container spacing={2} sx={{ marginBottom: 2 }}>
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setOpen(true)}
          >
            Add New Program
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            startIcon={<GroupIcon />}
            onClick={() => setViewFamiliesOpen(true)}
          >
            View Families
          </Button>
        </Grid>
      </Grid>
      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>{editMode ? 'Edit Program' : 'Add New Program'}</DialogTitle>
        <DialogContent sx={{ marginTop: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                autoFocus
                margin="dense"
                name="ProgramName"
                label="Program Name"
                type="text"
                fullWidth
                value={newProgram.ProgramName}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="dense"
                name="Description"
                label="Description"
                type="text"
                fullWidth
                value={newProgram.Description}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" component="label">
                Upload Thumbnail
                <input type="file" hidden onChange={handleFileChange} />
              </Button>
              {newProgram.Thumbnail && (
                <img
                  src={`data:image/jpeg;base64,${newProgram.Thumbnail}`}
                  alt="Thumbnail Preview"
                  style={{ marginTop: 10, width: 100, height: 100 }}
                />
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleCreateProgram} color="primary">
            {editMode ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>Program Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Thumbnail</TableCell>
              <TableCell>Active</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {programs.map((program) => (
              <TableRow key={program.ProgramID}>
                <TableCell>{program.ProgramName}</TableCell>
                <TableCell>{program.Description}</TableCell>
                <TableCell>
                  {program.Thumbnail && (
                    <img
                      src={`data:image/jpeg;base64,${program.Thumbnail}`}
                      alt="Thumbnail"
                      style={{ width: 100, height: 100 }}
                    />
                  )}
                </TableCell>
                <TableCell>
                  <Switch
                    checked={program.IsActive}
                    onChange={() => handleToggleStatus(program.ProgramID)}
                    color="primary"
                  />
                </TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleEditProgram(program)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="secondary" onClick={() => handleDeleteProgram(program.ProgramID)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={viewFamiliesOpen} onClose={handleCloseViewFamilies} maxWidth="md" fullWidth>
        <DialogTitle>Families in Programs</DialogTitle>
        <DialogContent>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Family Head Name</TableCell>
                  <TableCell>Address</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Number of Members</TableCell>
                  <TableCell>Income Level</TableCell>
                  <TableCell>Education Level</TableCell>
                  <TableCell>Province</TableCell>
                  <TableCell>District</TableCell>
                  <TableCell>Sector</TableCell>
                  <TableCell>Cell</TableCell>
                  <TableCell>Village</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {families.map((family) => (
                  <TableRow key={family.FamilyID}>
                    <TableCell>{family.FamilyHeadName}</TableCell>
                    <TableCell>{family.Address}</TableCell>
                    <TableCell>{family.Status}</TableCell>
                    <TableCell>{family.NumberOfMembers}</TableCell>
                    <TableCell>{family.IncomeLevel}</TableCell>
                    <TableCell>{family.EducationLevel}</TableCell>
                    <TableCell>{family.Province}</TableCell>
                    <TableCell>{family.District}</TableCell>
                    <TableCell>{family.Sector}</TableCell>
                    <TableCell>{family.Cell}</TableCell>
                    <TableCell>{family.Village}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseViewFamilies} color="primary">
            Close
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

export default ManagePrograms;
