import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export const getAllPrograms = async () => {
  const response = await axios.get(`${API_URL}/families/programs`);
  return response.data;
};

export const registerFamily = async (familyData) => {
  const response = await axios.post(`${API_URL}/families/register`, familyData);
  return response.data;
};

export const getFamilies = async () => {
  const response = await axios.get(`${API_URL}/families`);
  return response.data;
};

export const updateFamily = async (familyID, familyData) => {
  const response = await axios.put(`${API_URL}/families/update/${familyID}`, familyData);
  return response.data;
};

export const deleteFamily = async (familyID) => {
  const response = await axios.delete(`${API_URL}/families/delete/${familyID}`);
  return response.data;
};

export const getFamiliesByProgram = async (programID) => {
  const response = await axios.get(`${API_URL}/families?programId=${programID}`);
  return response.data;
};

export const getAllFeedback = async () => {
  const response = await axios.get(`${API_URL}/feedback`);
  return response.data;
};

export const submitFeedback = async (feedbackData) => {
  const response = await axios.post(`${API_URL}/feedback/submit`, feedbackData);
  return response.data;
};

export const getAttendances = async () => {
  const response = await axios.get(`${API_URL}/attendances`);
  return response.data;
};

export const addOrUpdateAttendance = async (attendanceData) => {
  const response = await axios.post(`${API_URL}/attendances`, attendanceData);
  return response.data;
};
