import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Box, List, ListItem, ListItemText, ListItemIcon, Divider, Drawer, Toolbar, Typography } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import UpdateIcon from '@mui/icons-material/Update';
import Diversity1Icon from '@mui/icons-material/Diversity1';
import ReportIcon from '@mui/icons-material/Report';
import FeedbackIcon from '@mui/icons-material/Feedback';
import './Sidebar.css'; // Import the CSS file here
import logo from '../assets/coats.png'; // Import the logo image

const drawerWidth = 260;

const Sidebar = ({ role }) => {
  const location = useLocation();

  const adminLinks = [
    { text: 'Dashboard', path: '/dashboard/admin', icon: <DashboardIcon /> },
    { text: 'Manage Field Agents', path: '/manage-field-agents', icon: <PeopleIcon /> },
    { text: 'Track Program', path: '/track-activities', icon: <TrackChangesIcon /> },
    { text: 'Manage Families', path: '/manage-families', icon: <Diversity1Icon /> },
    { text: 'Update Content', path: '/update-content', icon: <UpdateIcon /> },
    { text: 'All Feedbacks', path: '/manage-feedbacks', icon: <FeedbackIcon /> },
    { text: 'All Attendance', path: '/manage-attendance', icon: <ReportIcon /> },
    { text: 'View Reports', path: '/view-reports', icon: <ReportIcon /> },
  ];

  const fieldAgentLinks = [
    { text: 'Dashboard', path: '/dashboard/field-agent', icon: <DashboardIcon /> },
    { text: 'Access Materials', path: '/access-materials', icon: <UpdateIcon /> },
    { text: 'Register Families', path: '/register-families', icon: <PeopleIcon /> },
    { text: 'Track Attendance', path: '/track-attendance', icon: <TrackChangesIcon /> },
    { text: 'Field Feedback', path: '/submit-feedback', icon: <FeedbackIcon /> },
  ];

  const links = role === 'admin' ? adminLinks : fieldAgentLinks;

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: '#fff',
          borderRight: '1px solid #e0e0e0',
        },
      }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1rem 0' }}>
        <img src={logo} alt="Logo" style={{ width: '50px', height: '50px', marginRight: '10px' }} />
        <Typography variant="h6" noWrap component="div" sx={{ color: '#00b98e', fontWeight: 'bold' }}>
          MIGEPROF
        </Typography>
      </Toolbar>
      <Divider />
      <Box sx={{ overflow: 'auto' }}>
        <List>
          {links.map((link, index) => (
            <ListItem
              button
              component={Link}
              to={link.path}
              key={index}
              sx={{
                backgroundColor: location.pathname === link.path ? '#00b98e' : 'inherit',
                color: location.pathname === link.path ? '#fff' : '#000',
                '&:hover': {
                  backgroundColor: '#00b98e',
                  color: '#fff',
                },
                '&:before': {
                  content: '""',
                  display: 'block',
                  position: 'absolute',
                  height: '100%',
                  width: '4px',
                  backgroundColor: location.pathname === link.path ? '#00b98e' : 'transparent',
                  left: 0,
                  top: 0,
                },
                position: 'relative',
                transition: 'all 0.3s ease',
                my: 0.5,
                py: 1.5,
                px: 2.5,
              }}
            >
              <ListItemIcon sx={{ color: location.pathname === link.path ? '#fff' : '#00b98e' }}>
                {link.icon}
              </ListItemIcon>
              <ListItemText primary={link.text} primaryTypographyProps={{ fontWeight: 'medium' }} />
            </ListItem>
          ))}
        </List>
        <Divider />
      </Box>
    </Drawer>
  );
};

export default Sidebar;
