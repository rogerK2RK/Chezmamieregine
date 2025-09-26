// frontend/src/layouts/AdminAppLayout.jsx
import { Outlet, useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/admin/AdminSidebar/AdminSidebar';
import AdminHeader from '../pages/admin/partials/AdminHeader';
import './AdminLayout.css';

export default function AdminAppLayout() {
  const navigate = useNavigate();

  // (facultatif) protection minimale côté UI si pas de token
  const token =
    localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken');
  if (!token) {
    navigate('/admin/login', { replace: true });
    return null;
  }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <AdminSidebar />
      </aside>
      <div className="admin-content">
        <AdminHeader />      
        <main className="admin-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
