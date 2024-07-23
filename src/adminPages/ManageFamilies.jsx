import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
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
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { getFamiliesByProgram, updateFamily, deleteFamily } from '../services/Familyservice';

const ManageFamilies = ({ programId, onClose }) => {
  const [families, setFamilies] = useState([]);
  const [selectedFamily, setSelectedFamily] = useState(null);
  const [familyData, setFamilyData] = useState({
    Address: '',
    Status: '',
    FamilyHeadName: '',
    NumberOfMembers: '',
    IncomeLevel: '',
    EducationLevel: '',
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    fetchFamilies();
  }, []);

  const fetchFamilies = async () => {
    try {
      const families = await getFamiliesByProgram(programId);
      setFamilies(families);
    } catch (error) {
      console.error('Error fetching families', error);
    }
  };

  const handleOpenDialog = (family) => {
    setSelectedFamily(family);
    setFamilyData({
      Address: family.Address,
      Status: family.Status,
      FamilyHeadName: family.FamilyHeadName,
      NumberOfMembers: family.NumberOfMembers,
      IncomeLevel: family.IncomeLevel,
      EducationLevel: family.EducationLevel,
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFamilyData({
      ...familyData,
      [name]: value,
    });
  };

  const handleUpdateFamily = async () => {
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
    <Box>
      <Typography variant="h6" gutterBottom>
        Families in Program
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Family Head Name</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {families.map((family) => (
              <TableRow key={family.FamilyID}>
                <TableCell>{family.FamilyHeadName}</TableCell>
                <TableCell>{family.Address}</TableCell>
                <TableCell>{family.Status}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleOpenDialog(family)}>
                    <EditIcon />
                  </IconButton>
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
        <DialogTitle>Edit Family</DialogTitle>
        <DialogContent>
          <TextField
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
          <Button onClick={handleUpdateFamily} color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
      >
        <Alert onClose={handleCloseNotification} severity={notification.severity}>
          {notification.message}
        </Alert>
      </Snackbar>

      <Button variant="contained" color="primary" onClick={onClose} sx={{ marginTop: 2 }}>
        Close
      </Button>
    </Box>
  );
};

export default ManageFamilies;
