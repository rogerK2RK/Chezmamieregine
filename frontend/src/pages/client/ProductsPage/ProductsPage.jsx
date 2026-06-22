import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../../services/api';
import { MOCK_PLATS, MOCK_CATEGORIES } from '../../../data/mockPlats';
import Reassurance from '../../../components/shared/Reassurance/Reassurance.jsx';
import heroImg from '../../../components/shared/Hero/images/hero-ravitoto.jpg';
import './style.css';

const PAGE_STEP = 6;

export default function ProductsPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [cats, setCats] = useState([]);
  const [plats, setPlats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('default');
  const [visible, setVisible] = useState(PAGE_STEP);

  // Catégories
  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/public/categories');
        setCats(Array.isArray(data) && data.length ? data : MOCK_CATEGORIES);
      } catch {
        setCats(MOCK_CATEGORIES);
      }
    })();
  }, []);

  // Plats
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/public/plats');
        setPlats(Array.isArray(data) && data.length ? data : MOCK_PLATS);
      } catch {
        setPlats(MOCK_PLATS);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // SEO
  useEffect(() => {
    document.title = 'Nos plats malgaches – Chez Mamie Régine';
  }, []);

  const catSlug = (p) =>
    p?.category?.slug ||
    (Array.isArray(p?.categories) && p.categories[0]?.slug) ||
    '';

  // Filtrage + tri
  const filtered = useMemo(() => {
    let list = [...plats];
    if (slug) list = list.filter((p) => catSlug(p) === slug);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((p) => (p.name || '').toLowerCase().includes(q));
    }
    if (sort === 'price-asc') list.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
    if (sort === 'price-desc') list.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
    return list;
  }, [plats, slug, search, sort]);

  useEffect(() => setVisible(PAGE_STEP), [slug, search, sort]);

  const shown = filtered.slice(0, visible);
  const related = plats.filter((p) => !shown.some((s) => s._id === p._id)).slice(0, 3);

  const goCat = (s) => navigate(s ? `/produits/${s}` : '/produits');
  const openPlat = (p) => navigate(`/produit/${p._id}`);

  const Badges = ({ p }) => {
    const badges = Array.isArray(p.badges) && p.badges.length ? p.badges : ['Fait maison'];
    return (
      <ul className="menu-card-badges">
        {badges.slice(0, 3).map((b) => (
          <li key={b}><span className="menu-dot" aria-hidden="true" />{b}</li>
        ))}
      </ul>
    );
  };

  return (
    <main className="menu-page">
      {/* Hero compact propre à la page menu */}
      <header
        className="menu-hero"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(20,9,4,0.82), rgba(20,9,4,0.45)), url(${heroImg})`,
        }}
      >
        <div className="menu-hero-inner">
          <span className="section-eyebrow">Notre cuisine</span>
          <h1 className="menu-hero-title">
            Nos plats <span className="menu-hero-accent">malgaches</span>
          </h1>
          <p className="menu-hero-desc">
            Faits maison chaque jour, inspirés des saveurs authentiques de
            Madagascar. Choisissez, commandez, régalez-vous.
          </p>
        </div>
      </header>

      <div className="menu-body">
        {/* Chips catégories */}
        <div className="menu-chips">
          <button className={`menu-chip ${!slug ? 'is-active' : ''}`} onClick={() => goCat(null)}>
            Tous les plats
          </button>
          {cats.map((c) => (
            <button
              key={c._id || c.slug}
              className={`menu-chip ${slug === c.slug ? 'is-active' : ''}`}
              onClick={() => goCat(c.slug)}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* Filtres */}
        <div className="menu-filters">
          <div className="menu-search">
            <span className="menu-search-icon" aria-hidden="true">⌕</span>
            <input
              type="search"
              placeholder="Rechercher un plat..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Rechercher un plat"
            />
          </div>
          <select
            className="menu-select"
            value={slug || ''}
            onChange={(e) => goCat(e.target.value || null)}
            aria-label="Filtrer par catégorie"
          >
            <option value="">Catégorie</option>
            {cats.map((c) => (
              <option key={c._id || c.slug} value={c.slug}>{c.name}</option>
            ))}
          </select>
          <select
            className="menu-select"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            aria-label="Trier par prix"
          >
            <option value="default">Prix</option>
            <option value="price-asc">Prix croissant</option>
            <option value="price-desc">Prix décroissant</option>
          </select>
        </div>

        {/* Liste */}
        {loading ? (
          <div className="menu-loading">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="menu-card-skeleton skeleton" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="menu-empty">
            <p>Aucun plat ne correspond à votre recherche.</p>
            <button className="btn-primary" onClick={() => { setSearch(''); goCat(null); }}>
              Voir tous les plats
            </button>
          </div>
        ) : (
          <div className="menu-list">
            {shown.map((p, i) => (
              <article
                key={p._id}
                className={`menu-card ${i % 2 === 1 ? 'is-reverse' : ''}`}
                data-reveal
              >
                <div className="menu-card-media" onClick={() => openPlat(p)}>
                  {Array.isArray(p.images) && p.images[0] ? (
                    <img src={p.images[0]} alt={p.name} />
                  ) : (
                    <div className="menu-card-placeholder" aria-hidden="true">🍽️</div>
                  )}
                  <span className="menu-card-badge">Fait maison</span>
                </div>

                <div className="menu-card-body">
                  <h2 className="menu-card-title">
                    {p.nameMain || p.name}
                    {p.nameAccent ? <span className="menu-card-accent"> {p.nameAccent}</span> : null}
                  </h2>
                  <Badges p={p} />
                  <p className="menu-card-desc">{p.description || ''}</p>
                  <div className="menu-card-foot">
                    <span className="menu-card-price">{Number(p.price ?? 0).toFixed(0)} €</span>
                    <button className="btn-primary" onClick={() => openPlat(p)}>Commander</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Voir plus */}
        {!loading && visible < filtered.length && (
          <div className="menu-more">
            <button className="menu-more-btn" onClick={() => setVisible((v) => v + PAGE_STEP)}>
              Voir plus de plats ↓
            </button>
          </div>
        )}

        {/* Suggestions */}
        {!loading && related.length > 0 && (
          <section className="menu-related">
            <h2 className="menu-related-title">Vous pourriez aussi aimer</h2>
            <div className="menu-related-grid">
              {related.map((p) => (
                <article key={p._id} className="menu-mini" onClick={() => openPlat(p)}>
                  <div className="menu-mini-media">
                    {Array.isArray(p.images) && p.images[0] ? (
                      <img src={p.images[0]} alt={p.name} />
                    ) : (
                      <div className="menu-card-placeholder" aria-hidden="true">🍽️</div>
                    )}
                  </div>
                  <div className="menu-mini-body">
                    <h3>{p.name}</h3>
                    <span className="menu-mini-cat">{p.category?.name || ''}</span>
                  </div>
                  <div className="menu-mini-foot">
                    <span className="menu-mini-price">{Number(p.price ?? 0).toFixed(0)} €</span>
                    <button className="menu-mini-add" aria-label={`Commander ${p.name}`}>+</button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Réassurance (bandeau partagé) */}
      <Reassurance />
    </main>
  );
}
