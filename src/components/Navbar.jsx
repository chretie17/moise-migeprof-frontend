import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Box, IconButton } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { logout } = useAuth();
  const role = localStorage.getItem('role') || ''; // Ensure role is a string

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed" className="navbar" sx={{ backgroundColor: 'white', color: 'black' }}>
        <Toolbar>
          <IconButton size="large" edge="start" color="inherit" aria-label="dashboard">
            <DashboardIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </Typography>

          <Box sx={{ flexGrow: 1, textAlign: 'center' }}>
            <Typography variant="h6" noWrap component="div">
              {currentTime.toLocaleTimeString()}
            </Typography>
          </Box>

          <Box sx={{ flexGrow: 1 }} />
          <Typography variant="body1" sx={{ marginRight: 2 }}>
            {getGreeting()}, {role.charAt(0).toUpperCase() + role.slice(1)}
          </Typography>
          <IconButton size="large" color="inherit" onClick={logout}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Navbar;
