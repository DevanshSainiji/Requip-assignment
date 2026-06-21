import axios from 'axios';

/**
 * Axios instance configured to point to the backend API.
 * Uses environment variable if provided, otherwise defaults to local backend.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to handle global errors cleanly
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Return structured errors from our backend
    const customError = error.response?.data || {
      success: false,
      message: 'An unexpected error occurred.',
    };
    return Promise.reject(customError);
  }
);

export default api;
