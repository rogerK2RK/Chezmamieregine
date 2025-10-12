// frontend/src/pages/admin/partials/AdminSidebar.jsx
import { NavLink, useNavigate } from 'react-router-dom';
import './style.css';

export default function AdminSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminRole');
    localStorage.removeItem('adminName');
    sessionStorage.removeItem('adminToken');
    sessionStorage.removeItem('adminRole');
    sessionStorage.removeItem('adminName');
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="sb-root">
      <div className="sb-header">
        <div className="sb-logo">🍽️</div>
        <div className="sb-title">Back-Office</div>
      </div>

      <nav className="sb-nav">
        <NavLink to="/admin/dashboard" className="sb-link">
          <span>📊</span><span>Dashboard</span>
        </NavLink>
        <NavLink to="/admin/plats" className="sb-link">
          <span>📚</span><span>Plats</span>
        </NavLink>
        <NavLink to="/admin/categories" className="sb-link">
          <span>🗂️</span><span>Catégories</span>
        </NavLink>
        <NavLink to="/admin/clients" className="sb-link">
          <span>🧑‍🍳</span><span>Clients</span>
        </NavLink>
        <NavLink to="/admin/utilisateurs" className="sb-link">
          <span>👥</span><span>Utilisateurs</span>
        </NavLink>
        <NavLink
          to="/admin/comments"
          className="sb-link">
          <span >💬</span><span>Commentaires</span>
        </NavLink>
      </nav>

      <div className="sb-footer">
        <button className="sb-logout" onClick={handleLogout}>
          🚪 Se déconnecter
        </button>
      </div>
    </div>
  );
}
