import React, { useState } from 'react';
import { login, resetPassword } from '../../services/authService';
import { Container, TextField, Button, Typography, Box, Alert, Paper } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    background: {
      default: '#f5f5f5',
    },
  },
});

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState(''); // Define newPassword
  const [error, setError] = useState('');
  const [isFirstLogin, setIsFirstLogin] = useState(false);
  const [userId, setUserId] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userData = await login(email, password);
      if (userData.mustResetPassword) {
        setIsFirstLogin(true);
        setUserId(userData.userId);
      } else {
        if (userData.role === 'admin') {
          window.location.href = '/dashboard/admin';
        } else if (userData.role === 'field-agent') {
          window.location.href = '/dashboard/field-agent';
        }
      }
    } catch (err) {
      console.error('Error during login:', err); // Log the error for debugging
      setError('Invalid credentials');
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    try {
      await resetPassword(userId, newPassword); // Use newPassword
      setIsFirstLogin(false);
      setError('');
      window.location.href = '/login';
    } catch (err) {
      console.error('Error during password reset:', err); // Log the error for debugging
      setError('Error resetting password');
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <Paper elevation={3} sx={{ padding: 4, marginTop: 8, borderRadius: 2 }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Typography component="h1" variant="h5">
              {isFirstLogin ? 'Reset Password' : 'Login'}
            </Typography>
            <Box component="form" onSubmit={isFirstLogin ? handlePasswordReset : handleLogin} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isFirstLogin}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name={isFirstLogin ? "newPassword" : "password"} // Adjust this line
                label={isFirstLogin ? "New Password" : "Password"} // Adjust this line
                type="password"
                id={isFirstLogin ? "newPassword" : "password"} // Adjust this line
                autoComplete={isFirstLogin ? "new-password" : "current-password"} // Adjust this line
                value={isFirstLogin ? newPassword : password} // Adjust this line
                onChange={(e) => isFirstLogin ? setNewPassword(e.target.value) : setPassword(e.target.value)} // Adjust this line
              />
              {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                sx={{ mt: 3, mb: 2 }}
              >
                {isFirstLogin ? 'Reset Password' : 'Login'}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </ThemeProvider>
  );
};

export default Login;
