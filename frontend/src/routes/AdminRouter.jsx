// src/routes/AdminRouter.jsx
import { Routes, Route } from 'react-router-dom';
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminPlats from '../pages/admin/AdminPlats';
import AdminCommandes from '../pages/admin/AdminCommandes';
import AdminUsers from '../pages/admin/AdminUsers';
import AdminLoginPage from '../pages/admin/AdminLoginPage/AdminLoginPage';
import PrivateRoute from './PrivateRoute';
import { ADMIN_ROLES } from '../utils/roles';

export default function AdminRouter() {
  return (
    <Routes>
      <Route path="login" element={<AdminLoginPage />} />
      <Route
        path="dashboard"
        element={
          <PrivateRoute allowedRoles={ADMIN_ROLES}>
            <AdminDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="plats"
        element={
          <PrivateRoute allowedRoles={ADMIN_ROLES}>
            <AdminPlats />
          </PrivateRoute>
        }
      />
      <Route
        path="commandes"
        element={
          <PrivateRoute allowedRoles={ADMIN_ROLES}>
            <AdminCommandes />
          </PrivateRoute>
        }
      />
      <Route
        path="utilisateurs"
        element={
          <PrivateRoute allowedRoles={ADMIN_ROLES}>
            <AdminUsers />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}
