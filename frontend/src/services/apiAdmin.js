// frontend/src/services/apiAdmin.js
import axios from 'axios';

const apiAdmin = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
});

// ✅ Injecte le token admin (localStorage OU sessionStorage)
apiAdmin.interceptors.request.use((config) => {
  const t =
    localStorage.getItem('adminToken') ||
    sessionStorage.getItem('adminToken');

  if (t) config.headers.Authorization = `Bearer ${t}`;
  return config;
});

export default apiAdmin;
