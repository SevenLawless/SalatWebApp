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

// Log API URL for debugging (always log in production to help troubleshoot)
console.log('🔗 API Base URL:', API_BASE_URL);
if (!import.meta.env.VITE_API_URL && import.meta.env.PROD) {
  console.warn('⚠️ WARNING: VITE_API_URL not set! Frontend will use relative URLs which may not work.');
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
    const fullUrl = `${API_BASE_URL}${endpoint}`;
    console.log(`🌐 Making request to: ${fullUrl}`);
    
    const response = await fetch(fullUrl, config);
    
    // Check if response has content before trying to parse JSON
    const contentType = response.headers.get('content-type');
    let data;
    
    if (contentType && contentType.includes('application/json')) {
      const text = await response.text();
      if (text) {
        try {
          data = JSON.parse(text);
        } catch (parseError) {
          console.error('❌ JSON parse error:', parseError);
          console.error('❌ Response text:', text);
          throw new Error('Invalid JSON response from server');
        }
      } else {
        data = {};
      }
    } else {
      // Not JSON response
      const text = await response.text();
      console.error('❌ Non-JSON response:', text);
      throw new Error(`Server returned non-JSON response: ${response.status} ${response.statusText}`);
    }

    if (!response.ok) {
      // Handle 401 (unauthorized) - token expired or invalid
      if (response.status === 401) {
        removeToken();
        window.location.href = '/';
      }
      throw new Error(data.error || `Request failed: ${response.status} ${response.statusText}`);
    }

    return data;
  } catch (error) {
    if (error.message === 'Failed to fetch') {
      throw new Error('Network error. Please check your connection.');
    }
    console.error('❌ API request error:', error);
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

