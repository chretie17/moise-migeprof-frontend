import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Box, List, ListItem, ListItemText, ListItemIcon, Divider, Drawer, Toolbar } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import UpdateIcon from '@mui/icons-material/Update';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ReportIcon from '@mui/icons-material/Report';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import './Sidebar.css'; // Import the CSS file here

const drawerWidth = 240;

const Sidebar = () => {
  const role = localStorage.getItem('role');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  const adminLinks = [
    { text: 'Dashboard', path: '/dashboard/admin', icon: <DashboardIcon /> },
    { text: 'Manage Field Agents', path: '/manage-field-agents', icon: <PeopleIcon /> },
    { text: 'Track Program', path: '/track-activities', icon: <TrackChangesIcon /> },
    { text: 'Update Content', path: '/update-content', icon: <UpdateIcon /> },
    { text: 'Manage Registrations', path: '/manage-registrations', icon: <AssignmentIcon /> },
    { text: 'View Reports', path: '/view-reports', icon: <ReportIcon /> },
  ];

  const fieldAgentLinks = [
    { text: 'Dashboard', path: '/dashboard/field-agent', icon: <DashboardIcon /> },
    { text: 'Access Materials', path: '/access-materials', icon: <UpdateIcon /> },
    { text: 'Register Families', path: '/register-families', icon: <PeopleIcon /> },
    { text: 'Track Attendance', path: '/track-attendance', icon: <TrackChangesIcon /> },
    { text: 'Submit Reports', path: '/submit-reports', icon: <AssignmentIcon /> },
  ];

  const links = role === 'admin' ? adminLinks : fieldAgentLinks;

  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer
        variant="permanent"
        className="sidebar"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
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
            <ListItem button onClick={handleLogout}>
              <ListItemIcon>
                <ExitToAppIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </Box>
  );
};

export default Sidebar;
