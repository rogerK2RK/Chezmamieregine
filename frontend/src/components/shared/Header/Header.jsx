import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './header.css';
import logo from '../../../assets/Logo CMR Blc.svg';

export default function Header() {
  const navigate = useNavigate();
  const role = localStorage.getItem('role');
  const name = localStorage.getItem('name');
  const token = localStorage.getItem('token');

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50); // ou 0 si tu veux dès le premier pixel
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
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

        <div className={`menu ${scrolled ? 'scrolled' : ''}`} id="Menu">
          <nav className="nav">
            <Link className='nav-link menu-item' to="/">Accueil</Link>
            {/* <Link className='nav-link menu-item' to="/connexion">Nos plats</Link> */}
            <Link className='nav-link menu-item' to="/contact">Contact</Link>
            {token ? (
              <>
                <span> Connecté : {name} ({role}) </span>
                <button onClick={handleLogout}>Déconnexion</button>
              </>
            ) : (
              <div className='cnx-dcnx'>
                <Link className='nav-link menu-item' to="/connexion">Connexion</Link>
                /
                <Link className='nav-link menu-item' to="/inscription">Inscription</Link>
              </div>
            )}
            <button className='btn-primary scrolled'>Commander</button>
          </nav>
        </div>
      </div>
    </header>
  );
}
