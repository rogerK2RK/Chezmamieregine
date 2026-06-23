import { Link } from 'react-router-dom';

export default function ErrorPage() {
  return (
    <main className="auth">
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '5rem' }}>404</h1>
        <p className="sub">Cette page n'existe pas.</p>
        <Link className="btn-primary" to="/">Retour à l'accueil</Link>
      </div>
    </main>
  );
}
