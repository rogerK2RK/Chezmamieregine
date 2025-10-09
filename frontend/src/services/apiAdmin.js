import axios from 'axios';
import authHeaderAdmin from './authHeaderAdmin';

const root = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');
const baseURL = root.endsWith('/api') ? root : `${root}/api`;

const apiAdmin = axios.create({
  baseURL,
  withCredentials: true,
});

apiAdmin.interceptors.request.use((config) => {
  const headers = authHeaderAdmin();
  if (headers?.Authorization) {
    config.headers = { ...(config.headers || {}), ...headers };
  }
  return config;
});

export default apiAdmin;
