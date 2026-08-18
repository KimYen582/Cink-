import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Store Clerk getToken function reference (set from AppContext)
let clerkGetToken = null;

export const setClerkGetToken = (getTokenFn) => {
  clerkGetToken = getTokenFn;
};

// Request interceptor: attach auth token
api.interceptors.request.use(
  async (config) => {
    let token = null;

    // Try Clerk token first
    if (clerkGetToken) {
      try {
        token = await clerkGetToken();
      } catch {
        // Clerk token not available, fall through
      }
    }

    // Fallback to localStorage token (dev login)
    if (!token) {
      token = localStorage.getItem('auth_token');
    }

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

    // Log non-auth errors in development
    if (import.meta.env.DEV && status !== 401) {
      console.error(`[API Error] ${status}: ${message}`, error.config?.url);
    }

    return Promise.reject({
      message,
      status,
      original: error,
    });
  }
);

export default api;
