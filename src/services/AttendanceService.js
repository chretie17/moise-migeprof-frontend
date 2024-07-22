import axios from 'axios';

const API_URL = 'http://localhost:3000/api/attendances';

export const addOrUpdateAttendance = async (attendanceData) => {
  const response = await axios.post(API_URL, attendanceData);
  return response.data;
};

export const getAttendances = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};
