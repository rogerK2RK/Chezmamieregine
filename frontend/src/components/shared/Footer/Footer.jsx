import './Footer.css';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <p>© {year} Chez Mamie Régine. Tous droits réservés.</p>
      <div className="links">
        <a href="/mentions-legales">Mentions légales</a>
        <a href="/contact">Contact</a>
      </div>
    </footer>
  );
}
