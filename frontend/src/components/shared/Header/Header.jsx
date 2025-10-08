import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './header.css';
import logo from '../../../assets/Logo CMR Blc.svg';

export default function Header() {
  const navigate = useNavigate();
  const role  = localStorage.getItem('role');
  const name  = localStorage.getItem('name');
  const token = localStorage.getItem('token');

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const ddRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ferme le menu mobile si clic à l'extérieur
  useEffect(() => {
    const onClick = (e) => {
      if (!ddRef.current) return;
      if (!ddRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('name');
    navigate('/login');
  };

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="header-container">
        <div className="logo">
          <Link to="/">
            <img src={logo} alt="Logo" className="logo-image" />
          </Link>
        </div>

        {/* === MENU ACTUEL : visible tablette + desktop === */}
        <div className={`menu ${scrolled ? 'scrolled' : ''}`} id="Menu">
          <nav className="nav">
            <Link className="nav-link menu-item" to="/produits">Nos plats</Link>
            <Link className="nav-link menu-item" to="/contact">Contact</Link>

            {token ? (
              <>
                <span> Connecté : {name} ({role}) </span>
                <button className="btn-inline" onClick={handleLogout}>Déconnexion</button>
              </>
            ) : (
              <div className="cnx-dcnx">
                <Link className="nav-link menu-item" to="/connexion">Connexion</Link>
                /
                <Link className="nav-link menu-item" to="/inscription">Inscription</Link>
              </div>
            )}

            <Link to="/commande" className="btn-primary scrolled">Commander</Link>
          </nav>
        </div>

        {/* === BURGER MOBILE : visible UNIQUEMENT en mobile === */}
        <div className="header-right" ref={ddRef}>
          <button
            className="menu-toggle"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            aria-label="Ouvrir le menu"
            onClick={() => setMenuOpen(v => !v)}
          >
            <svg className="menu-toggle-icon" viewBox="0 0 24 24" width="28" height="28" aria-hidden="true">
              <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>

          <div className={`dropdown ${menuOpen ? 'open' : ''}`} role="menu">
            <Link to="/produits"  className="dropdown-item" onClick={() => setMenuOpen(false)}>Nos plats</Link>
            <Link to="/contact"   className="dropdown-item" onClick={() => setMenuOpen(false)}>Contact</Link>

            {token ? (
              <>
                <div className="dropdown-sep" />
                <div className="dropdown-user">Connecté : {name} ({role})</div>
                <button className="dropdown-item danger" onClick={() => { setMenuOpen(false); handleLogout(); }}>
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <div className="dropdown-sep" />
                <Link to="/connexion"   className="dropdown-item" onClick={() => setMenuOpen(false)}>Connexion</Link>
                <Link to="/inscription" className="dropdown-item" onClick={() => setMenuOpen(false)}>Inscription</Link>
              </>
            )}

            <div className="dropdown-sep" />
            <Link to="/commande" className="dropdown-cta" onClick={() => setMenuOpen(false)}>
              Commander
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
