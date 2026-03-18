// client/src/services/auth.js
import axios from 'axios';

// Sử dụng biến môi trường - ĐÃ SỬA URL ĐÚNG
const API_URL = process.env.REACT_APP_API_URL || 'https://leave-management-backend-oyyw.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Log requests để debug
api.interceptors.request.use((config) => {
  console.log(`[API Request] ${config.method.toUpperCase()} ${config.url}`);
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Log responses để debug
api.interceptors.response.use(
  (response) => {
    console.log(`[API Response] ${response.status}`, response.data);
    return response;
  },
  (error) => {
    console.error('[API Error]', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        baseURL: error.config?.baseURL
      }
    });
    return Promise.reject(error);
  }
);

export const login = async (username, password) => {
  try {
    const response = await api.post('/login', { username, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const getCurrentUser = async () => {
  const response = await api.get('/me');
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('token');
};

export default api;