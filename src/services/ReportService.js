import axios from 'axios';

const API_URL = 'http://localhost:3000/api/reports'; // Replace with your actual API URL

export const getFieldAgentsReport = async () => {
  try {
    const response = await axios.get(`${API_URL}/reports/field-agents`);
    return response.data;
  } catch (error) {
    console.error('Error fetching field agents report:', error);
    throw error;
  }
};

export const getProgramsAndFamiliesReport = async () => {
  try {
    const response = await axios.get(`${API_URL}/reports/programs-families`);
    return response.data;
  } catch (error) {
    console.error('Error fetching programs and families report:', error);
    throw error;
  }
};

export const getContentsReport = async () => {
  try {
    const response = await axios.get(`${API_URL}/reports/contents`);
    return response.data;
  } catch (error) {
    console.error('Error fetching contents report:', error);
    throw error;
  }
};

export const getFeedbackReport = async () => {
  try {
    const response = await axios.get(`${API_URL}/reports/feedback`);
    return response.data;
  } catch (error) {
    console.error('Error fetching feedback report:', error);
    throw error;
  }
};

export const getDetailedFeedbackReport = async (feedbackID) => {
  try {
    const response = await axios.get(`${API_URL}/reports/feedback/${feedbackID}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching detailed feedback report:', error);
    throw error;
  }
};

export const getAllFeedbackIDs = async () => {
  try {
    const response = await axios.get(`${API_URL}/feedback/ids`);
    return response.data;
  } catch (error) {
    console.error('Error fetching feedback IDs:', error);
    throw error;
  }
};
