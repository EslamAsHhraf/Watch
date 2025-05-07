import axios from 'axios';
import Cookies from 'js-cookie'; 


const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optional: Add interceptor to automatically add the token to requests
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get( 'token' );
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;

