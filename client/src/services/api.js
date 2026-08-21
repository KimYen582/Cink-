import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach auth token from localStorage
api.interceptors.request.use(
  (config) => {
    // If Authorization is explicitly set in the request, skip auto-injection
    if (config.headers.Authorization) {
      return config;
    }
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: unified error handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred';

    const status = error.response?.status;

    if (import.meta.env.DEV && status !== 401) {
      console.error(`[API Error] ${status}: ${message}`, error.config?.url);
    }

    return Promise.reject({ message, status, original: error });
  }
);

export default api;
