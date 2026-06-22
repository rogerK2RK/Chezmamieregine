import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import './style.css';
import { WA_ORDER, PHONE_DISPLAY, TEL_LINK } from '../../../config/contact.js';

import haricot from './images/hero-haricot.jpg';
import ravitoto from './images/hero-ravitoto.jpg';
import tilapia from './images/hero-tilapia.jpg';
import crevette from './images/hero-crevette.jpg';

const SLIDES = [
  { src: ravitoto, tag: 'Ravitoto' },
  { src: haricot, tag: 'Haricots & zébu' },
  { src: tilapia, tag: 'Tilapia grillé' },
  { src: crevette, tag: 'Crevettes coco' },
];
const INTERVAL = 4000;

export default function Hero() {
  const [index, setIndex] = useState(0);
  const timer = useRef(null);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return undefined;
    timer.current = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), INTERVAL);
    return () => clearInterval(timer.current);
  }, []);

  return (
    <section className="hero">
      <div className="hero-grid">
        {/* Colonne texte */}
        <div className="hero-left">
          <span className="hero-eyebrow">Cuisine malgache · Livraison &amp; traiteur</span>

          <h1 className="hero-title">
            <span className="hero-line">Fait</span>
            <span className="hero-line">Maison,</span>
            <span className="hero-line hero-line--serif accent-serif">à la malgache.</span>
          </h1>

          <p className="hero-desc">
            Recettes familiales mijotées chaque jour et livrées chez vous à Lyon.
            Mariages, anniversaires, grandes tablées : on fait aussi le traiteur.
          </p>

          <div className="hero-actions">
            <a className="btn-primary" href={WA_ORDER} target="_blank" rel="noopener noreferrer">
              Commander sur WhatsApp
            </a>
            <Link className="btn-outline" to="/produits">Voir le menu</Link>
          </div>

          <p className="hero-phone">
            Ou par téléphone <a href={TEL_LINK}>{PHONE_DISPLAY}</a>
          </p>
        </div>

        {/* Colonne image encadrée */}
        <div className="hero-right">
          <figure className="hero-frame">
            <div className="hero-frame-stack">
              {SLIDES.map((s, i) => (
                <img
                  key={s.src}
                  src={s.src}
                  alt={s.tag}
                  className={`hero-frame-img${i === index ? ' is-active' : ''}`}
                  loading={i === 0 ? 'eager' : 'lazy'}
                />
              ))}
            </div>
            <figcaption className="hero-tag">
              <span className="hero-tag-dot" /> {SLIDES[index].tag}
            </figcaption>
          </figure>
        </div>
      </div>

      <div className="hero-scroll" aria-hidden="true">
        <span>Découvrir</span>
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
      </div>
    </section>
  );
}
