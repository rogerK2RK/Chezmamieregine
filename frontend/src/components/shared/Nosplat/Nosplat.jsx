import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import './style.css';
import imgbackground from './images/Nos Plats.png';

const NosPlats = () => {
  // Données démo — tu pourras brancher ton vrai tableau de plats ici
  const basePlat = {
    nom: "Hena omby ritra",
    description: "Viande de bœuf, ail, gingembre, sel, poivre, Quelques fois des herbes aromatiques",
    prix: "13,50 €",
    image:
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200' viewBox='0 0 300 200'%3E%3Crect width='300' height='200' fill='%23D2B48C'/%3E%3Ccircle cx='80' cy='80' r='35' fill='%23CD853F'/%3E%3Ccircle cx='220' cy='80' r='35' fill='%238FBC8F'/%3E%3Ccircle cx='80' cy='140' r='25' fill='%23FF6347'/%3E%3Ccircle cx='150' cy='100' r='45' fill='%23F5DEB3'/%3E%3Ccircle cx='220' cy='140' r='25' fill='%23228B22'/%3E%3Ctext x='150' y='105' text-anchor='middle' fill='%23654321' font-size='12'%3ERiz et viande%3C/text%3E%3C/svg%3E"
  };

  const items = useMemo(
    () => Array.from({ length: 9 }, (_, i) => ({
      ...basePlat,
      nom: `${basePlat.nom} #${i + 1}`
    })),
    []
  );

  // Responsive : 1 carte (mobile) / 3 cartes (desktop ≥1024px)
  const getPerView = () => (window.innerWidth >= 1024 ? 3 : 1);
  const [perView, setPerView] = useState(getPerView);

  useEffect(() => {
    const onResize = () => setPerView(getPerView());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Index de page (on page par "perView")
  const maxPage = Math.max(0, Math.ceil(items.length / perView) - 1);
  const [page, setPage] = useState(0);

  useEffect(() => {
    // si on change perView, on recalcule la page max et on clamp
    if (page > maxPage) setPage(maxPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [perView, items.length]);

  const prev = () => setPage(p => Math.max(0, p - 1));
  const next = () => setPage(p => Math.min(maxPage, p + 1));

  // Translation du track
  const translatePct = -(100 * page);

  return (
    <div
      className="nosplats-container"
      style={{ ['--bg-img']: `url(${imgbackground})` }}
    >
      <div className="nosplats-wrapper">
        <h2 className="nosplats-title">Nos Plats</h2>

        {/* Carrousel */}
        <div className="slider">
          <button
            className="slider-btn slider-btn--prev"
            onClick={prev}
            aria-label="Précédent"
            disabled={page === 0}
          >
            ‹
          </button>

          <div className="slider-viewport">
            <div
              className="slider-track"
              style={{
                transform: `translateX(${translatePct}%)`,
                ['--per-view']: perView
              }}
            >
              {items.map((plat, idx) => (
                <div className="slider-item" key={idx}>
                  <div className="nosplats-card glass-card">
                    <div className="nosplats-image-container">
                      <img
                        src={plat.image}
                        alt={plat.nom}
                        className="nosplats-image"
                      />
                    </div>

                    <h3 className="nosplats-name">{plat.nom}</h3>
                    <p className="nosplats-description">{plat.description}</p>
                    <p className="nosplats-price">{plat.prix}</p>

                    <button className="nosplats-button btn-primary">Ajouter au panier</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            className="slider-btn slider-btn--next"
            onClick={next}
            aria-label="Suivant"
            disabled={page === maxPage}
          >
            ›
          </button>
        </div>

        {/* Pagination (facultative) */}
        <div className="slider-dots" aria-hidden="true">
          {Array.from({ length: maxPage + 1 }).map((_, i) => (
            <span key={i} className={`dot ${i === page ? 'active' : ''}`} />
          ))}
        </div>

        <div className="nosplats-footer">
          <Link to="/produits" className="nosplats-button btn-primary scrolled">Voir plus</Link>
        </div>
      </div>
    </div>
  );
};

export default NosPlats;
