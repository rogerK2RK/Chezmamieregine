import axios from 'axios';

const root = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');
const baseURL = root.endsWith('/api') ? root : `${root}/api`;

const api = axios.create({
  baseURL,
  withCredentials: true,
});

// ⚙️ Intercepteur: injecte toujours le token CLIENT si présent
api.interceptors.request.use((config) => {
  // si l'appelant n’a pas déjà mis un Authorization, on l’ajoute
  if (!config.headers?.Authorization) {
    const t =
      localStorage.getItem('clientToken') ||
      sessionStorage.getItem('clientToken');
    if (t) {
      config.headers = { ...(config.headers || {}), Authorization: `Bearer ${t}` };
    }
  }
  return config;
});

export default api;
