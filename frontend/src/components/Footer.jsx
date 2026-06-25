import { Link } from 'react-router-dom';
import { WA_ORDER, TEL_LINK, PHONE_DISPLAY, CITY } from '../config/contact.js';
import logo from '../assets/img/logo-blanc.svg';

export default function Footer() {
  const year = 2026;
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div>
          <img className="footer-logo" src={logo} alt="Chez Mamie Régine" />
          <p>Cuisine malgache faite maison, préparée avec des produits frais et livrée à {CITY}. Les saveurs de la grande île, à partager.</p>
          <h4 style={{ marginTop: '1.5rem' }}>Horaires</h4>
          <p>Lun – Dim · 10h – 20h</p>
        </div>
        <div className="footer-cols">
          <div className="footer-col">
            <h4>Navigation</h4>
            <Link to="/">Accueil</Link>
            <Link to="/categories">Nos plats</Link>
            <a href="/#traiteur">Traiteur</a>
            <Link to="/contact">Contact</Link>
          </div>
          <div className="footer-col">
            <h4>Contact</h4>
            <a href={WA_ORDER} target="_blank" rel="noreferrer">WhatsApp</a>
            <a href={TEL_LINK}>{PHONE_DISPLAY}</a>
            <span>Livraison à {CITY}</span>
          </div>
          <div className="footer-col">
            <h4>Suivez-nous</h4>
            <a href="https://www.instagram.com/chezmamieregine_38/" target="_blank" rel="noreferrer">Instagram</a>
            <a href="https://www.facebook.com/profile.php?id=61561390304107" target="_blank" rel="noreferrer">Facebook</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {year} Chez Mamie Régine — Tous droits réservés.</span>
        <span>Livraison &amp; traiteur · {CITY}</span>
      </div>
    </footer>
  );
}
