import { Navigate } from 'react-router-dom';

export default function PrivateRoute({ allowedRoles, children }) {
  const token = localStorage.getItem('adminToken');
  const role  = localStorage.getItem('adminRole');

  if (!token) return <Navigate to="/admin/login" replace />;
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
}
