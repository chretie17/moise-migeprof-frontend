import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  CircularProgress,
  Box,
  Snackbar,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
} from '@mui/material';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import {
  getFieldAgentsReport,
  getProgramsAndFamiliesReport,
  getContentsReport,
  getFeedbackReport,
  getDetailedFeedbackReport,
  getAllFeedbackIDs, // Import the new function
} from '../services/ReportService';

const ReportGenerator = () => {
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [error, setError] = useState('');
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const [reportType, setReportType] = useState('');
  const [feedbackID, setFeedbackID] = useState('');
  const [feedbackIDs, setFeedbackIDs] = useState([]);

  useEffect(() => {
    if (reportType === 'detailed-feedback') {
      fetchFeedbackIDs();
    }
  }, [reportType]);

  const fetchFeedbackIDs = async () => {
    try {
      setLoading(true);
      const ids = await getAllFeedbackIDs();
      setFeedbackIDs(ids);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching feedback IDs:', err);
      setError('Error fetching feedback IDs');
      setNotification({
        open: true,
        message: 'Error fetching feedback IDs',
        severity: 'error',
      });
      setLoading(false);
    }
  };

  const handleFetchReport = async (fetchFunction) => {
    try {
      setLoading(true);
      const data = await fetchFunction();
      setReportData(data);
    } catch (err) {
      console.error('Error fetching report data:', err);
      setError('Error fetching report data');
      setNotification({
        open: true,
        message: 'Error fetching report data',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = () => {
    switch (reportType) {
      case 'field-agents':
        handleFetchReport(getFieldAgentsReport);
        break;
      case 'programs-families':
        handleFetchReport(getProgramsAndFamiliesReport);
        break;
      case 'contents':
        handleFetchReport(getContentsReport);
        break;
      case 'feedback':
        handleFetchReport(getFeedbackReport);
        break;
      case 'detailed-feedback':
        handleFetchReport(() => getDetailedFeedbackReport(feedbackID));
        break;
      default:
        break;
    }
  };

  const handleDownloadReport = () => {
    if (!reportData || !Array.isArray(reportData)) {
      setNotification({
        open: true,
        message: 'No report data available to download',
        severity: 'error',
      });
      return;
    }

    const doc = new jsPDF();
    doc.text('Admin Report', 14, 20);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
    doc.text(`Admin Email: admin@example.com`, 14, 40); // Replace with actual admin email

    const reportTitle = reportType.replace('-', ' ').toUpperCase();
    doc.text(reportTitle, 14, 50);

    const keys = Object.keys(reportData[0] || {});
    const values = reportData.map(Object.values);

    doc.autoTable({
      startY: 60,
      head: [keys],
      body: values,
    });

    doc.save(`${reportType}_report.pdf`);
  };

  const handleCloseNotification = () => {
    setNotification({
      open: false,
      message: '',
      severity: 'success',
    });
  };

  return (
    <Container maxWidth="lg" sx={{ marginTop: 4 }}>
      <Typography variant="h4" gutterBottom>
        Generate Reports
      </Typography>
      <Box sx={{ marginBottom: 2 }}>
        <FormControl fullWidth>
          <InputLabel>Report Type</InputLabel>
          <Select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            label="Report Type"
          >
            <MenuItem value="field-agents">Field Agents Report</MenuItem>
            <MenuItem value="programs-families">Programs and Families Report</MenuItem>
            <MenuItem value="contents">Contents Report</MenuItem>
            <MenuItem value="feedback">Feedback Report</MenuItem>
            <MenuItem value="detailed-feedback">Detailed Feedback Report</MenuItem>
          </Select>
        </FormControl>
      </Box>
      {reportType === 'detailed-feedback' && (
        <Box sx={{ marginBottom: 2 }}>
          <FormControl fullWidth>
            <InputLabel>Feedback ID</InputLabel>
            <Select
              value={feedbackID}
              onChange={(e) => setFeedbackID(e.target.value)}
              label="Feedback ID"
            >
              {feedbackIDs.map((id) => (
                <MenuItem key={id} value={id}>
                  {id}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      )}
      <Box sx={{ textAlign: 'center', marginTop: 4 }}>
        <Button variant="contained" color="primary" onClick={handleGenerateReport}>
          Generate Report
        </Button>
      </Box>
      {loading && (
        <Box sx={{ textAlign: 'center', marginTop: 4 }}>
          <CircularProgress />
        </Box>
      )}
      {error && (
        <Typography variant="body1" color="error" sx={{ textAlign: 'center', marginTop: 4 }}>
          {error}
        </Typography>
      )}
      {reportData && (
        <Box sx={{ textAlign: 'center', marginTop: 4 }}>
          <Button variant="contained" color="secondary" onClick={handleDownloadReport}>
            Download Report as PDF
          </Button>
        </Box>
      )}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
      >
        <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ReportGenerator;
