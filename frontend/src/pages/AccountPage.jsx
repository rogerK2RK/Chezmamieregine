import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useClientAuth } from '../context/ClientAuthContext.jsx';

export default function AccountPage() {
  const { token, name, logout } = useClientAuth();
  useEffect(() => { document.title = 'Mon compte — Chez Mamie Régine'; }, []);

  if (!token) return (
    <main className="auth"><div className="form-card" style={{ textAlign: 'center' }}>
      <h1>Mon compte</h1><p className="sub">Connectez-vous pour accéder à votre espace.</p>
      <Link className="btn-primary" to="/connexion">Se connecter</Link>
    </div></main>
  );

  return (
    <main className="auth"><div className="form-card" style={{ textAlign: 'center' }}>
      <h1>Bonjour {name || 'client'}</h1>
      <p className="sub">Bienvenue dans votre espace.</p>
      <button className="btn-outline" onClick={logout}>Déconnexion</button>
    </div></main>
  );
}
