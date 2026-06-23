import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api.js';
import { MOCK_PLATS, MOCK_CATEGORIES } from '../data/mockPlats.js';
import { whatsappLink } from '../config/contact.js';

const STEP = 6;

export default function ProductsPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [cats, setCats] = useState([]);
  const [plats, setPlats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [sort, setSort] = useState('default');
  const [visible, setVisible] = useState(STEP);

  useEffect(() => { document.title = 'Nos plats — Chez Mamie Régine'; }, []);
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

  const catSlug = (p) => p?.category?.slug || p?.categories?.[0]?.slug || '';
  const filtered = useMemo(() => {
    let l = [...plats];
    if (slug) l = l.filter((p) => catSlug(p) === slug);
    if (q.trim()) l = l.filter((p) => (p.name || '').toLowerCase().includes(q.toLowerCase()));
    if (sort === 'asc') l.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
    if (sort === 'desc') l.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
    return l;
  }, [plats, slug, q, sort]);
  useEffect(() => setVisible(STEP), [slug, q, sort]);

  const order = (p) => whatsappLink(`Bonjour, je souhaite commander : ${p.name}${p.price ? ` (${p.price} €)` : ''}.`);

  return (
    <main>
      <header className="page-hero">
        <span className="eyebrow" style={{ justifyContent: 'center', color: 'var(--color-primary)' }}>Notre cuisine</span>
        <h1>Nos plats <span className="accent-serif">malgaches</span></h1>
        <p>Faits maison chaque jour. Choisissez, commandez par WhatsApp ou téléphone, régalez-vous.</p>
      </header>

      <section className="section">
        <div className="chips">
          <button className={`chip ${!slug ? 'active' : ''}`} onClick={() => navigate('/produits')}>Tous</button>
          {cats.map((c) => (
            <button key={c._id || c.slug} className={`chip ${slug === c.slug ? 'active' : ''}`} onClick={() => navigate(`/produits/${c.slug}`)}>{c.name}</button>
          ))}
        </div>
        <div className="menu-toolbar">
          <input type="search" placeholder="Rechercher un plat…" value={q} onChange={(e) => setQ(e.target.value)} />
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="default">Trier par prix</option>
            <option value="asc">Prix croissant</option>
            <option value="desc">Prix décroissant</option>
          </select>
        </div>

        {loading ? <p className="loading">Chargement…</p>
          : filtered.length === 0 ? <p className="empty">Aucun plat ne correspond.</p>
          : (
            <div className="cards">
              {filtered.slice(0, visible).map((p, i) => (
                <article className="card" key={p._id} data-reveal style={{ '--reveal-delay': `${(i % 3) * 0.08}s` }}>
                  <div className="card-media" onClick={() => navigate(`/produit/${p._id}`)}>
                    {p.images?.[0] ? <img src={p.images[0]} alt={p.name} /> : null}
                    <span className="card-badge">Fait maison</span>
                  </div>
                  <div className="card-body">
                    <h3 className="card-title" onClick={() => navigate(`/produit/${p._id}`)}>
                      {p.name}{p.nameAccent ? <span className="accent-serif"> {p.nameAccent}</span> : null}
                    </h3>
                    <p className="card-desc">{p.description}</p>
                    <div className="card-foot">
                      <span className="card-price">{Number(p.price ?? 0).toFixed(0)} €</span>
                      <a className="btn-primary" href={order(p)} target="_blank" rel="noopener noreferrer">Commander</a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

        {!loading && visible < filtered.length && (
          <div className="more"><button className="btn-outline" onClick={() => setVisible((v) => v + STEP)}>Voir plus de plats</button></div>
        )}
      </section>
    </main>
  );
}
