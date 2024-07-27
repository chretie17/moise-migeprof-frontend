import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Divider
} from '@mui/material';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Label
} from 'recharts';
import { getDashboardStats } from '../services/DashboardService';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const AdminDashboard = () => {
  const [dashboardStats, setDashboardStats] = useState({
    attendanceStats: { totalAttendance: 0, attendanceByProgram: [] },
    contentStats: { totalContents: 0, contentsByProgram: [] },
    familyStats: { totalFamilies: 0, familiesByProgram: [] },
    feedbackStats: { totalFeedbacks: 0, feedbackByRating: [] },
    programStats: { totalPrograms: 0, activePrograms: 0 }
  });

  useEffect(() => {
    const fetchData = async () => {
      const data = await getDashboardStats();
      setDashboardStats(data);
    };

    fetchData();
  }, []);

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* Total Attendance */}
        <Grid item xs={12} md={6} lg={4}>
          <Card>
            <CardHeader title="Total Attendance" />
            <CardContent>
              <Typography variant="h3">{dashboardStats.attendanceStats.totalAttendance}</Typography>
              <Divider sx={{ my: 2 }} />
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={dashboardStats.attendanceStats.attendanceByProgram}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="ProgramID">
                    <Label value="Program ID" offset={-5} position="insideBottom" />
                  </XAxis>
                  <YAxis>
                    <Label value="Attendance Count" angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} />
                  </YAxis>
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Total Contents */}
        <Grid item xs={12} md={6} lg={4}>
          <Card>
            <CardHeader title="Total Contents" />
            <CardContent>
              <Typography variant="h3">{dashboardStats.contentStats.totalContents}</Typography>
              <Divider sx={{ my: 2 }} />
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={dashboardStats.contentStats.contentsByProgram}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="ProgramID">
                    <Label value="Program ID" offset={-5} position="insideBottom" />
                  </XAxis>
                  <YAxis>
                    <Label value="Content Count" angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} />
                  </YAxis>
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Total Families */}
        <Grid item xs={12} md={6} lg={4}>
          <Card>
            <CardHeader title="Total Families" />
            <CardContent>
              <Typography variant="h3">{dashboardStats.familyStats.totalFamilies}</Typography>
              <Divider sx={{ my: 2 }} />
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={dashboardStats.familyStats.familiesByProgram}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="ProgramID">
                    <Label value="Program ID" offset={-5} position="insideBottom" />
                  </XAxis>
                  <YAxis>
                    <Label value="Family Count" angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} />
                  </YAxis>
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#ffc658" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Total Feedbacks */}
        <Grid item xs={12} md={6} lg={4}>
          <Card>
            <CardHeader title="Total Feedbacks" />
            <CardContent>
              <Typography variant="h3">{dashboardStats.feedbackStats.totalFeedbacks}</Typography>
              <Divider sx={{ my: 2 }} />
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={dashboardStats.feedbackStats.feedbackByRating}
                    dataKey="count"
                    nameKey="Rating"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    label
                  >
                    {dashboardStats.feedbackStats.feedbackByRating.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Total Programs */}
        <Grid item xs={12} md={6} lg={4}>
          <Card>
            <CardHeader title="Total Programs" />
            <CardContent>
              <Typography variant="h3">{dashboardStats.programStats.totalPrograms}</Typography>
              <Typography variant="h6">Active Programs: {dashboardStats.programStats.activePrograms}</Typography>
              <Divider sx={{ my: 2 }} />
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={[
                  { name: 'Active', value: dashboardStats.programStats.activePrograms },
                  { name: 'Inactive', value: dashboardStats.programStats.totalPrograms - dashboardStats.programStats.activePrograms }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name">
                    <Label value="Program Status" offset={-5} position="insideBottom" />
                  </XAxis>
                  <YAxis>
                    <Label value="Program Count" angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} />
                  </YAxis>
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

      </Grid>
    </Box>
  );
};

export default AdminDashboard;
