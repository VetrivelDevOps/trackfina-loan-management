import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create an axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include auth token and company/branch info
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    const currentCompanyId = localStorage.getItem('currentCompanyId');
    const currentBranchId = localStorage.getItem(`currentBranchId_${currentCompanyId}`);
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    if (currentCompanyId) {
      config.headers['X-Company-ID'] = currentCompanyId;
    }
    
    if (currentBranchId) {
      config.headers['X-Branch-ID'] = currentBranchId;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle unauthorized errors (expired token)
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;