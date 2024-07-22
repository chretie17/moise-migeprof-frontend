import axios from 'axios';

const API_URL = 'http://localhost:3000/api/contents';

export const getAllContents = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const createContent = async (formData) => {
  const response = await axios.post(API_URL, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const updateContent = async (id, formData) => {
  const response = await axios.put(`${API_URL}/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deleteContent = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};
