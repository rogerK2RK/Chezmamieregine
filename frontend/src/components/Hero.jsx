import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { WA_ORDER, TEL_LINK, PHONE_DISPLAY } from '../config/contact.js';
import ravitoto from '../assets/img/hero-ravitoto.jpg';
import haricot from '../assets/img/hero-haricot.jpg';
import tilapia from '../assets/img/hero-tilapia.jpg';
import crevette from '../assets/img/hero-crevette.jpg';

const SLIDES = [
  { src: ravitoto, tag: 'Ravitoto' },
  { src: haricot, tag: 'Haricots & zébu' },
  { src: tilapia, tag: 'Tilapia grillé' },
  { src: crevette, tag: 'Crevettes coco' },
];

export default function Hero() {
  const [i, setI] = useState(0);
  const t = useRef(null);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    t.current = setInterval(() => setI((x) => (x + 1) % SLIDES.length), 4500);
    return () => clearInterval(t.current);
  }, []);

  return (
    <section className="hero">
      {/* Images en fond (carrousel en fondu) */}
      <div className="hero-bg" aria-hidden="true">
        {SLIDES.map((s, idx) => (
          <img key={s.src} src={s.src} alt="" className={idx === i ? 'active' : ''} loading={idx === 0 ? 'eager' : 'lazy'} />
        ))}
      </div>

      <div className="hero-grid">
        <div className="hero-content">
          <span className="hero-eyebrow">Cuisine malgache · Livraison &amp; traiteur</span>
          <h1 className="hero-title">
            <span className="line">Fait</span>
            <span className="line">Maison,</span>
            <span className="line serif">à la malgache.</span>
          </h1>
          <p className="hero-desc">
            Recettes familiales mijotées chaque jour et livrées chez vous. Mariages,
            anniversaires, grandes tablées : on fait aussi le traiteur.
          </p>
          <div className="hero-actions">
            <a className="btn-primary" href={WA_ORDER} target="_blank" rel="noopener noreferrer">Commander sur WhatsApp</a>
            <Link className="btn-outline" to="/categories">Voir le menu</Link>
          </div>
          <p className="hero-phone">Ou par téléphone <a href={TEL_LINK}>{PHONE_DISPLAY}</a></p>
        </div>
      </div>

      <span className="hero-tag"><i></i>{SLIDES[i].tag}</span>

      <div className="hero-scroll" aria-hidden="true">
        <span>Découvrir</span>
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12l7 7 7-7" /></svg>
      </div>
    </section>
  );
}
