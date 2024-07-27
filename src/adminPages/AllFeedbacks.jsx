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
  Snackbar,
  Alert,
  Rating
} from '@mui/material';
import { getAllFeedback } from '../services/feedbackservice';

const ManageFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const feedbacks = await getAllFeedback();
      setFeedbacks(feedbacks);
    } catch (error) {
      console.error('Error fetching feedbacks', error);
      setNotification({
        open: true,
        message: 'Error fetching feedbacks',
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
    <Box sx={{ padding: 3, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Manage Feedback
      </Typography>
      <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2 }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell>Program Name</TableCell>
              <TableCell>Full Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Service Name</TableCell>
              <TableCell>Session Date</TableCell>
              <TableCell>Constructive Feedback</TableCell>
              <TableCell>Uncertainties</TableCell>
              <TableCell>Recommend</TableCell>
              <TableCell>Additional Comments</TableCell>
              <TableCell>Rating</TableCell>
              <TableCell>Total Attendance</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {feedbacks.map((feedback) => (
              <TableRow key={feedback.FeedbackID}>
                <TableCell>{feedback.Program?.ProgramName}</TableCell>
                <TableCell>{feedback.fullName}</TableCell>
                <TableCell>{feedback.email}</TableCell>
                <TableCell>{feedback.serviceName}</TableCell>
                <TableCell>{feedback.sessionDate}</TableCell>
                <TableCell>{feedback.constructiveFeedback}</TableCell>
                <TableCell>{feedback.uncertainties}</TableCell>
                <TableCell>{feedback.recommend ? 'Yes' : 'No'}</TableCell>
                <TableCell>{feedback.additionalComments}</TableCell>
                <TableCell>
                  <Rating value={feedback.Rating} readOnly />
                </TableCell>
                <TableCell>{feedback.TotalAttendance}</TableCell>
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

export default ManageFeedback;
