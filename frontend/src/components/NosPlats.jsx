import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api.js';
import { MOCK_PLATS } from '../data/mockPlats.js';
import { useCart } from '../context/CartContext.jsx';

const isHome = (p) => {
  const cats = [p.category, ...(p.categories || [])].filter(Boolean);
  return cats.some((c) => c && (c.name === 'Accueil' || c.slug === 'home' || c.name === 'Home'));
};

export default function NosPlats() {
  const [plats, setPlats] = useState([]);
  const navigate = useNavigate();
  const { addItem, setOpen } = useCart();

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/public/plats');
        const list = Array.isArray(data) && data.length ? data : MOCK_PLATS;
        const home = list.filter(isHome);
        setPlats((home.length ? home : list).slice(0, 3));
      } catch {
        setPlats(MOCK_PLATS.slice(0, 3));
      }
    })();
  }, []);

  const add = (e, p) => { e.stopPropagation(); addItem(p, 1); setOpen(true); };

  return (
    <section className="section section--dark">
      <div className="section-head">
        <span className="eyebrow" data-reveal>À la carte</span>
        <h2 className="section-title" data-reveal style={{ '--reveal-delay': '.08s' }}>Nos plats à la une</h2>
      </div>
      <div className="cards">
        {plats.map((p, idx) => (
          <article className="card card--clickable" key={p._id} data-reveal style={{ '--reveal-delay': `${idx * 0.08}s` }} onClick={() => navigate(`/produit/${p._id}`)}>
            <div className="card-media">
              {p.images?.[0] ? <img src={p.images[0]} alt={p.name} /> : null}
            </div>
            <div className="card-body">
              <h3 className="card-title">{p.name}</h3>
              <p className="card-desc">{p.description}</p>
              <div className="card-foot">
                <span className="card-price">{Number(p.price ?? 0).toFixed(0)} €</span>
                <button className="btn-primary" onClick={(e) => add(e, p)}>Ajouter</button>
              </div>
            </div>
          </article>
        ))}
      </div>
      <div className="steps-cta" style={{ marginTop: '2.5rem' }}>
        <Link to="/categories" className="btn-outline">Voir tout le menu</Link>
      </div>
    </section>
  );
}
