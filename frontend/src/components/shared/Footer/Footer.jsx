import './style.css';
import logo from '../../../assets/Logo CMR Blc.svg';
import { Link } from 'react-router-dom';
import { WA_ORDER, TEL_LINK, PHONE_DISPLAY } from '../../../config/contact.js';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-inner">
        {/* Marque */}
        <div className="footer-brand">
          <img className="footer-logo" src={logo} alt="Chez Mamie Régine" />
          <p className="footer-desc">
            Cuisine malgache faite maison, préparée avec des produits frais et
            livrée à Lyon. Les saveurs authentiques de la grande île, à partager.
          </p>

          <div className="footer-hours">
            <h4>Horaires</h4>
            <ul>
              <li><span>Lun – Ven</span><span>14h – 18h</span></li>
              <li><span>Samedi</span><span>8h – 18h</span></li>
              <li><span>Dimanche</span><span>Fermé</span></li>
            </ul>
          </div>
        </div>

        {/* Colonnes de liens */}
        <div className="footer-cols">
          <div className="footer-col">
            <h4>Navigation</h4>
            <Link to="/">Accueil</Link>
            <Link to="/produits">Nos plats</Link>
            <a href="/#traiteur">Traiteur</a>
            <Link to="/contact">Contact</Link>
            <Link to="/account">Mon compte</Link>
          </div>

          <div className="footer-col">
            <h4>Contact</h4>
            <a href={WA_ORDER} target="_blank" rel="noreferrer">WhatsApp</a>
            <a href={TEL_LINK}>{PHONE_DISPLAY}</a>
            <span>Livraison à Lyon</span>
            <Link to="/contact">Nous écrire</Link>
          </div>

          <div className="footer-col">
            <h4>Suivez-nous</h4>
            <a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer">Facebook</a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {year} Chez Mamie Régine — Tous droits réservés. Conçu par Roger RETITA.</p>
        <div className="footer-bottom-links">
          <a href="/mentions-legales">Mentions légales</a>
          <Link to="/contact">Contact</Link>
        </div>
      </div>
    </footer>
  );
}
