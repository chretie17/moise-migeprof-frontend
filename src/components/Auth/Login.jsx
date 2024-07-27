/** @jsxImportSource @emotion/react */
import { css, Global } from '@emotion/react';
import styled from '@emotion/styled';
import React, { useState } from 'react';
import { login } from '../../services/authService';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Paper,
  Grid,
  FormControlLabel,
  Checkbox,
  Link as MuiLink
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import logo from '../../assets/coats.png'; // Assuming the logo is in the assets folder

const theme = createTheme({
  palette: {
    primary: {
      main: '#00b98e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: 'Poppins, sans-serif',
  },
});

const loginStyles = css`
  .login-container {
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .login-paper {
    padding: 4rem;
    border-radius: 2rem;
    background-color: white;
    max-width: 500px;
  }

  .login-box {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .login-logo {
    width: 50px;
    margin-right: 10px;
  }

  .login-header {
    font-weight: bold;
    color: #00b98e;
  }

  .login-image {
    width: 100%;
    max-width: 400px;
  }

  .login-footer {
    margin-top: 5rem;
    text-align: center;

    a {
      margin: 0 1rem;
    }
  }
`;

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userData = await login(email, password);
      if (userData.role === 'admin') {
        window.location.href = '/dashboard/admin';
      } else if (userData.role === 'field-agent') {
        window.location.href = '/dashboard/field-agent';
      }
    } catch (err) {
      console.error('Error during login:', err); // Log the error for debugging
      if (err.response && err.response.status === 403) {
        setError('User is disabled. Please contact support.');
      } else {
        setError('Invalid credentials');
      }
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Global
        styles={css`
          body {
            background-color: ${theme.palette.background.default};
            margin: 0;
            height: 100vh;
          }
          #root {
            height: 100vh;
          }
        `}
      />
      <Container component="main" className="login-container" css={loginStyles}>
        <Grid container spacing={2} alignItems="center" justifyContent="center">
          <Grid item xs={12} md={6}>
            <Paper elevation={3} className="login-paper">
              <Box className="login-box">
                <Typography component="h1" variant="h5">
                  Welcome back
                </Typography>
                <Typography component="p" sx={{ mb: 2, textAlign: 'center' }}>
                  Enter your email and password to sign in
                </Typography>
                <Box component="form" onSubmit={handleLogin} sx={{ mt: 1 }}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email"
                    name="email"
                    autoComplete="email"
                    autoFocus
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <FormControlLabel
                    control={<Checkbox value="remember" color="primary" />}
                    label="Remember me"
                  />
                  {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    sx={{ mt: 3, mb: 2 }}
                  >
                    Sign In
                  </Button>
                  <Grid container justifyContent="flex-end">
                    <Grid item>
                      {/* Add any link if needed */}
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" component="div" className="login-header">
                MIGEPROF - Family Empowerment Hub
              </Typography>
            </Box>
            <img src={logo} alt="MIGEPROF Logo" className="login-image" />
          </Grid>
        </Grid>
        <Box className="login-footer">
          <Typography variant="body2" color="text.secondary" align="center">
            {'Copyright © '}
            <MuiLink color="inherit" href="#">
              MIGEPROF Rwanda
            </MuiLink>{' '}
            {new Date().getFullYear()}
            {'.'}
          </Typography>
          <Box sx={{ mt: 2 }}>
            <MuiLink href="#" variant="body2" sx={{ mx: 1 }}>
              Privacy Policy
            </MuiLink>
            <MuiLink href="#" variant="body2" sx={{ mx: 1 }}>
              Terms of Service
            </MuiLink>
            <MuiLink href="#" variant="body2" sx={{ mx: 1 }}>
              Contact Us
            </MuiLink>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default Login;
