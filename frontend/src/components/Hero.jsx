import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { MOCK_PLATS } from '../data/mockPlats.js';
import ravitoto from '../assets/img/hero-ravitoto.jpg';
import haricot from '../assets/img/hero-haricot.jpg';
import tilapia from '../assets/img/hero-tilapia.jpg';
import crevette from '../assets/img/hero-crevette.jpg';

const IMAGES = [ravitoto, haricot, tilapia, crevette];

const FEATURED_IDS = ['ravitoto-coco', 'crevette-coco', 'poisson-coco', 'mofo-gasy'];
const FEATURED = FEATURED_IDS
  .map((id) => MOCK_PLATS.find((p) => p._id === id))
  .filter(Boolean);

export default function Hero() {
  const navigate = useNavigate();
  const [i, setI] = useState(0);
  const [q, setQ] = useState('');
  const t = useRef(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    t.current = setInterval(() => setI((x) => (x + 1) % IMAGES.length), 4500);
    return () => clearInterval(t.current);
  }, []);

  const onSearch = (e) => {
    e.preventDefault();
    navigate('/categories');
  };

  return (
    <section className="hero">
      {/* Slide en fond plein écran (carrousel en fondu) */}
      <div className="hero-bg" aria-hidden="true">
        {IMAGES.map((src, idx) => (
          <img key={src} src={src} alt="" className={idx === i ? 'active' : ''} loading={idx === 0 ? 'eager' : 'lazy'} />
        ))}
      </div>

      <div className="hero-inner">
        {/* Titre + recherche + note */}
        <div className="hero-content">
          <h1 className="hero-title">
            Cuisine malgache
            <span className="accent-serif"> faite maison.</span>
          </h1>

          <form className="hero-search" onSubmit={onSearch}>
            <span className="hero-loc">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 21s-7-5.5-7-11a7 7 0 0 1 14 0c0 5.5-7 11-7 11z" />
                <circle cx="12" cy="10" r="2.5" />
              </svg>
              Lyon
            </span>
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Rechercher un plat..."
              aria-label="Rechercher un plat"
            />
            <button type="submit" className="hero-search-btn" aria-label="Rechercher">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21l-4.3-4.3" />
              </svg>
            </button>
          </form>

          <div className="hero-rating">
            <span className="stars" aria-hidden="true">★★★★★</span>
            <span>Fait maison &amp; livré à Lyon, 7j/7</span>
          </div>
        </div>
      </div>

      {/* Bandeau plats (panneau verre dépoli, bas du hero) */}
      <div className="hero-cats">
        <div className="hero-cats-inner">
          {FEATURED.map((p) => (
            <Link key={p._id} to={`/produit/${p._id}`} className="hero-cat">
              <span className="hero-cat-thumb">
                <img src={p.images?.[0]} alt="" />
              </span>
              <span className="hero-cat-info">
                <strong>{p.name}{p.nameAccent ? ` ${p.nameAccent}` : ''}</strong>
                <span className="hero-cat-cta">Voir le plat ▾</span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
