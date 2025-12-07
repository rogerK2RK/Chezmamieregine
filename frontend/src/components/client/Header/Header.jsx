import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useClientAuth } from '../../../context/ClientAuthContext.jsx';
import './style.css';
import logo from '../../../assets/Logo CMR Blc.svg';

export default function Header() {
  const navigate = useNavigate();
  const { token, role, name, logout } = useClientAuth();

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const ddRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onClick = (e) => {
      if (!ddRef.current) return;
      if (!ddRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/connexion');
  };

  const isLogged = !!token;

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="header-container">
        <div className="logo">
          <Link to="/">
            <img src={logo} alt="Logo chez mamie Régine" className="logo-image" />
          </Link>
        </div>

        {/* Desktop */}
        <div className={`menu ${scrolled ? 'scrolled' : ''}`} id="Menu">
          <nav className="nav">
            <Link className="nav-link menu-item" to="/produits">Nos plats</Link>
            <Link className="nav-link menu-item" to="/contact">Contact</Link>

            {isLogged && <Link className="nav-link menu-item" to="/account">Mon compte</Link>}

            {isLogged ? (
              <>
                <span>Connecté : {name || 'client'} {role ? `(${role})` : ''}</span>
                <button className="btn-inline" onClick={handleLogout}>Déconnexion</button>
              </>
            ) : (
              <div className="cnx-dcnx">
                <Link className="nav-link menu-item" to="/connexion">Connexion</Link> /
                <Link className="nav-link menu-item" to="/inscription">Inscription</Link>
              </div>
            )}

            <a href="tel:0668347755"
              className="dropdown-cta"
              aria-label="Appeler le restaurant au 06 68 34 77 55 pour commander"
              onClick={() => setMenuOpen(false)}
            >
              Commander
            </a>
          </nav>
        </div>

        {/* Mobile */}
        <div className="header-right" ref={ddRef}>
          <button
            className="menu-toggle"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            onClick={() => setMenuOpen(v => !v)}
          >
            <svg
              className="menu-toggle-icon"
              viewBox="0 0 24 24"
              width="28"
              height="28"
              aria-hidden="true"
            >
              <path
                d="M3 6h18M3 12h18M3 18h18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>

          <div className={`dropdown ${menuOpen ? 'open' : ''}`} role="menu">
            <Link to="/produits" className="dropdown-item" onClick={() => setMenuOpen(false)}>Nos plats</Link>
            <Link to="/contact"  className="dropdown-item" onClick={() => setMenuOpen(false)}>Contact</Link>

            {isLogged && (
              <Link to="/account" className="dropdown-item" onClick={() => setMenuOpen(false)}>Mon compte</Link>
            )}

            <div className="dropdown-sep" />
            {isLogged ? (
              <>
                <div className="dropdown-user">Connecté : {name || 'client'} {role ? `(${role})` : ''}</div>
                <button className="dropdown-item danger" onClick={() => { setMenuOpen(false); handleLogout(); }}>
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link to="/connexion" className="dropdown-item" onClick={() => setMenuOpen(false)}>Connexion</Link>
                <Link to="/inscription" className="dropdown-item" onClick={() => setMenuOpen(false)}>Inscription</Link>
              </>
            )}

            <div className="dropdown-sep" />
            <a href="tel:0668347755"
              className="dropdown-cta"
              aria-label="Appeler le restaurant au 06 68 34 77 55 pour commander"
              onClick={() => setMenuOpen(false)}
            >
              Commander
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
