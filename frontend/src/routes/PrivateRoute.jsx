import { Navigate } from 'react-router-dom';

export default function PrivateRoute({ children, allowedRoles = [] }) {
  const token =
    localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken');
  const role =
    localStorage.getItem('adminRole') || sessionStorage.getItem('adminRole');

  if (!token) return <Navigate to="/admin/login" />;
  if (allowedRoles.length && !allowedRoles.includes(role)) {
    return <Navigate to="/admin/login" />;
  }
  return children;
}
