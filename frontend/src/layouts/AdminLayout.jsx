import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext.jsx';

export default function AdminLayout() {
  const { admin, logout } = useAdminAuth();
  const navigate = useNavigate();
  const out = () => { logout(); navigate('/admin/login'); };

  return (
    <div className="admin">
      <aside className="admin-sidebar">
        <div className="brand">CMR · Admin</div>
        <nav className="admin-nav">
          <NavLink to="/admin" end>Tableau de bord</NavLink>
          <span className="group">Catalogue</span>
          <NavLink to="/admin/plats">Plats</NavLink>
          <NavLink to="/admin/categories">Catégories</NavLink>
          <span className="group">Boutique</span>
          <NavLink to="/admin/comments">Avis</NavLink>
          <NavLink to="/admin/contacts">Messages</NavLink>
        </nav>
        <div className="foot">
          <a href="/" target="_blank" rel="noreferrer">↗ Voir le site</a>
        </div>
      </aside>

      <div className="admin-content">
        <div className="admin-topbar">
          <span className="who">Connecté : {admin?.name} <strong>({admin?.role})</strong></span>
          <button className="admin-btn" onClick={out}>Déconnexion</button>
        </div>
        <main className="admin-main"><Outlet /></main>
      </div>
    </div>
  );
}
