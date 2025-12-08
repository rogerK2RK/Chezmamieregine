import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useClientAuth } from '../../../context/ClientAuthContext.jsx';
import './style.css';
import logo from '../../../assets/Logo CMR Blc.svg';

export default function Header() {
  const navigate = useNavigate();
  const { token, role, name, logout } = useClientAuth();

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // mobile menu
  const [accountOpen, setAccountOpen] = useState(false); // dropdown compte

  const mobileDdRef = useRef(null);
  const accountRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Fermeture du menu mobile au clic à l'extérieur
  useEffect(() => {
    const onClick = (e) => {
      if (!mobileDdRef.current) return;
      if (!mobileDdRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  // Fermeture du dropdown compte au clic à l'extérieur
  useEffect(() => {
    const onClick = (e) => {
      if (!accountRef.current) return;
      if (!accountRef.current.contains(e.target)) setAccountOpen(false);
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

            {isLogged ? (
              <div className="account-wrapper" ref={accountRef}>
                <button
                  type="button"
                  className="account-button"
                  aria-haspopup="menu"
                  aria-expanded={accountOpen}
                  aria-label="Ouvrir le menu de votre compte"
                  onClick={() => setAccountOpen(v => !v)}
                >
                  <div className="account-avatar">
                    <svg
                      viewBox="0 0 24 24"
                      width="18"
                      height="18"
                      aria-hidden="true"
                    >
                      <path
                        d="M12 12c2.209 0 4-1.791 4-4s-1.791-4-4-4-4 1.791-4 4 1.791 4 4 4zm0 2c-3.314 0-6 2.239-6 5v1h12v-1c0-2.761-2.686-5-6-5z"
                        fill="currentColor"
                      />
                    </svg>
                  </div>
                  <span className="account-label">
                    {name ? `Mon compte` : 'Mon compte'}
                  </span>
                </button>

                <div
                  className={`account-dropdown ${accountOpen ? 'open' : ''}`}
                  role="menu"
                >
                  <a
                    href="https://chezmamieregine.vercel.app/account"
                    className="account-dropdown-item"
                    onClick={() => setAccountOpen(false)}
                  >
                    Gérer mon compte
                  </a>
                  <button
                    type="button"
                    className="account-dropdown-item danger"
                    onClick={() => {
                      setAccountOpen(false);
                      handleLogout();
                    }}
                  >
                    Déconnexion
                  </button>
                </div>
              </div>
            ) : (
              <div className="cnx-dcnx">
                <Link className="nav-link menu-item" to="/connexion">Connexion</Link> /
                <Link className="nav-link menu-item" to="/inscription">Inscription</Link>
              </div>
            )}

            <a
              href="tel:0668347755"
              className="dropdown-cta"
              aria-label="Appeler le restaurant au 06 68 34 77 55 pour commander"
              onClick={() => setMenuOpen(false)}
            >
              Commander
            </a>
          </nav>
        </div>

        {/* Mobile */}
        <div className="header-right" ref={mobileDdRef}>
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
                <div className="dropdown-user">
                  Connecté : {name || 'client'} {role ? `(${role})` : ''}
                </div>
                <button
                  className="dropdown-item danger"
                  onClick={() => { setMenuOpen(false); handleLogout(); }}
                >
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
            <a
              href="tel:0668347755"
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
