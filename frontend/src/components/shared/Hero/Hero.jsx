import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import './style.css';
import { WA_ORDER, PHONE_DISPLAY, TEL_LINK } from '../../../config/contact.js';

import haricot from './images/hero-haricot.jpg';
import ravitoto from './images/hero-ravitoto.jpg';
import tilapia from './images/hero-tilapia.jpg';
import crevette from './images/hero-crevette.jpg';

const images = [haricot, ravitoto, tilapia, crevette];
const INTERVAL = 7000;

export default function Hero() {
  // `index` = image affichée, `prev` = image précédente (gardée opaque sous le fondu).
  const [{ index, prev }, setSlide] = useState({ index: 0, prev: null });
  const timerRef = useRef(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return undefined;
    timerRef.current = setInterval(() => {
      setSlide((s) => ({ index: (s.index + 1) % images.length, prev: s.index }));
    }, INTERVAL);
    return () => clearInterval(timerRef.current);
  }, []);

  return (
    <div className="hero-carousel">
      {/* Calques empilés : précharge toutes les images + vrai fondu enchaîné sans flash */}
      <div className="hero-slides" aria-hidden="true">
        {images.map((src, i) => (
          <div
            key={src}
            className={`hero-slide${i === index ? ' is-active' : ''}${i === prev ? ' is-prev' : ''}`}
            style={{ backgroundImage: `url(${src})` }}
          />
        ))}
      </div>

      <div className="hero-content">
        <span className="hero-eyebrow">Livraison à Lyon · Traiteur événementiel</span>

        <h1 className="title">
          Authentique.<br />Généreuse.<br />
          <span className="title-accent">Malagasy.</span>
        </h1>

        <p className="hero-desc">
          Des recettes familiales malgaches préparées maison chaque jour,
          livrées chez vous. Et pour vos mariages, anniversaires et grandes
          occasions, on s'occupe du traiteur.
        </p>

        <div className="hero-actions">
          <a
            className="btn-primary btn-wa"
            href={WA_ORDER}
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
              <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.945C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 018.413 3.488 11.82 11.82 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zM6.597 20.13c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.51 5.26l-.999 3.648 3.978-1.045zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.148-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
            </svg>
            Commander sur WhatsApp
          </a>
          <Link className="btn-outline" to="/produits">Voir le menu</Link>
        </div>

        <p className="hero-phone">
          Ou par téléphone : <a href={TEL_LINK}>{PHONE_DISPLAY}</a>
        </p>
      </div>

      <div className="hero-scroll" aria-hidden="true">
        <span>Découvrir</span>
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
      </div>

    </div>
  );
}
