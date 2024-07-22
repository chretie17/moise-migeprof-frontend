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
  IconButton,
  Divider,
} from '@mui/material';
import { getAllPrograms, registerFamily, updateFamily, deleteFamily, getFamilies } from '../services/Familyservice';
import CloseIcon from '@mui/icons-material/Close';
import GroupIcon from '@mui/icons-material/Group';

const RegisterFamilies = () => {
  const [programs, setPrograms] = useState([]);
  const [families, setFamilies] = useState([]);
  const [linkedFamilies, setLinkedFamilies] = useState([]);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [openLinkedFamiliesDialog, setOpenLinkedFamiliesDialog] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [selectedFamily, setSelectedFamily] = useState(null);
  const [showAllFamilies, setShowAllFamilies] = useState(false);
  const [familyData, setFamilyData] = useState({
    Address: '',
    Status: '',
    FamilyHeadName: '',
    NumberOfMembers: '',
    IncomeLevel: '',
    EducationLevel: '',
  });

  useEffect(() => {
    fetchPrograms();
    fetchFamilies();
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

  const fetchFamilies = async () => {
    try {
      const families = await getFamilies();
      setFamilies(families);
    } catch (error) {
      console.error('Error fetching families', error);
      setNotification({
        open: true,
        message: 'Error fetching families',
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

  const handleOpenDialog = (program, family = null) => {
    setSelectedProgram(program);
    setSelectedFamily(family);
    if (family) {
      setFamilyData({
        Address: family.Address,
        Status: family.Status,
        FamilyHeadName: family.FamilyHeadName,
        NumberOfMembers: family.NumberOfMembers,
        IncomeLevel: family.IncomeLevel,
        EducationLevel: family.EducationLevel,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedProgram(null);
    setSelectedFamily(null);
    setFamilyData({
      Address: '',
      Status: '',
      FamilyHeadName: '',
      NumberOfMembers: '',
      IncomeLevel: '',
      EducationLevel: '',
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
      fetchFamilies();
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

  const handleUpdateFamily = async () => {
    if (!familyData.Address || !familyData.Status) {
      setNotification({
        open: true,
        message: 'Address and Status are required',
        severity: 'error',
      });
      return;
    }

    try {
      await updateFamily(selectedFamily.FamilyID, familyData);
      setNotification({
        open: true,
        message: 'Family updated successfully',
        severity: 'success',
      });
      fetchFamilies();
      handleCloseDialog();
    } catch (error) {
      console.error('Error updating family', error);
      setNotification({
        open: true,
        message: 'Error updating family',
        severity: 'error',
      });
    }
  };

  const handleDeleteFamily = async (familyID) => {
    try {
      await deleteFamily(familyID);
      setNotification({
        open: true,
        message: 'Family deleted successfully',
        severity: 'success',
      });
      fetchFamilies();
    } catch (error) {
      console.error('Error deleting family', error);
      setNotification({
        open: true,
        message: 'Error deleting family',
        severity: 'error',
      });
    }
  };

  const handleShowLinkedFamilies = (programID) => {
    const linkedFamilies = families.filter(family =>
      family.Programs.some(program => program.ProgramID === programID)
    );
    setLinkedFamilies(linkedFamilies);
    setOpenLinkedFamiliesDialog(true);
  };

  const handleCloseNotification = () => {
    setNotification({
      open: false,
      message: '',
      severity: 'success',
    });
  };

  const handleCloseLinkedFamiliesDialog = () => {
    setOpenLinkedFamiliesDialog(false);
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom align="center">
        Register Families
      </Typography>
      <Button
        variant="contained"
        color="primary"
        startIcon={<GroupIcon />}
        onClick={() => setShowAllFamilies(!showAllFamilies)}
        sx={{ marginBottom: 2 }}
      >
        {showAllFamilies ? 'Hide All Families' : 'Show All Families'}
      </Button>
      {showAllFamilies && (
        <Grid container spacing={3} sx={{ marginTop: 3 }}>
          {families.map((family) => (
            <Grid item xs={12} sm={6} md={4} key={family.FamilyID}>
              <Card
                sx={{
                  maxWidth: 345,
                  margin: 'auto',
                  boxShadow: 3,
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  },
                }}
              >
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {family.FamilyHeadName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {family.Address}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Status: {family.Status}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" color="primary" onClick={() => handleOpenDialog(null, family)}>
                    Update
                  </Button>
                  <Button size="small" color="secondary" onClick={() => handleDeleteFamily(family.FamilyID)}>
                    Delete
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      {!showAllFamilies && (
        <Grid container spacing={3} sx={{ marginTop: 3 }}>
          {programs.map((program) => (
            <Grid item xs={12} sm={6} md={4} key={program.ProgramID}>
              <Card
                sx={{
                  maxWidth: 345,
                  margin: 'auto',
                  boxShadow: 3,
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  },
                }}
              >
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
                  <Button size="small" color="primary" onClick={() => handleShowLinkedFamilies(program.ProgramID)}>
                    View Linked Families
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      <Dialog open={openLinkedFamiliesDialog} onClose={handleCloseLinkedFamiliesDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          Linked Families
          <IconButton
            aria-label="close"
            onClick={handleCloseLinkedFamiliesDialog}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ marginTop: 3 }}>
            {linkedFamilies.map((family) => (
              <Grid item xs={12} sm={6} md={4} key={family.FamilyID}>
                <Card
                  sx={{
                    maxWidth: 345,
                    margin: 'auto',
                    boxShadow: 3,
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'scale(1.05)',
                    },
                  }}
                >
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {family.FamilyHeadName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {family.Address}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Status: {family.Status}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" color="primary" onClick={() => handleOpenDialog(null, family)}>
                      Update
                    </Button>
                    <Button size="small" color="secondary" onClick={() => handleDeleteFamily(family.FamilyID)}>
                      Delete
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
      </Dialog>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {selectedFamily ? 'Update Family' : `Register Family for ${selectedProgram?.ProgramName}`}
          <IconButton
            aria-label="close"
            onClick={handleCloseDialog}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="FamilyHeadName"
            label="Family Head Name"
            type="text"
            fullWidth
            value={familyData.FamilyHeadName}
            onChange={handleInputChange}
          />
          <TextField
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
          <TextField
            margin="dense"
            name="NumberOfMembers"
            label="Number of Members"
            type="number"
            fullWidth
            value={familyData.NumberOfMembers}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="IncomeLevel"
            label="Income Level"
            type="text"
            fullWidth
            value={familyData.IncomeLevel}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="EducationLevel"
            label="Education Level"
            type="text"
            fullWidth
            value={familyData.EducationLevel}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={selectedFamily ? handleUpdateFamily : handleRegisterFamily} color="primary">
            {selectedFamily ? 'Update' : 'Register'}
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
