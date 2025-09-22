// frontend/src/services/authHeaderAdmin.js
export default function authHeaderAdmin() {
  const token = localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
}
