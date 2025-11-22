import { getToken, setToken, setUser, removeToken } from './auth.js';

// Determine API base URL
// In production, VITE_API_URL MUST be set via environment variable
// In development, use localhost or VITE_API_URL if set
const getApiBaseUrl = () => {
  // If VITE_API_URL is explicitly set, use it
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // In production, warn if VITE_API_URL is not set
  if (import.meta.env.PROD) {
    console.error(
      '⚠️ VITE_API_URL is not set! ' +
      'Please set VITE_API_URL environment variable to your backend URL (e.g., https://your-backend.railway.app/api)'
    );
    // Try relative URL as fallback (only works if frontend and backend are on same domain)
    return '/api';
  }
  
  // Default to localhost for development
  return 'http://localhost:3000/api';
};

const API_BASE_URL = getApiBaseUrl();

// Log API URL in development for debugging
if (import.meta.env.DEV) {
  console.log('🔗 API Base URL:', API_BASE_URL);
}

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

