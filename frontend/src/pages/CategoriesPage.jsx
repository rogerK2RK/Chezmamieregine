import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api.js';
import { MOCK_CATEGORIES } from '../data/mockPlats.js';

export default function CategoriesPage() {
  const navigate = useNavigate();
  const [cats, setCats] = useState([]);

  useEffect(() => { document.title = 'Nos plats — Chez Mamie Régine'; }, []);
  useEffect(() => {
    (async () => {
      try { const { data } = await api.get('/public/categories'); setCats(data?.length ? data : MOCK_CATEGORIES); }
      catch { setCats(MOCK_CATEGORIES); }
    })();
  }, []);

  return (
    <main>
      <header className="page-hero">
        <span className="eyebrow" style={{ justifyContent: 'center', color: 'var(--color-primary)' }}>Notre cuisine</span>
        <h1>Nos plats <span className="accent-serif">malgaches</span></h1>
        <p>Choisissez une catégorie, puis commandez par WhatsApp ou téléphone.</p>
      </header>

      <section className="section">
        <div className="cat-grid">
          {cats.map((c, i) => (
            <article
              className="cat-card"
              key={c._id || c.slug}
              data-reveal
              style={{ '--reveal-delay': `${(i % 3) * 0.08}s` }}
              onClick={() => navigate(`/categorie/${c.slug}`)}
            >
              <div className="cat-card-media">
                {c.image ? <img src={c.image} alt={c.name} /> : null}
              </div>
              <div className="cat-card-body">
                <h3 className="cat-card-title">
                  {c.name}{c.nameMg ? <span className="accent-serif"> {c.nameMg}</span> : null}
                </h3>
                <span className="cat-card-link">Découvrir →</span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
