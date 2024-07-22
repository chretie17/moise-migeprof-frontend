import React, { useState, useEffect } from 'react';
import { getAllPrograms, createProgram, updateProgram, deleteProgram, toggleProgramStatus } from '../services/ProgramService';
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

const ManagePrograms = () => {
  const [programs, setPrograms] = useState([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
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
  }, []);

  const fetchPrograms = async () => {
    try {
      const programs = await getAllPrograms();
      setPrograms(programs);
    } catch (error) {
      console.error('Error fetching programs', error);
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
      if (editMode) {
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
      console.error('Error creating program', error);
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

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Manage Programs
      </Typography>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={() => setOpen(true)}
        sx={{ marginBottom: 2 }}
      >
        Add New Program
      </Button>
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
