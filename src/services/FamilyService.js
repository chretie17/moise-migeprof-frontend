import axios from 'axios';

const API_URL = 'http://localhost:3000/api/families';

export const getAllPrograms = async () => {
  const response = await axios.get(`${API_URL}/programs`);
  return response.data;
};

export const registerFamily = async (familyData) => {
  const response = await axios.post(`${API_URL}/register`, familyData);
  return response.data;
};
