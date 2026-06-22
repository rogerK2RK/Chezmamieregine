import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import './style.css';

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
        <span className="hero-eyebrow">Notre cuisine</span>

        <h1 className="title">
          Authentique.<br />Généreuse.<br />
          <span className="title-accent">Malagasy.</span>
        </h1>

        <p className="hero-desc">
          Découvrez des recettes familiales préparées chaque jour avec passion,
          inspirées des saveurs authentiques de Madagascar.
        </p>

        <div className="hero-actions">
          <Link className="btn-primary" to="/produits">Découvrir le menu →</Link>
        </div>
      </div>

    </div>
  );
}
