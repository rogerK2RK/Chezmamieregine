import { Link } from "react-router-dom";
import "./error.css"; // si tu veux un style séparé

export default function ErrorPage() {
  return (
    <main className="error-container">
      <h1 className="error-title">404</h1>
      <p className="error-text">Oups… cette page n’existe pas.</p>

      <Link to="/" className="error-btn">
        Retour à l’accueil
      </Link>
    </main>
  );
}
