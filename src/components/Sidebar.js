import React from 'react';
import { Link } from 'react-router-dom';
import { Box, List, ListItem, ListItemText, ListItemIcon, Divider, Drawer, Toolbar } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import UpdateIcon from '@mui/icons-material/Update';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ReportIcon from '@mui/icons-material/Report';
import FeedbackIcon from '@mui/icons-material/Feedback';
import './Sidebar.css'; // Import the CSS file here

const drawerWidth = 240;

const Sidebar = ({ role }) => {
  const adminLinks = [
    { text: 'Dashboard', path: '/dashboard/admin', icon: <DashboardIcon /> },
    { text: 'Manage Field Agents', path: '/manage-field-agents', icon: <PeopleIcon /> },
    { text: 'Track Program', path: '/track-activities', icon: <TrackChangesIcon /> },
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
    { text: 'Submit Field Feedback', path: '/submit-feedback', icon: <FeedbackIcon /> },
  ];

  const links = role === 'admin' ? adminLinks : fieldAgentLinks;

  return (
    <Drawer
      variant="permanent"
      className="sidebar"
    >
      <Toolbar />
      <Box sx={{ overflow: 'auto' }}>
        <List>
          {links.map((link, index) => (
            <ListItem button component={Link} to={link.path} key={index}>
              <ListItemIcon>{link.icon}</ListItemIcon>
              <ListItemText primary={link.text} />
            </ListItem>
          ))}
          <Divider />
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
