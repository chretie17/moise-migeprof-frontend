import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  IconButton,
  Snackbar,
  Alert,
} from '@mui/material';
import { getAllContents } from '../services/ContentService';
import ReactPlayer from 'react-player';

const AccessMaterials = () => {
  const [contents, setContents] = useState([]);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    fetchContents();
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

  const handleCloseNotification = () => {
    setNotification({
      open: false,
      message: '',
      severity: 'success',
    });
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
