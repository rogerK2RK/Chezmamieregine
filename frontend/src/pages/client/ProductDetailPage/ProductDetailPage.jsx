import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import api from "../../../services/api";
import SafeImage from "../../../components/common/SafeImage";
import { getMockPlatById, MAMIE_PHOTO } from "../../../data/mockPlats";
import { whatsappLink, TEL_LINK } from "../../../config/contact.js";
import "./style.css";
import CommentSection from "../../../features/comments/CommentSection";

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [plat, setPlat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setErr("");
        const { data } = await api.get(`/public/plats/${id}`);
        if (!cancelled) setPlat(data || getMockPlatById(id));
      } catch {
        // Pas de backend / plat introuvable → on retombe sur les données locales
        const mock = getMockPlatById(id);
        if (!cancelled) {
          if (mock) setPlat(mock);
          else setErr("Impossible de charger ce plat.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => {
    if (plat) document.title = `${plat.name} – ${Number(plat.price ?? 0).toFixed(0)} € | Chez Mamie Régine`;
  }, [plat]);

  if (loading)
    return (
      <main className="pd">
        <div className="pd-inner">
          <div className="pd-skeleton" />
        </div>
      </main>
    );

  if (err)
    return (
      <main className="pd">
        <div className="pd-inner">
          <p className="pd-error">{err}</p>
          <Link to="/produits" className="btn-primary">Retour au menu</Link>
        </div>
      </main>
    );

  if (!plat) return null;

  const image = Array.isArray(plat.images) && plat.images[0] ? plat.images[0] : null;
  const badges = Array.isArray(plat.badges) && plat.badges.length ? plat.badges : ["Fait maison"];
  const sides = Array.isArray(plat.sideDishes) ? plat.sideDishes : [];
  const infos = Array.isArray(plat.infos) && plat.infos.length
    ? plat.infos
    : ["Plat préparé chaque jour", "Ingrédients frais et locaux", "Recette traditionnelle"];
  const waOrder = whatsappLink(
    `Bonjour Chez Mamie Régine 👋, je souhaite commander : ${plat.name}` +
    (plat.price ? ` (${Number(plat.price).toFixed(0)} €)` : '') + '.'
  );

  return (
    <main className="pd">
      <article className="pd-inner">
        <button className="pd-back" onClick={() => navigate(-1)}>
          ← Retour au menu
        </button>

        <div className="pd-layout">
          {/* ----- Média ----- */}
          <div className="pd-media" data-reveal="left">
            {image ? (
              <SafeImage src={image} alt={plat.name} className="pd-media-img" />
            ) : (
              <div className="pd-media-placeholder" aria-hidden="true">🍽️</div>
            )}
            <span className="pd-media-badge">Fait maison</span>
          </div>

          {/* ----- Contenu ----- */}
          <div className="pd-content" data-reveal="right">
            <div className="pd-head">
              <h1 className="pd-title">
                {plat.nameMain || plat.name}
                {plat.nameAccent ? <span className="pd-title-accent"> {plat.nameAccent}</span> : null}
              </h1>
              <span className="pd-price">{Number(plat.price ?? 0).toFixed(0)} €</span>
            </div>

            <ul className="pd-badges">
              {badges.map((b) => (
                <li key={b} className="pd-badge">
                  <span className="pd-badge-dot" aria-hidden="true" />
                  {b}
                </li>
              ))}
            </ul>

            {plat.description && <p className="pd-desc">{plat.description}</p>}

            {sides.length > 0 && (
              <section className="pd-block">
                <h2 className="pd-block-title">Accompagnements</h2>
                <ul className="pd-sides">
                  {sides.map((s) => (
                    <li key={s.name} className="pd-side">
                      <span className="pd-side-thumb">
                        {s.img ? <img src={s.img} alt="" /> : null}
                      </span>
                      <span className="pd-side-label">{s.name}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section className="pd-block">
              <h2 className="pd-block-title">Informations</h2>
              <ul className="pd-infos">
                {infos.map((i) => (
                  <li key={i} className="pd-info">
                    <span className="pd-check" aria-hidden="true">✓</span>
                    {i}
                  </li>
                ))}
              </ul>
            </section>

            {plat.allergenes && (
              <div className="pd-allergenes">
                <span className="pd-allergenes-label">Allergènes</span>
                <p>{plat.allergenes}</p>
              </div>
            )}

            <div className="pd-cta">
              {plat.isAvailable === false ? (
                <button className="pd-btn pd-btn--primary" disabled>Indisponible</button>
              ) : (
                <>
                  <a
                    className="pd-btn pd-btn--primary"
                    href={waOrder}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Commander sur WhatsApp
                  </a>
                  <a className="pd-btn pd-btn--outline" href={TEL_LINK}>
                    Commander par téléphone
                  </a>
                </>
              )}
            </div>
          </div>
        </div>

        {/* ----- Citation ----- */}
        <section className="pd-quote" data-reveal>
          <div className="pd-quote-text">
            <p>« Une recette transmise avec amour de génération en génération. »</p>
            <cite>— Mamie Régine</cite>
          </div>
          <div className="pd-quote-photo">
            <img src={MAMIE_PHOTO} alt="Mamie Régine en cuisine" />
          </div>
        </section>

        {/* ----- Réassurance ----- */}
        <ul className="pd-reassurance">
          <li><span className="pd-reassurance-num">100%</span><span>Fait maison</span></li>
          <li><span className="pd-reassurance-num">Frais</span><span>Produits du marché</span></li>
          <li><span className="pd-reassurance-num">Lyon</span><span>Livraison rapide</span></li>
        </ul>

        <CommentSection platId={id} />
      </article>
    </main>
  );
}
