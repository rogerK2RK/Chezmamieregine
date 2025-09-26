import { useLocation } from 'react-router-dom';
import './style.css';

const TITLES = {
  '/admin/dashboard': 'Dashboard',
  '/admin/plats': 'Plats',
  '/admin/commandes': 'Commandes',
  '/admin/utilisateurs': 'Utilisateurs',
};

export default function AdminHeader() {
  const { pathname } = useLocation();

  // Trouve le titre exact ou le plus proche (utile si tu ajoutes /admin/plats/123)
  const title =
    TITLES[pathname] ||
    Object.keys(TITLES).find((key) => pathname.startsWith(key)) ||
    'Back-Office';

  // Clique → ouvrir le front (racine du site) dans un nouvel onglet
  const goToShop = () => {
    const url = `${window.location.origin}/`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <header className="admin-header">
      <div className="admin-header__left">
        <h1 className="admin-header__title">
          {TITLES[title] || title}
        </h1>
      </div>

      <div className="admin-header__right">
        <button className="btn-secondary" onClick={goToShop}>
          Voir la boutique
        </button>
      </div>
    </header>
  );
}
