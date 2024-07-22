import axios from 'axios';

const API_URL = 'http://localhost:3000/api/feedback';

export const submitFeedback = async (feedbackData) => {
  const response = await axios.post(`${API_URL}/submit`, feedbackData);
  return response.data;
};
