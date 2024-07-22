import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api', // Adjust this if your backend runs on a different URL
});

// Interceptor to add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// User Management API
export const getAllUsers = async () => {
  const response = await api.get('/users');
  return response.data;
};

export const createUser = async (user) => {
  const response = await api.post('/users/create-field-agent', user);
  return response.data;
};

export const updateUser = async (userId, user) => {
  const response = await api.put(`/users/${userId}`, user);
  return response.data;
};

export const deleteUser = async (userId) => {
  const response = await api.delete(`/users/${userId}`);
  return response.data;
};

export const resetPassword = async (userId, newPassword) => {
  const response = await api.post('/users/reset-password', { userId, newPassword });
  return response.data;
};

export const toggleUserActivation = async (userId) => {
  const response = await api.put(`/users/${userId}/toggle-activation`);
  return response.data;
};


// Other APIs can be added similarly...

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
};
