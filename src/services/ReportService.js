import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export const getAdminReport = async () => {
    const response = await axios.get(`${API_URL}/reports/stats`, { responseType: 'blob' });
    const text = await response.data.text();
    return JSON.parse(text);
  };