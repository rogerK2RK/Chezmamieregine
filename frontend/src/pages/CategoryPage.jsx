import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api.js';
import { MOCK_PLATS, MOCK_CATEGORIES } from '../data/mockPlats.js';
import { useCart } from '../context/CartContext.jsx';

const STEP = 9;

export default function CategoryPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addItem, setOpen } = useCart();
  const [cats, setCats] = useState([]);
  const [plats, setPlats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [visible, setVisible] = useState(STEP);

  useEffect(() => {
    (async () => {
      try { const { data } = await api.get('/public/categories'); setCats(data?.length ? data : MOCK_CATEGORIES); }
      catch { setCats(MOCK_CATEGORIES); }
    })();
    (async () => {
      try { const { data } = await api.get('/public/plats'); setPlats(data?.length ? data : MOCK_PLATS); }
      catch { setPlats(MOCK_PLATS); }
      finally { setLoading(false); }
    })();
  }, []);

  const category = useMemo(
    () => cats.find((c) => c.slug === slug) || MOCK_CATEGORIES.find((c) => c.slug === slug) || null,
    [cats, slug]
  );

  useEffect(() => {
    document.title = category ? `${category.name} — Chez Mamie Régine` : 'Catégorie — Chez Mamie Régine';
  }, [category]);
  useEffect(() => { setVisible(STEP); setQ(''); window.scrollTo(0, 0); }, [slug]);

  const catSlug = (p) => p?.category?.slug || p?.categories?.[0]?.slug || '';
  const items = useMemo(() => {
    let l = plats.filter((p) => catSlug(p) === slug);
    if (q.trim()) l = l.filter((p) => (p.name || '').toLowerCase().includes(q.toLowerCase()));
    return l;
  }, [plats, slug, q]);

  const add = (e, p) => { e.stopPropagation(); addItem(p, 1); setOpen(true); };

  return (
    <main>
      {/* Bloc SEO en haut : image représentative + nom FR/MG + texte */}
      <header
        className="cat-hero"
        style={category?.image ? { backgroundImage: `url(${category.image})` } : undefined}
      >
        <div className="cat-hero-overlay">
          <span className="eyebrow" style={{ justifyContent: 'center', color: 'var(--color-primary)' }}>
            Catégorie
          </span>
          <h1>
            {category?.name || 'Catégorie'}
            {category?.nameMg ? <span className="accent-serif"> {category.nameMg}</span> : null}
          </h1>
          {category?.description && <p className="cat-hero-desc">{category.description}</p>}
        </div>
      </header>

      {/* Navigation entre catégories */}
      <section className="section">
        <div className="chips">
          {cats.map((c) => (
            <button
              key={c._id || c.slug}
              className={`chip ${slug === c.slug ? 'active' : ''}`}
              onClick={() => navigate(`/categorie/${c.slug}`)}
            >
              {c.name}{c.nameMg ? ` · ${c.nameMg}` : ''}
            </button>
          ))}
        </div>

        <div className="menu-toolbar">
          <input
            type="search"
            placeholder="Rechercher dans cette catégorie…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>

        {loading ? <p className="loading">Chargement…</p>
          : items.length === 0 ? <p className="empty">Aucun plat dans cette catégorie pour le moment.</p>
          : (
            <div className="cards">
              {items.slice(0, visible).map((p, i) => (
                <article
                  className="card card--clickable"
                  key={p._id}
                  data-reveal
                  style={{ '--reveal-delay': `${(i % 3) * 0.08}s` }}
                  onClick={() => navigate(`/produit/${p._id}`)}
                >
                  <div className="card-media">
                    {p.images?.[0] ? <img src={p.images[0]} alt={p.name} /> : null}
                  </div>
                  <div className="card-body">
                    <h3 className="card-title">
                      {p.name}{p.nameAccent ? <span className="accent-serif"> {p.nameAccent}</span> : null}
                    </h3>
                    {p.badges?.includes('Petit-déj') && <span className="tag-petitdej">Petit-déj</span>}
                    <p className="card-desc">{p.description}</p>
                    <div className="card-foot">
                      <span className="card-price">{Number(p.price ?? 0).toFixed(0)} €</span>
                      <button className="btn-primary" onClick={(e) => add(e, p)}>Ajouter</button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

        {!loading && visible < items.length && (
          <div className="more">
            <button className="btn-outline" onClick={() => setVisible((v) => v + STEP)}>Voir plus</button>
          </div>
        )}
      </section>
    </main>
  );
}
