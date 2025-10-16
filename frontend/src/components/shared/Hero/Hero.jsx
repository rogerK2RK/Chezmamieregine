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
          <h1 className="title">Chez<br/> 
            Mamie Régine</h1>
          <div className="hero-content-scd">
            <span className="text-lg">Les saveurs authentiques de la grande île</span>
            <Link className="btn-primary" to="/produits">Voire nos plats</Link>
          </div>
      </div>

    </div>
  );
}
