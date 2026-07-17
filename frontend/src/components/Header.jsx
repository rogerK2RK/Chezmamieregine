import { useEffect, useRef, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import logo from '../assets/img/logo-blanc.svg';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const { count, setOpen: setCartOpen } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  useEffect(() => {
    const onClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="header-inner">
        {/* Gauche : logo */}
        <Link to="/" className="header-logo-link">
          <img className="header-logo" src={logo} alt="Chez Mamie Régine" />
        </Link>

        {/* Centre : navigation (desktop) */}
        <nav className="header-nav">
          <NavLink to="/">Accueil</NavLink>
          <NavLink to="/categories">Nos plats</NavLink>
          <a href="/#traiteur">Traiteur</a>
          <NavLink to="/contact">Contact</NavLink>
          <NavLink to="/connexion">Connexion</NavLink>
        </nav>

        {/* Droite : panier + menu mobile */}
        <div className="header-actions" ref={ref}>
          <button className="cart-trigger" onClick={() => setCartOpen(true)} aria-label="Ouvrir le panier">
            <span className="material-symbols-outlined" aria-hidden="true">shopping_cart</span>
            {count > 0 && <span className="cart-count">{count}</span>}
          </button>

          <button
            className={`header-menu-btn ${open ? 'is-open' : ''}`}
            aria-label="Menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="burger"><span></span><span></span><span></span></span>
          </button>

          <div className={`header-mobile ${open ? 'open' : ''}`}>
            <Link to="/" onClick={() => setOpen(false)}>Accueil</Link>
            <Link to="/categories" onClick={() => setOpen(false)}>Nos plats</Link>
            <a href="/#traiteur" onClick={() => setOpen(false)}>Traiteur</a>
            <Link to="/contact" onClick={() => setOpen(false)}>Contact</Link>
            <Link to="/connexion" onClick={() => setOpen(false)}>Connexion</Link>
          </div>
        </div>
      </div>
    </header>
  );
}
