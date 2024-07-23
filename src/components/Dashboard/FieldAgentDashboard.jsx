import React, { useEffect, useState } from 'react';
import { Box, Grid, Paper, Typography, CircularProgress } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from 'recharts';
import { getFieldAgentStats } from '../../services/DashboardService';
import { styled } from '@mui/material/styles';

const COLORS = ['#00b98e', '#FFBB28', '#FF8042', '#0088FE', '#00C49F'];

const LoaderWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  backgroundColor: theme.palette.background.default,
}));

const FieldAgentDashboard = () => {
  const [data, setData] = useState({
    programStats: [],
    contentStats: [],
    familyStats: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const stats = await getFieldAgentStats();
        setData(stats);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching field agent stats', error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <LoaderWrapper>
        <CircularProgress />
      </LoaderWrapper>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, p: 3, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', mb: 4, color: '#1976d2' }}>
        Field Agent Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Programs and Attendances
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.programStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="ProgramName" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="attendanceCount" fill="#00b98e" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Content by Program
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.contentStats}
                  dataKey="contentCount"
                  nameKey="Program.ProgramName"
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  fill="#00b98e"
                  label
                >
                  {data.contentStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              Total Families Registered
            </Typography>
            <Typography variant="h2" gutterBottom>
              {data.familyStats}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FieldAgentDashboard;
