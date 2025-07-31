import React, { useState, useEffect } from 'react';
import './About.css';

const slides = [
  {
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1000&q=80",
    title: "À propos",
    subtitle: "Notre cuisine authentique",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    content: "Ut enim ad minim veniam, quis nostrud exercitation ullamco.",
    footer: "Excepteur sint occaecat cupidatat non proident."
  },
  {
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1000&q=80",
    title: "Notre histoire",
    subtitle: "Tradition et innovation",
    description: "Sed ut perspiciatis unde omnis iste natus error.",
    content: "Eaque ipsa quae ab illo inventore veritatis.",
    footer: "Sed quia consequuntur magni dolores eos."
  },
  {
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?auto=format&fit=crop&w=1000&q=80",
    title: "Nos valeurs",
    subtitle: "Qualité et fraîcheur",
    description: "At vero eos et accusamus et iusto odio dignissimos.",
    content: "Quos dolores et quas molestias excepturi sint occaecati.",
    footer: "Id est laborum et dolorum fuga."
  }
];

export default function ImageTextSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="slider-container">
      <div className="slider-content">
        <div className="slider-image-section">
          <div className="slider-image-wrapper">
            <img
              src={slides[currentSlide].image}
              alt={slides[currentSlide].title}
              className="slider-image"
            />
            <button className="nav-button left" onClick={prevSlide}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button className="nav-button right" onClick={nextSlide}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M9 6L15 12L9 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <div className="image-overlay"></div>
          </div>
          <div className="dot-indicators">
            {slides.map((_, index) => (
              <button
                key={index}
                className={`dot ${index === currentSlide ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
              ></button>
            ))}
          </div>
        </div>

        <div className="slider-text-section">
          <h2 className="slider-title">{slides[currentSlide].title}</h2>
          <h3 className="slider-subtitle">{slides[currentSlide].subtitle}</h3>
          <p className="slider-description">{slides[currentSlide].description}</p>
          <p className="slider-content">{slides[currentSlide].content}</p>
          <p className="slider-footer">{slides[currentSlide].footer}</p>

          <div className="slider-progress-bar">
            <div
              className="slider-progress-fill"
              style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
            ></div>
          </div>

          <div className="slider-counter">
            <span>{String(currentSlide + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}</span>
            <div className="progress-dashes">
              {slides.map((_, index) => (
                <div
                  key={index}
                  className={`dash ${index === currentSlide ? 'active' : ''}`}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
