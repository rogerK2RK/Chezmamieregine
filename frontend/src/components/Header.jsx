import { useEffect, useRef, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { WA_ORDER } from '../config/contact.js';
import logo from '../assets/img/logo-blanc.svg';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

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
          <NavLink to="/produits">Nos plats</NavLink>
          <a href="/#traiteur">Traiteur</a>
          <NavLink to="/contact">Contact</NavLink>
          <NavLink to="/connexion">Connexion</NavLink>
          <a className="header-cta" href={WA_ORDER} target="_blank" rel="noopener noreferrer">Commander</a>
        </nav>

        <div ref={ref} style={{ position: 'relative' }}>
          <button className="burger" aria-label="Menu" onClick={() => setOpen((v) => !v)}>
            <span></span><span></span><span></span>
          </button>
          <div className={`header-mobile ${open ? 'open' : ''}`}>
            <Link to="/produits" onClick={() => setOpen(false)}>Nos plats</Link>
            <a href="/#traiteur" onClick={() => setOpen(false)}>Traiteur</a>
            <Link to="/contact" onClick={() => setOpen(false)}>Contact</Link>
            <Link to="/connexion" onClick={() => setOpen(false)}>Connexion</Link>
            <a href={WA_ORDER} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}>Commander</a>
          </div>
        </div>
      </div>
    </header>
  );
}
