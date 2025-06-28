import { Link, useNavigate } from 'react-router-dom';
import './header.css'; // Assure-toi d'avoir un fichier CSS pour le style
import logo from '../../../assets/logo.svg'; // Assure-toi que le chemin est correct

export default function Header() {
  const navigate = useNavigate();
  const role = localStorage.getItem('role');
  const name = localStorage.getItem('name'); // (si tu veux, stocke aussi le nom au login)
  const token = localStorage.getItem('token');

    // Fonction pour gérer la déconnexion
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('name');
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <Link to="/">
            <img src={logo} alt="Logo" className="logo-image" />
          </Link>
        </div>

        <div className="menu" id="Menu">
          <nav className="nav">
            <Link className='nav-link' to="/">Accueil</Link>
            {token ? (
              <>
                <span> Connecté : {name} ({role}) </span>
                <button onClick={handleLogout}>Déconnexion</button>
              </>
            ) : (
              <>
                <Link className='nav-link' to="/login">Connexion</Link>
                <Link className='nav-link' to="/register">Inscription</Link>
                <button class="contact-btn">Contact</button>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
