import { Routes, Route } from 'react-router-dom';
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminPlats from '../pages/admin/AdminPlats';
import AdminCommandes from '../pages/admin/AdminCommandes';
import AdminUsers from '../pages/admin/AdminUsers';
import AdminLoginPage from '../pages/admin/AdminLoginPage/AdminLoginPage';
import AdminPlatForm from '../pages/admin/AdminPlatForm';
import PrivateRoute from './PrivateRoute';
import { ADMIN_ROLES } from '../utils/roles';
import AdminContactsPage from '../pages/admin/AdminContacts/AdminContactsPage';

export default function AdminRouter() {
  return (
    <Routes>
      {/* cette route correspond à /admin/login */}
      <Route path="login" element={<AdminLoginPage />} />

      {/* /admin/dashboard */}
      <Route
        path="dashboard"
        element={
          <PrivateRoute allowedRoles={ADMIN_ROLES}>
            <AdminDashboard />
          </PrivateRoute>
        }
      />

      {/* /admin/plats */}
      <Route
        path="plats"
        element={
          <PrivateRoute allowedRoles={ADMIN_ROLES}>
            <AdminPlats />
          </PrivateRoute>
        }
      />

      {/* /admin/commandes */}
      <Route
        path="commandes"
        element={
          <PrivateRoute allowedRoles={ADMIN_ROLES}>
            <AdminCommandes />
          </PrivateRoute>
        }
      />

      {/* /admin/utilisateurs */}
      <Route
        path="utilisateurs"
        element={
          <PrivateRoute allowedRoles={ADMIN_ROLES}>
            <AdminUsers />
          </PrivateRoute>
        }
      />

      {/* /admin/plats/new */}
      <Route
        path="plats/new"
        element={
          <PrivateRoute allowedRoles={ADMIN_ROLES}>
            <AdminPlatForm />
          </PrivateRoute>
        }
      />

      {/* /admin/plats/:id/edit */}
      <Route
        path="plats/:id/edit"
        element={
          <PrivateRoute allowedRoles={ADMIN_ROLES}>
            <AdminPlatForm />
          </PrivateRoute>
        }
      />

      {/* /admin/contacts */}
      <Route
        path="contacts"
        element={
          <PrivateRoute allowedRoles={ADMIN_ROLES}>
            <AdminContactsPage />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}
