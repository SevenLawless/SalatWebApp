import { getToken, setToken, setUser, removeToken } from './auth.js';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Create axios-like fetch wrapper
const apiRequest = async (endpoint, options = {}) => {
  const token = getToken();
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      // Handle 401 (unauthorized) - token expired or invalid
      if (response.status === 401) {
        removeToken();
        window.location.href = '/';
      }
      throw new Error(data.error || 'Request failed');
    }

    return data;
  } catch (error) {
    if (error.message === 'Failed to fetch') {
      throw new Error('Network error. Please check your connection.');
    }
    throw error;
  }
};

// Auth API
export const signUp = async (username, phoneNumber, password) => {
  const data = await apiRequest('/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ username, phoneNumber, password }),
  });
  
  setToken(data.token);
  setUser(data.user);
  return data;
};

export const signIn = async (phoneNumber, password) => {
  const data = await apiRequest('/auth/signin', {
    method: 'POST',
    body: JSON.stringify({ phoneNumber, password }),
  });
  
  setToken(data.token);
  setUser(data.user);
  return data;
};

export const getCurrentUser = async () => {
  return await apiRequest('/auth/me');
};

// Prayer API
export const getPrayerRecord = async (date) => {
  return await apiRequest(`/prayers/${date}`);
};

export const savePrayerRecord = async (date, prayers) => {
  return await apiRequest(`/prayers/${date}`, {
    method: 'POST',
    body: JSON.stringify({ prayers }),
  });
};

export const getStatistics = async (startDate, endDate) => {
  return await apiRequest(`/prayers/statistics/range?startDate=${startDate}&endDate=${endDate}`);
};

