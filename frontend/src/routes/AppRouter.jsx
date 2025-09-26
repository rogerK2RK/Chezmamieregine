// frontend/src/routes/AppRouter.jsx
import { Routes, Route } from 'react-router-dom';
import ClientLayout from '../layouts/ClientLayout';
import AdminAuthLayout from '../layouts/AdminAuthLayout';
import AdminAppLayout from '../layouts/AdminAppLayout';

import HomePage from '../pages/client/HomePage';
import LoginPage from '../pages/client/LoginPage';
import RegisterPage from '../pages/client/RegisterPage';
import ContactPage from '../pages/client/ContactPage';

import AdminLoginPage from '../pages/admin/AdminLoginPage/AdminLoginPage';
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminPlats from '../pages/admin/AdminPlats';
import AdminCommandes from '../pages/admin/AdminCommandes';
import AdminUsers from '../pages/admin/AdminUsers';
import AdminClients from '../pages/admin/AdminClients';
import AdminCategories from '../pages/admin/AdminCategories';

import PrivateRoute from './PrivateRoute';
import { ADMIN_ROLES } from '../utils/roles';

export default function AppRouter() {
  return (
    <Routes>
      {/* ===== SITE PUBLIC ===== */}
      <Route element={<ClientLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/connexion" element={<LoginPage />} />
        <Route path="/inscription" element={<RegisterPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Route>

      {/* ===== ADMIN : login (sans sidebar) ===== */}
      <Route element={<AdminAuthLayout />}>
        <Route path="/admin/login" element={<AdminLoginPage />} />
      </Route>

      {/* ===== ADMIN : app (avec sidebar persistante) ===== */}
      <Route element={<AdminAppLayout />}>
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
        <Route
          path="/admin/clients"
          element={
            <PrivateRoute allowedRoles={ADMIN_ROLES}>
              <AdminClients />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/categories"
          element={
            <PrivateRoute allowedRoles={ADMIN_ROLES}>
              <AdminCategories />
            </PrivateRoute>
          }
        />
      </Route>
    </Routes>
  );
}
