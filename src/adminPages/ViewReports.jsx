import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Grid,
  Button,
  CircularProgress,
  Box,
  Card,
  CardContent,
  CardHeader,
} from '@mui/material';
import { getAdminReport } from '../services/ReportService';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from 'recharts';

const AdminReport = () => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const data = await getAdminReport();
        console.log('Fetched Report Data:', data); // Log fetched data for debugging
        setReportData(data);
      } catch (err) {
        console.error('Error fetching report data:', err);
        setError('Error fetching report data');
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, []);

  const handleDownload = () => {
    const doc = new jsPDF();
    doc.text('Admin Report', 14, 20);

    if (reportData) {
      doc.autoTable({
        startY: 30,
        head: [['Metric', 'Value']],
        body: [
          ['Total Programs', reportData.totalPrograms],
          ['Total Contents', reportData.totalContents],
          ['Total Families', reportData.totalFamilies],
          ['Total Attendances', reportData.totalAttendances],
          ['Average Feedback Rating', reportData.averageFeedbackRating],
        ],
      });

      doc.autoTable({
        startY: doc.previousAutoTable.finalY + 10,
        head: [['Program', 'Attendances']],
        body: (reportData.attendanceByProgram || []).map((program) => [
          program['Program.ProgramName'],
          program.AttendanceCount,
        ]),
      });

      doc.autoTable({
        startY: doc.previousAutoTable.finalY + 10,
        head: [['Rating', 'Count']],
        body: (reportData.feedbackByRating || []).map((feedback) => [
          feedback.Rating,
          feedback.Count,
        ]),
      });
    }

    doc.save('admin_report.pdf');
  };

  if (loading) {
    return (
      <Container>
        <Typography variant="h4" gutterBottom>
          Admin Report
        </Typography>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography variant="h4" gutterBottom>
          Admin Report
        </Typography>
        <Typography variant="body1" color="error">
          {error}
        </Typography>
      </Container>
    );
  }

  if (!reportData) {
    return (
      <Container>
        <Typography variant="h4" gutterBottom>
          Admin Report
        </Typography>
        <Typography variant="body1" color="error">
          No data available
        </Typography>
      </Container>
    );
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <Container maxWidth="lg" sx={{ marginTop: 4 }}>
      <Typography variant="h4" gutterBottom>
        Admin Report
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Key Metrics" />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Paper elevation={3} sx={{ padding: 2 }}>
                    <Typography variant="body2">Total Programs</Typography>
                    <Typography variant="h5">{reportData.totalPrograms}</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6}>
                  <Paper elevation={3} sx={{ padding: 2 }}>
                    <Typography variant="body2">Total Contents</Typography>
                    <Typography variant="h5">{reportData.totalContents}</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6}>
                  <Paper elevation={3} sx={{ padding: 2 }}>
                    <Typography variant="body2">Total Families</Typography>
                    <Typography variant="h5">{reportData.totalFamilies}</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6}>
                  <Paper elevation={3} sx={{ padding: 2 }}>
                    <Typography variant="body2">Total Attendances</Typography>
                    <Typography variant="h5">{reportData.totalAttendances}</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12}>
                  <Paper elevation={3} sx={{ padding: 2 }}>
                    <Typography variant="body2">Average Feedback Rating</Typography>
                    <Typography variant="h5">{reportData.averageFeedbackRating}</Typography>
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Attendances by Program" />
            <CardContent>
              {reportData.attendanceByProgram && reportData.attendanceByProgram.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={reportData.attendanceByProgram}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="Program.ProgramName" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="AttendanceCount" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <Typography variant="body1">No attendance data available</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardHeader title="Feedback by Rating" />
            <CardContent>
              {reportData.feedbackByRating && reportData.feedbackByRating.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={reportData.feedbackByRating}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="Count"
                    >
                      {reportData.feedbackByRating.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <Typography variant="body1">No feedback data available</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Box sx={{ textAlign: 'center', marginTop: 4 }}>
        <Button variant="contained" color="primary" onClick={handleDownload}>
          Download Report as PDF
        </Button>
      </Box>
    </Container>
  );
};

export default AdminReport;
