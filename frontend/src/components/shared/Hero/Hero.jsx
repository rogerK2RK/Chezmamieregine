import React, { useEffect, useState } from "react";
import './Hero.css';

import haricot from './images/hero-haricot.png';
import ravitoto from './images/hero-ravitoto.png';
import tilapia from './images/hero-tilapia.png';
import crevette from './images/hero-crevette.png';

const images = [haricot, ravitoto, tilapia, crevette];

export default function Hero() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const prevSlide = () => {
    setIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const nextSlide = () => {
    setIndex((prev) => (prev + 1) % images.length);
  };

  return (
    <div className="hero-carousel">
      {images.map((src, i) => (
        <img
          key={i}
          src={src}
          alt={`plat ${i}`}
          className={i === index ? "active" : ""}
        />
      ))}

      <div className="hero-content">
        <div>
          <h1 className="title">Chez<br/>
          Mamie Régine</h1>
          <p className="subtitle">Les saveurs authentiques de la grande île</p>
        </div>
      </div>

      {/* <button onClick={prevSlide} className="prev">‹</button> */}
      {/* <button onClick={nextSlide} className="next">›</button> */}
    </div>
  );
}
