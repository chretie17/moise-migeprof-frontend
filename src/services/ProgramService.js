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

// User Management API (Existing methods)

// Program Management API
export const getAllPrograms = async () => {
  const response = await api.get('/programs');
  return response.data;
};

export const createProgram = async (program) => {
  const response = await api.post('/programs', program);
  return response.data;
};

export const updateProgram = async (programId, program) => {
  const response = await api.put(`/programs/${programId}`, program);
  return response.data;
};

export const deleteProgram = async (programId) => {
  const response = await api.delete(`/programs/${programId}`);
  return response.data;
};

// Existing export
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
};
export const toggleProgramStatus = async (id) => {
  const response = await api.put(`/programs/toggle-status/${id}`);
  return response.data;
};