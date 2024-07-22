import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  Snackbar,
  Alert,
} from '@mui/material';
import { getAllContents } from '../services/ContentService';
import { submitFeedback, getAllFeedback } from '../services/feedbackservice';
import ReactPlayer from 'react-player';
import Rating from 'react-rating-stars-component';

const AccessMaterials = () => {
  const [contents, setContents] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    fetchContents();
    fetchFeedbacks();
  }, []);

  const fetchContents = async () => {
    try {
      const contents = await getAllContents();
      setContents(contents);
    } catch (error) {
      console.error('Error fetching contents', error);
      setNotification({
        open: true,
        message: 'Error fetching contents',
        severity: 'error',
      });
    }
  };

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

  const handleRatingChange = async (newRating, contentId) => {
    try {
      const feedbackData = {
        ContentID: contentId,
        Rating: newRating,
        FamilyID: 2, // Use appropriate FamilyID or retrieve it from context/state
      };

      const existingFeedback = feedbacks.find(
        (feedback) => feedback.ContentID === contentId && feedback.FamilyID === 2
      );

      if (existingFeedback) {
        feedbackData.FeedbackID = existingFeedback.FeedbackID;
      }

      await submitFeedback(feedbackData);
      fetchFeedbacks(); // Refresh feedback data

      setNotification({
        open: true,
        message: 'Feedback submitted successfully',
        severity: 'success',
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

  const getContentRating = (contentId) => {
    const feedback = feedbacks.find(
      (feedback) => feedback.ContentID === contentId && feedback.FamilyID === 2
    );
    return feedback ? feedback.Rating : 0;
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom align="center">
        Access Materials
      </Typography>
      <Grid container spacing={3}>
        {contents.map((content) => (
          <Grid item xs={12} sm={6} md={4} key={content.ContentID}>
            <Card sx={{ maxWidth: 345, margin: 'auto' }}>
              <CardActionArea>
                <CardMedia>
                  {content.Video && (
                    <ReactPlayer
                      url={`data:video/mp4;base64,${content.Video}`}
                      controls
                      width="100%"
                      height="200px"
                    />
                  )}
                </CardMedia>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {content.Title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {content.Description}
                  </Typography>
                  <Rating
                    count={10}
                    size={30}
                    value={getContentRating(content.ContentID)}
                    onChange={(newRating) => handleRatingChange(newRating, content.ContentID)}
                  />
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
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

export default AccessMaterials;
