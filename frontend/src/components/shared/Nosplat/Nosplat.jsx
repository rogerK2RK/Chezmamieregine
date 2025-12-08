import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../../services/api';
import './style.css';
import imgbackground from './images/Nos Plats.png';

const NosPlats = () => {
  const navigate = useNavigate();

  const [plats, setPlats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  // 🔹 Responsive : 1 carte (mobile) / 3 cartes (desktop ≥1024px)
  const getPerView = () => (window.innerWidth >= 1024 ? 3 : 1);
  const [perView, setPerView] = useState(getPerView);

  // 🔹 Récupérer les plats "home" depuis l’API
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErr('');

        const { data } = await api.get('/public/plats');
        const list = Array.isArray(data) ? data : [];

        // 🏠 ici on filtre les plats qui doivent apparaître dans "Nos Plats"
        // ⚠️ adapte la condition en fonction de ton modèle (isHome, home, featured, etc.)
        const homePlats = list.filter((p) => p.isHome === true);

        setPlats(homePlats);
      } catch (e) {
        console.error('[NosPlats] GET /public/plats', e?.response?.data || e);
        setErr('Impossible de charger les plats à la une.');
        setPlats([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // 🔹 Gérer le resize pour recalculer perView
  useEffect(() => {
    const onResize = () => setPerView(getPerView());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Index de page (une page = "perView" cartes)
  const maxPage = useMemo(
    () => Math.max(0, Math.ceil(plats.length / perView) - 1),
    [plats.length, perView]
  );
  const [page, setPage] = useState(0);

  useEffect(() => {
    // si on change perView ou la liste, on clamp la page
    if (page > maxPage) setPage(maxPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [perView, plats.length]);

  const prev = () => setPage((p) => Math.max(0, p - 1));
  const next = () => setPage((p) => Math.min(maxPage, p + 1));

  const translatePct = -(100 * page);

  return (
    <div
      className="nosplats-container"
      style={{ ['--bg-img']: `url(${imgbackground})` }}
    >
      <div className="nosplats-wrapper">
        <h2 className="nosplats-title">Nos Plats</h2>

        {err && <div className="nosplats-error">{err}</div>}

        {loading ? (
          <div className="nosplats-loading">Chargement…</div>
        ) : plats.length === 0 ? (
          <p className="nosplats-empty">
            Les plats à la une seront bientôt disponibles.
          </p>
        ) : (
          <>
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
                    ['--per-view']: perView,
                  }}
                >
                  {plats.map((plat) => (
                    <div className="slider-item" key={plat._id}>
                      <div className="nosplats-card glass-card">
                        <div className="nosplats-image-container">
                          {Array.isArray(plat.images) && plat.images[0] ? (
                            <img
                              src={plat.images[0]}
                              alt={plat.name}
                              className="nosplats-image"
                            />
                          ) : (
                            <div className="nosplats-image placeholder">
                              🍽️
                            </div>
                          )}
                        </div>

                        <h3 className="nosplats-name">{plat.name}</h3>
                        <p className="nosplats-description">
                          {plat.description || ''}
                        </p>
                        <p className="nosplats-price">
                          {Number(plat.price ?? 0).toFixed(2)} €
                        </p>

                        <button
                          className="nosplats-button btn-primary"
                          onClick={() => navigate(`/produit/${plat._id}`)}
                        >
                          Voir le plat
                        </button>
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
                <span
                  key={i}
                  className={`dot ${i === page ? 'active' : ''}`}
                />
              ))}
            </div>
          </>
        )}

        <div className="nosplats-footer">
          <Link
            to="/produits"
            className="nosplats-button btn-primary scrolled"
          >
            Voir plus
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NosPlats;
