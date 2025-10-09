// frontend/src/services/api.js
import axios from 'axios';

const api = axios.create({
  // ex: VITE_API_URL="http://localhost:5000"
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
});

// ❌ PAS d'Authorization injecté ici (public/client)
export default api;
