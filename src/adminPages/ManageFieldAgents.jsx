import React, { useState, useEffect } from 'react';
import { getAllUsers, createUser, updateUser, deleteUser, toggleUserActivation } from '../services/api';
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

const ManageFieldAgents = () => {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    password: '',
    role: 'field-agent',
  });
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const users = await getAllUsers();
      setUsers(users);
    } catch (error) {
      console.error('Error fetching users', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser({
      ...newUser,
      [name]: value,
    });
  };

  const handleCreateUser = async () => {
    try {
      if (editMode) {
        await updateUser(selectedUser.UserID, newUser);
        setNotification({
          open: true,
          message: 'User updated successfully',
          severity: 'success',
        });
      } else {
        await createUser(newUser);
        setNotification({
          open: true,
          message: 'User created successfully',
          severity: 'success',
        });
      }
      setOpen(false);
      fetchUsers(); // Refresh the user list
    } catch (error) {
      console.error('Error creating user', error);
      setNotification({
        open: true,
        message: 'Error creating/updating user',
        severity: 'error',
      });
    }
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setNewUser({
      username: user.Username,
      email: user.Email,
      password: '',
      role: user.Role,
    });
    setEditMode(true);
    setOpen(true);
  };

  const handleDeleteUser = async (userId) => {
    try {
      await deleteUser(userId);
      setNotification({
        open: true,
        message: 'User deleted successfully',
        severity: 'success',
      });
      fetchUsers(); // Refresh the user list
    } catch (error) {
      console.error('Error deleting user', error);
      setNotification({
        open: true,
        message: 'Error deleting user',
        severity: 'error',
      });
    }
  };

  const handleToggleActivation = async (userId) => {
    try {
      await toggleUserActivation(userId);
      setNotification({
        open: true,
        message: 'User activation status changed',
        severity: 'success',
      });
      fetchUsers(); // Refresh the user list
    } catch (error) {
      console.error('Error toggling user activation', error);
      setNotification({
        open: true,
        message: 'Error toggling user activation',
        severity: 'error',
      });
    }
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setEditMode(false);
    setNewUser({
      username: '',
      email: '',
      password: '',
      role: 'field-agent',
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
        Manage Field Agents
      </Typography>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={() => setOpen(true)}
        sx={{ marginBottom: 2 }}
      >
        Add New User
      </Button>
      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>{editMode ? 'Edit User' : 'Add New User'}</DialogTitle>
        <DialogContent sx={{ marginTop: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                autoFocus
                margin="dense"
                name="username"
                label="Username"
                type="text"
                fullWidth
                value={newUser.username}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="dense"
                name="email"
                label="Email Address"
                type="email"
                fullWidth
                value={newUser.email}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="dense"
                name="password"
                label="Password"
                type="password"
                fullWidth
                value={newUser.password}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleCreateUser} color="primary">
            {editMode ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>Username</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Active</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.UserID}>
                <TableCell>{user.Username}</TableCell>
                <TableCell>{user.Email}</TableCell>
                <TableCell>{user.Role}</TableCell>
                <TableCell>
                  <Switch
                    checked={user.IsActive}
                    onChange={() => handleToggleActivation(user.UserID)}
                    color="primary"
                  />
                </TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleEditUser(user)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="secondary" onClick={() => handleDeleteUser(user.UserID)}>
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

export default ManageFieldAgents;
