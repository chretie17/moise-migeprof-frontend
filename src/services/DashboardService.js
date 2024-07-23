import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export const getDashboardStats = async () => {
  const response = await axios.get(`${API_URL}/dashboard/stats`);
  return response.data;
};

export const getFieldAgentStats = async () => {
  const response = await axios.get(`${API_URL}/dashboard/field-agent/stats`);
  return response.data;
};
