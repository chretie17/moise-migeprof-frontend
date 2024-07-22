import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api', // Directly specify the API base URL here
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (email, password) => {
  const response = await api.post('/users/login', { Email: email, Password: password });
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('role', response.data.role); // Store user role
  }
  return response.data;
};

export const resetPassword = async (userId, newPassword) => {
  const response = await api.post('/users/reset-password', { UserID: userId, newPassword });
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('role'); // Remove user role
};
