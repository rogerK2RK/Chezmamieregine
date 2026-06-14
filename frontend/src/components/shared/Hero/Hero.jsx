import { Link } from 'react-router-dom';
import React, { useEffect, useState } from "react";
import './style.css';

import haricot from './images/hero-haricot.png';
import ravitoto from './images/hero-ravitoto.png';
import tilapia from './images/hero-tilapia.png';
import ravitoto2 from './images/hero-crevette.png';

const images = [haricot, ravitoto, tilapia, ravitoto2];

export default function Hero() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hero-carousel">
      <div
        className="bkgrd-carousel"
        style={{
          backgroundImage: `url(${images[index]})`,
        }}>
      </div>

      <div className="hero-content">
        <span className="hero-eyebrow">La cuisine maison qui réchauffe le cœur</span>

        <h1 className="title">
          Des plats malgaches authentiques préparés{' '}
          <span className="title-accent">avec amour.</span>
        </h1>

        <p className="hero-desc">
          Chez Mamie Régine, chaque recette raconte une histoire de famille,
          de tradition et de partage. Fait maison, avec des ingrédients frais
          et locaux.
        </p>

        <div className="hero-actions">
          <Link className="btn-primary" to="/produits">Découvrir le menu →</Link>
          <a className="btn-outline" href="tel:0668347755">Commander maintenant</a>
        </div>

        <ul className="hero-stats">
          <li className="hero-stat">
            <span className="hero-stat-num">100%</span>
            <span className="hero-stat-label">Fait maison</span>
          </li>
          <li className="hero-stat">
            <span className="hero-stat-num">10K+</span>
            <span className="hero-stat-label">Clients satisfaits</span>
          </li>
          <li className="hero-stat">
            <span className="hero-stat-num">4.9/5</span>
            <span className="hero-stat-label">Avis Google</span>
          </li>
          <li className="hero-stat">
            <span className="hero-stat-num">Frais</span>
            <span className="hero-stat-label">Ingrédients locaux</span>
          </li>
        </ul>
      </div>

    </div>
  );
}
