export default function authHeaderAdmin() {
  const t = localStorage.getItem('adminToken');
  return t ? { Authorization: `Bearer ${t}` } : {};
}
