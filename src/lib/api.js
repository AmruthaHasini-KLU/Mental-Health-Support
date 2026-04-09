import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add the JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('healthsupport_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token expiration or unauthorized errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // If the token is invalid or expired
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      const isAuthUrl = error.config.url.includes('/auth/login') || error.config.url.includes('/auth/register');
      
      if (!isAuthUrl) {
        localStorage.removeItem('healthsupport_token');
        // Prevent infinite reload loops or abrupt redirects if we are already handling auth states in React Context
        window.dispatchEvent(new Event('auth-error'));
      }
    }
    return Promise.reject(error);
  }
);

export default api;
