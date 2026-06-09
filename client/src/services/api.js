import axios from 'axios';

// Create configured axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach token if available in local storage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Global error interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Proactively handle common HTTP response errors
    if (error.response) {
      if (error.response.status === 401) {
        console.warn('Unauthorized access request detected.');
        // Optional: Local storage token removal and redirect to /login
      }
    }
    return Promise.reject(error);
  }
);

export default api;
