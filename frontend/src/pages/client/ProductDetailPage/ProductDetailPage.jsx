import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../services/api";
import SafeImage from "../../../components/common/SafeImage";
import "./style.css";

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [plat, setPlat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  // 🟡 Charger le plat depuis l’API publique
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErr("");
        const { data } = await api.get(`/public/plats/${id}`);
        setPlat(data || null);
        setActiveIndex(0);
      } catch (e) {
        console.error(e);
        setErr("Impossible de charger ce plat.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  // 🟡 Gestion des images
  const images = useMemo(
    () => (Array.isArray(plat?.images) && plat.images.length ? plat.images.filter(Boolean) : []),
    [plat]
  );

  // remet l’index dans les bornes si la liste change
  useEffect(() => {
    if (!images.length) { setActiveIndex(0); return; }
    if (activeIndex >= images.length) setActiveIndex(0);
  }, [images, activeIndex]);

  const mainImage = images[activeIndex] || null;

  // Données optionnelles
  const rating = Number(plat?.ratingAvg ?? 4);
  const ingredients = plat?.ingredients || "";
  const sideDishes = plat?.sideDishes || "";

  if (loading)
    return <div className="pd-container"><div className="pd-loading">Chargement…</div></div>;
  if (err)
    return <div className="pd-container"><div className="pd-error">{err}</div></div>;
  if (!plat)
    return null;

  return (
    <div className="pd-container">
      <div className="pd-grid glass-card">
        {/* ----------------- COLONNE GAUCHE : Image principale + vignettes ----------------- */}
        <div className="pd-left">
          <div className="pd-main-img">
            {mainImage ? (
              <SafeImage src={mainImage} alt={plat.name} className="pd-main-img-el" />
            ) : (
              <div className="pd-main-placeholder">🍽️</div>
            )}
          </div>

          {images.length > 1 && (
            <div className="pd-thumbs">
              <button
                className="pd-thumb-nav"
                onClick={() => setActiveIndex(i => Math.max(0, i - 1))}
                aria-label="Précédent"
              >
                ‹
              </button>

              <div className="pd-thumb-row">
                {images.map((src, i) => (
                  <button
                    key={src + i}
                    className={`pd-thumb ${i === activeIndex ? "active" : ""}`}
                    onClick={() => setActiveIndex(i)}
                    aria-label={`Image ${i + 1}`}
                  >
                    <img src={src} alt={`${plat.name} ${i + 1}`} />
                  </button>
                ))}
              </div>

              <button
                className="pd-thumb-nav"
                onClick={() => setActiveIndex(i => Math.min(images.length - 1, i + 1))}
                aria-label="Suivant"
              >
                ›
              </button>
            </div>
          )}
        </div>

        {/* ----------------- COLONNE DROITE : Fiche produit ----------------- */}
        <div className="pd-card">
          <div className="pd-header">
            <h1 className="pd-title">{plat.name}</h1>
            <div className="pd-price">{Number(plat.price ?? 0).toFixed(2)}€</div>
          </div>

          <div className="pd-rating">
            <Stars value={rating} />
            <span className="pd-rating-text">{rating}/5</span>
          </div>

          {plat.description && (
            <section className="pd-section">
              <h3>Description</h3>
              <p>{plat.description}</p>
            </section>
          )}

          {ingredients && (
            <section className="pd-section">
              <h3>Ingrédients</h3>
              <p>{ingredients}</p>
            </section>
          )}

          {sideDishes && (
            <section className="pd-section">
              <h3>Accompagnement</h3>
              <p>{sideDishes}</p>
            </section>
          )}

          <div className="pd-actions">
            <button
              className="pd-btn-order"
              disabled={plat.isAvailable === false}
              title={plat.isAvailable === false ? "Indisponible" : "Commander"}
            >
              Commander
            </button>

            <button className="pd-btn-ghost" onClick={() => navigate(-1)}>
              ← Retour
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------- COMPOSANT D'ÉTOILES ------------------- */
function Stars({ value = 0, max = 5 }) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  const empty = max - full - (half ? 1 : 0);
  return (
    <div className="pd-stars" aria-label={`${value} sur ${max}`}>
      {Array.from({ length: full }).map((_, i) => <span key={`f${i}`}>★</span>)}
      {half && <span>☆</span>}
      {Array.from({ length: empty }).map((_, i) => <span key={`e${i}`}>✩</span>)}
    </div>
  );
}
