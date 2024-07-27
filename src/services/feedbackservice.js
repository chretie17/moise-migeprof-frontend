import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});

export const getAllFeedback = async () => {
  const response = await api.get('/feedback');
  return response.data;
};

export const submitFeedback = async (feedbackData) => {
  const response = await api.post('/feedback', feedbackData);
  return response.data;
};


export const getProgramAttendanceForToday = async (programId) => {
  const response = await api.get(`/feedback/today-attendance/${programId}`);
  return response.data.count;
};