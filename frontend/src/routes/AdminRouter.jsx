import { Routes, Route } from 'react-router-dom';
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminPlats from '../pages/admin/AdminPlats';
import AdminCommandes from '../pages/admin/AdminCommandes';
import AdminUsers from '../pages/admin/AdminUsers';
import AdminLoginPage from '../pages/admin/AdminLoginPage';
import PrivateRoute from './PrivateRoute';
import { ADMIN_ROLES } from '../utils/roles'; // ⬅️ import ici

export default function AdminRouter() {
  return (
    <Routes>
      {/* Routes réservées aux administrateurs */}
      <Route path="/admin/login" element={<AdminLoginPage />} />

      <Route
        path="/admin/dashboard"
        element={
          <PrivateRoute allowedRoles={ADMIN_ROLES}>
            <AdminDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/plats"
        element={
          <PrivateRoute allowedRoles={ADMIN_ROLES}>
            <AdminPlats />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/commandes"
        element={
          <PrivateRoute allowedRoles={ADMIN_ROLES}>
            <AdminCommandes />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/utilisateurs"
        element={
          <PrivateRoute allowedRoles={ADMIN_ROLES}>
            <AdminUsers />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}
