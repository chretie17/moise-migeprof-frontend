import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Snackbar,
  Alert,
  MenuItem,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import ReactStars from 'react-rating-stars-component';
import { getAllPrograms } from '../services/Familyservice';
import { submitFeedback } from '../services/FieldFeedbackservice';

const FeedbackForm = () => {
  const [programs, setPrograms] = useState([]);
  const [feedbackData, setFeedbackData] = useState({
    fullName: '',
    email: '',
    serviceName: '',
    programId: '',
    sessionDate: '',
    constructiveFeedback: '',
    uncertainties: '',
    recommend: false,
    additionalComments: '',
    rating: 0, // Initialize rating field
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
    const { name, value, type, checked } = e.target;
    setFeedbackData({
      ...feedbackData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleRatingChange = (newRating) => {
    setFeedbackData((prevData) => ({
      ...prevData,
      rating: newRating,
    }));
  };

  const handleSubmitFeedback = async () => {
    try {
      await submitFeedback(feedbackData);
      setNotification({
        open: true,
        message: 'Feedback submitted successfully',
        severity: 'success',
      });
      setFeedbackData({
        fullName: '',
        email: '',
        serviceName: '',
        programId: '',
        sessionDate: '',
        constructiveFeedback: '',
        uncertainties: '',
        recommend: false,
        additionalComments: '',
        rating: 0,
      });
    } catch (error) {
      console.error('Error submitting feedback', error);
      setNotification({
        open: true,
        message: 'Error submitting feedback',
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
    <Box
      sx={{
        maxWidth: 600,
        mx: 'auto',
        mt: 5,
        p: 3,
        border: '1px solid #ccc',
        borderRadius: 2,
        boxShadow: 2,
      }}
    >
      <Typography variant="h5" gutterBottom align="center">
        Field Agent Program Feedback Form
      </Typography>
      <TextField
        margin="normal"
        fullWidth
        label="Full Name"
        name="fullName"
        value={feedbackData.fullName}
        onChange={handleInputChange}
        required
      />
      <TextField
        margin="normal"
        fullWidth
        label="Your Email"
        name="email"
        value={feedbackData.email}
        onChange={handleInputChange}
        required
      />
      <TextField
        margin="normal"
        fullWidth
        label="Service Name"
        name="serviceName"
        value={feedbackData.serviceName}
        onChange={handleInputChange}
        required
      />
      <TextField
        select
        margin="normal"
        fullWidth
        label="Program Name"
        name="programId"
        value={feedbackData.programId}
        onChange={handleInputChange}
        required
      >
        {programs.map((program) => (
          <MenuItem key={program.ProgramID} value={program.ProgramID}>
            {program.ProgramName}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        margin="normal"
        fullWidth
        label="Session Date"
        name="sessionDate"
        type="date"
        value={feedbackData.sessionDate}
        onChange={handleInputChange}
        InputLabelProps={{ shrink: true }}
        required
      />
      <TextField
        margin="normal"
        fullWidth
        label="Constructive Feedback"
        name="constructiveFeedback"
        multiline
        rows={4}
        value={feedbackData.constructiveFeedback}
        onChange={handleInputChange}
        required
      />
      <TextField
        margin="normal"
        fullWidth
        label="Uncertainties Encountered"
        name="uncertainties"
        multiline
        rows={4}
        value={feedbackData.uncertainties}
        onChange={handleInputChange}
        required
      />
      <FormControlLabel
        control={
          <Checkbox
            name="recommend"
            checked={feedbackData.recommend}
            onChange={handleInputChange}
          />
        }
        label="Would You Recommend This Program?"
      />
      <TextField
        margin="normal"
        fullWidth
        label="Additional Comments"
        name="additionalComments"
        multiline
        rows={4}
        value={feedbackData.additionalComments}
        onChange={handleInputChange}
      />
      <Typography variant="h6" gutterBottom>
        Rating
      </Typography>
      <ReactStars
        count={5}
        value={feedbackData.rating}
        onChange={handleRatingChange}
        size={24}
        activeColor="#ffd700"
      />
      <Button
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 2 }}
        onClick={handleSubmitFeedback}
      >
        Submit Feedback
      </Button>
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

export default FeedbackForm;
