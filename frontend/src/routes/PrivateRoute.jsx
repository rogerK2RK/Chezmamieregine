import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext.jsx';

export default function PrivateRoute({ children, roles }) {
  const { token, admin } = useAdminAuth();
  if (!token) return <Navigate to="/admin/login" replace />;
  if (roles && admin && !roles.includes(admin.role)) return <Navigate to="/admin" replace />;
  return children;
}
