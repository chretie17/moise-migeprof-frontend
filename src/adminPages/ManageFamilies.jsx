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
  Snackbar,
  Alert,
  Typography,
  Grid,
  IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { getFamilies, registerFamily, deleteFamily } from '../services/Familyservice';

const ManageFamilies = ({ programId, onClose }) => {
  const [families, setFamilies] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const [familyData, setFamilyData] = useState({
    FamilyHeadName: '',
    Address: '',
    Status: '',
    NumberOfMembers: '',
    IncomeLevel: '',
    EducationLevel: '',
    Province: '',
    District: '',
    Sector: '',
    Cell: '',
    Village: '',
  });

  useEffect(() => {
    fetchFamilies();
  }, [programId]);

  const fetchFamilies = async () => {
    try {
      const families = await getFamilies();
      setFamilies(families);
    } catch (error) {
      console.error('Error fetching families', error);
    }
  };

  const handleOpenDialog = () => {
    setFamilyData({
      FamilyHeadName: '',
      Address: '',
      Status: '',
      NumberOfMembers: '',
      IncomeLevel: '',
      EducationLevel: '',
      Province: '',
      District: '',
      Sector: '',
      Cell: '',
      Village: '',
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFamilyData({
      ...familyData,
      [name]: value,
    });
  };

  const handleSaveFamily = async () => {
    try {
      await registerFamily({ ...familyData, ProgramID: programId });
      setNotification({
        open: true,
        message: 'Family created successfully',
        severity: 'success',
      });
      fetchFamilies();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving family', error);
      setNotification({
        open: true,
        message: 'Error saving family',
        severity: 'error',
      });
    }
  };

  const handleDeleteFamily = async (familyId) => {
    try {
      await deleteFamily(familyId);
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
        Families in Program
      </Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>Program Name</TableCell>
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
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {families.map((family) => (
              <TableRow key={family.FamilyID}>
                <TableCell>{family.Programs}</TableCell>
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
                <TableCell>
                  <IconButton color="secondary" onClick={() => handleDeleteFamily(family.FamilyID)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Add New Family</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                margin="dense"
                name="FamilyHeadName"
                label="Family Head Name"
                type="text"
                fullWidth
                value={familyData.FamilyHeadName}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="dense"
                name="Address"
                label="Address"
                type="text"
                fullWidth
                value={familyData.Address}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="dense"
                name="Status"
                label="Status"
                type="text"
                fullWidth
                value={familyData.Status}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="dense"
                name="NumberOfMembers"
                label="Number of Members"
                type="number"
                fullWidth
                value={familyData.NumberOfMembers}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="dense"
                name="IncomeLevel"
                label="Income Level"
                type="text"
                fullWidth
                value={familyData.IncomeLevel}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="dense"
                name="EducationLevel"
                label="Education Level"
                type="text"
                fullWidth
                value={familyData.EducationLevel}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="dense"
                name="Province"
                label="Province"
                type="text"
                fullWidth
                value={familyData.Province}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="dense"
                name="District"
                label="District"
                type="text"
                fullWidth
                value={familyData.District}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="dense"
                name="Sector"
                label="Sector"
                type="text"
                fullWidth
                value={familyData.Sector}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="dense"
                name="Cell"
                label="Cell"
                type="text"
                fullWidth
                value={familyData.Cell}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="dense"
                name="Village"
                label="Village"
                type="text"
                fullWidth
                value={familyData.Village}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSaveFamily} color="primary">
            Add
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

export default ManageFamilies;
