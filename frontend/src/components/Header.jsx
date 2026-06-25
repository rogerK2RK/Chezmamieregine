import { useEffect, useRef, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import logo from '../assets/img/logo-blanc.svg';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const { count, setOpen: setCartOpen } = useCart();

  const CartButton = ({ className = '' }) => (
    <button className={`cart-trigger ${className}`} onClick={() => setCartOpen(true)} aria-label="Ouvrir le panier">
      <span className="cart-trigger-icon" aria-hidden="true">🛒</span>
      <span>Panier</span>
      {count > 0 && <span className="cart-count">{count}</span>}
    </button>
  );

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
        <Link to="/"><img className="header-logo" src={logo} alt="Chez Mamie Régine" /></Link>

        <nav className="header-nav">
          <NavLink to="/categories">Nos plats</NavLink>
          <a href="/#traiteur">Traiteur</a>
          <NavLink to="/contact">Contact</NavLink>
          <NavLink to="/connexion">Connexion</NavLink>
          <CartButton className="header-cta" />
        </nav>

        <div ref={ref} style={{ position: 'relative' }}>
          <button className="burger" aria-label="Menu" onClick={() => setOpen((v) => !v)}>
            <span></span><span></span><span></span>
          </button>
          <div className={`header-mobile ${open ? 'open' : ''}`}>
            <Link to="/categories" onClick={() => setOpen(false)}>Nos plats</Link>
            <a href="/#traiteur" onClick={() => setOpen(false)}>Traiteur</a>
            <Link to="/contact" onClick={() => setOpen(false)}>Contact</Link>
            <Link to="/connexion" onClick={() => setOpen(false)}>Connexion</Link>
            <button className="cart-trigger-mobile" onClick={() => { setOpen(false); setCartOpen(true); }}>
              🛒 Panier{count > 0 ? ` (${count})` : ''}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
