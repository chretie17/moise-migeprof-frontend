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

export const getFamilies = async () => {
  const response = await axios.get(`${API_URL}`);
  return response.data;
};

export const updateFamily = async (familyID, familyData) => {
  const response = await axios.put(`${API_URL}/update/${familyID}`, familyData);
  return response.data;
};

export const deleteFamily = async (familyID) => {
  const response = await axios.delete(`${API_URL}/delete/${familyID}`);
  return response.data;
};
