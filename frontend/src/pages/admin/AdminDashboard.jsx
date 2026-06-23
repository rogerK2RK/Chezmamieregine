import { Link } from 'react-router-dom';

const CARDS = [
  { to: '/admin/plats', t: 'Plats', d: 'Gérer le menu' },
  { to: '/admin/categories', t: 'Catégories', d: 'Organiser les plats' },
  { to: '/admin/comments', t: 'Avis', d: 'Modérer les commentaires' },
  { to: '/admin/contacts', t: 'Messages', d: 'Demandes de contact' },
];

export default function AdminDashboard() {
  return (
    <>
      <h1>Tableau de bord</h1>
      <div className="admin-cards">
        {CARDS.map((c) => (
          <Link key={c.to} to={c.to} className="admin-card">
            <h3>{c.t}</h3><p style={{ color: 'var(--color-text-muted)' }}>{c.d}</p>
          </Link>
        ))}
      </div>
    </>
  );
}
