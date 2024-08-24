import axios from 'axios';

const BASE_URL = 'http://your-api-url.com/api/clients';

const api = axios.create({
  baseURL: BASE_URL,
});

export const getClientProfiles = async () => {
  try {
    const response = await api.get('/profile/');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getHealthData = async () => {
  try {
    const response = await api.get('/health-data/');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getDataRequests = async () => {
  try {
    const response = await api.get('/data-requests/');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getClaims = async () => {
  try {
    const response = await api.get('/claims/');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getInsurancePlans = async () => {
  try {
    const response = await api.get('/insurance-plans/');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getSubscribedPlans = async () => {
  try {
    const response = await api.get('/subscribed-plans/');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCreditCards = async () => {
  try {
    const response = await api.get('/credit-card/');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const registerClient = async (data: any) => {
  try {
    const response = await api.post('/register/', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const loginWithToken = async (data: any) => {
  try {
    const response = await api.post('/login/', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Add other endpoints similarly...

export default {
  getClientProfiles,
  getHealthData,
  getDataRequests,
  getClaims,
  getInsurancePlans,
  getSubscribedPlans,
  getCreditCards,
  registerClient,
  loginWithToken,
  // Add other exports similarly...
};
