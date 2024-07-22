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
  MenuItem,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { getAllContents, createContent, updateContent, deleteContent } from '../services/ContentService';
import { getAllPrograms } from '../services/ProgramService';
import ReactPlayer from 'react-player';

const ManageContents = () => {
  const [contents, setContents] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedContent, setSelectedContent] = useState(null);
  const [newContent, setNewContent] = useState({
    Title: '',
    Description: '',
    ProgramID: '',
    Video: null,
  });
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const [videoPreview, setVideoPreview] = useState(null);

  useEffect(() => {
    fetchContents();
    fetchPrograms();
  }, []);

  const fetchContents = async () => {
    try {
      const contents = await getAllContents();
      setContents(contents);
    } catch (error) {
      console.error('Error fetching contents', error);
    }
  };

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
    setNewContent({
      ...newContent,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setNewContent({
      ...newContent,
      Video: file,
    });
    setVideoPreview(URL.createObjectURL(file));
  };

  const handleCreateContent = async () => {
    if (!newContent.Title || !newContent.Description || !newContent.ProgramID || !newContent.Video) {
      setNotification({
        open: true,
        message: 'Title, Description, Program, and Video file are required',
        severity: 'error',
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append('Title', newContent.Title);
      formData.append('Description', newContent.Description);
      formData.append('ProgramID', newContent.ProgramID);
      formData.append('Video', newContent.Video);

      const response = editMode
        ? await updateContent(selectedContent.ContentID, formData)
        : await createContent(formData);

      setNotification({
        open: true,
        message: editMode ? 'Content updated successfully' : 'Content created successfully',
        severity: 'success',
      });

      setOpen(false);
      fetchContents(); // Refresh the content list
      setVideoPreview(null);
    } catch (error) {
      console.error('Error creating content', error);
      setNotification({
        open: true,
        message: 'Error creating/updating content',
        severity: 'error',
      });
    }
  };

  const handleEditContent = (content) => {
    setSelectedContent(content);
    setNewContent({
      Title: content.Title,
      Description: content.Description,
      ProgramID: content.ProgramID.toString(),
      Video: null, // Clear previous file input
    });
    setVideoPreview(content.Video ? `data:video/mp4;base64,${content.Video}` : null);
    setEditMode(true);
    setOpen(true);
  };

  const handleDeleteContent = async (contentId) => {
    try {
      await deleteContent(contentId);
      setNotification({
        open: true,
        message: 'Content deleted successfully',
        severity: 'success',
      });
      fetchContents(); // Refresh the content list
    } catch (error) {
      console.error('Error deleting content', error);
      setNotification({
        open: true,
        message: 'Error deleting content',
        severity: 'error',
      });
    }
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setEditMode(false);
    setNewContent({
      Title: '',
      Description: '',
      ProgramID: '',
      Video: null,
    });
    setVideoPreview(null);
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
        Manage Contents
      </Typography>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={() => setOpen(true)}
        sx={{ marginBottom: 2 }}
      >
        Add New Content
      </Button>
      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>{editMode ? 'Edit Content' : 'Add New Content'}</DialogTitle>
        <DialogContent sx={{ marginTop: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                autoFocus
                margin="dense"
                name="Title"
                label="Title"
                type="text"
                fullWidth
                value={newContent.Title}
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
                value={newContent.Description}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                select
                margin="dense"
                name="ProgramID"
                label="Program"
                fullWidth
                value={newContent.ProgramID}
                onChange={handleInputChange}
              >
                {programs.map((program) => (
                  <MenuItem key={program.ProgramID} value={program.ProgramID.toString()}>
                    {program.ProgramName}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" component="label">
                Upload Video
                <input type="file" hidden onChange={handleFileChange} />
              </Button>
              {newContent.Video && (
                <Typography variant="body2" sx={{ marginTop: 1 }}>
                  {newContent.Video.name}
                </Typography>
              )}
              {videoPreview && (
                <ReactPlayer
                  url={videoPreview}
                  controls
                  width="100%"
                  height="100%"
                  style={{ marginTop: 10 }}
                />
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleCreateContent} color="primary">
            {editMode ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Program</TableCell>
              <TableCell>Video</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {contents.map((content) => (
              <TableRow key={content.ContentID}>
                <TableCell>{content.Title}</TableCell>
                <TableCell>{content.Description}</TableCell>
                <TableCell>{content.Program.ProgramName}</TableCell>
                <TableCell>
                  {content.Video && (
                    <ReactPlayer
                      url={`data:video/mp4;base64,${content.Video}`}
                      controls
                      width="100%"
                      height="100%"
                    />
                  )}
                </TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleEditContent(content)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="secondary" onClick={() => handleDeleteContent(content.ContentID)}>
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

export default ManageContents;
