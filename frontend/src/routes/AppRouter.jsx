// src/routes/AppRouter.jsx
import { Routes, Route } from 'react-router-dom';
import ClientLayout from '../layouts/ClientLayout';
import AdminLayout from '../layouts/AdminLayout';
import ClientRouter from './ClientRouter';
import AdminRouter from './AdminRouter';

export default function AppRouter() {
  return (
    <Routes>
      {/* Zone ADMIN (sans Header/Footer public) */}
      <Route path="/admin/*" element={<AdminLayout />}>
        {/* On délègue toutes les routes /admin/... à AdminRouter */}
        <Route path="*" element={<AdminRouter />} />
      </Route>

      {/* Zone CLIENT (avec Header/Footer) */}
      <Route path="/*" element={<ClientLayout />}>
        {/* On délègue toutes les routes publiques à ClientRouter */}
        <Route path="*" element={<ClientRouter />} />
      </Route>
    </Routes>
  );
}
