import axios from 'axios';

const root = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');
const baseURL = root.endsWith('/api') ? root : `${root}/api`;

const api = axios.create({
  baseURL,
  withCredentials: false, // on n'utilise pas les cookies ici
});

/* === Intercepteur: ajoute Authorization si un token client est présent === */
api.interceptors.request.use((config) => {
  // on lit toujours la dernière valeur (pas de cache useMemo)
  const t =
    localStorage.getItem('clientToken') ||
    sessionStorage.getItem('clientToken') ||
    localStorage.getItem('token') ||
    sessionStorage.getItem('token');

  if (t) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${t}`;
  } else if (config.headers?.Authorization) {
    // si pas de token, on nettoie
    delete config.headers.Authorization;
  }
  return config;
});

export default api;
