import { Navigate } from 'react-router-dom';

export default function PrivateRoute({ children, allowedRoles = [] }) {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  // Si pas de token → non connecté
  if (!token) {
    return <Navigate to="/login" />;
  }

  // Si rôle non autorisé → refus d'accès
  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return <Navigate to="/" />;
  }

  return children;
}
