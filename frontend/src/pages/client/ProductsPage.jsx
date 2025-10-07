// frontend/src/pages/ProductsPage.jsx
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';

const PAGE_SIZE = 8;

export default function ProductsPage() {
  const { slug } = useParams(); // /produits/:slug ?
  const navigate = useNavigate();

  const [cats, setCats] = useState([]);
  const [plats, setPlats] = useState([]);
  const [activeCat, setActiveCat] = useState(null); // _id
  const [loadingCats, setLoadingCats] = useState(true);
  const [loadingPlats, setLoadingPlats] = useState(false);
  const [page, setPage] = useState(1);
  const [errMsg, setErrMsg] = useState('');

  // 1) Charger les catégories publiques
  useEffect(() => {
    (async () => {
      try {
        setLoadingCats(true);
        setErrMsg('');
        const { data } = await api.get('/public/categories'); // ✅ public
        const list = Array.isArray(data) ? data : [];
        setCats(list);

        // si slug présent -> activer la catégorie correspondante
        if (slug) {
          const found = list.find(c => c.slug === slug);
          if (found) {
            setActiveCat(found._id);
          } else {
            // slug inconnu : on revient sur /produits (Tous)
            setActiveCat(null);
            navigate('/produits', { replace: true });
          }
        } else {
          // pas de slug => “Tous”
          setActiveCat(null);
        }
      } catch (e) {
        console.error('[GET /public/categories]', e?.response?.data || e);
        setErrMsg("Impossible de charger les catégories.");
      } finally {
        setLoadingCats(false);
      }
    })();
  }, [slug, navigate]);

  // 2) Charger les plats publics selon la catégorie
  useEffect(() => {
    (async () => {
      try {
        setLoadingPlats(true);
        setErrMsg('');
        setPage(1);

        const url = activeCat
          ? `/public/plats?category=${activeCat}` // ✅ public
          : `/public/plats`;                      // ✅ public (tous les plats dispos)

        const { data } = await api.get(url);
        setPlats(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error('[GET /public/plats]', e?.response?.data || e);
        setErrMsg("Impossible de charger les plats.");
        setPlats([]);
      } finally {
        setLoadingPlats(false);
      }
    })();
  }, [activeCat]);

  // 3) pagination front
  const pageCount = Math.max(1, Math.ceil(plats.length / PAGE_SIZE));
  const currentPageItems = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return plats.slice(start, start + PAGE_SIZE);
  }, [plats, page]);

  // 4) navigation catégorie
  const goCat = (c) => {
    if (!c) navigate('/produits');
    else navigate(`/produits/${c.slug}`);
  };

  return (
    <div className="container" style={{ padding: '24px 0' }}>
      <h1 style={{ marginBottom: 16 }}>Nos produits</h1>

      {/* Boutons catégories */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
        <button onClick={() => goCat(null)} style={catBtnStyle(!slug)}>
          Tous
        </button>
        {!loadingCats && cats.map(c => (
          <button
            key={c._id}
            onClick={() => goCat(c)}
            style={catBtnStyle(slug === c.slug)}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Erreur globale éventuelle */}
      {errMsg && (
        <div style={{ marginBottom: 12, color: '#b91c1c' }}>{errMsg}</div>
      )}

      {/* Liste des plats */}
      {loadingPlats ? (
        <div>Chargement…</div>
      ) : (
        <>
          {currentPageItems.length === 0 ? (
            <div>Aucun plat dans cette catégorie.</div>
          ) : (
            <div style={grid}>
              {currentPageItems.map(p => (
                <article key={p._id} style={card}>
                  <div style={thumb}>
                    {Array.isArray(p.images) && p.images[0] ? (
                      <img
                        src={p.images[0]}
                        alt={p.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 12 }}
                      />
                    ) : (
                      <div style={{display:'grid',placeItems:'center',height:'100%'}}>🍽️</div>
                    )}
                  </div>
                  <h3 style={{ margin: '8px 0 4px' }}>{p.name}</h3>
                  <div style={{ opacity: .8, fontSize: 14 }}>{p.description || ''}</div>
                  <div style={{ marginTop: 8, fontWeight: 600 }}>{Number(p.price).toFixed(2)} €</div>
                </article>
              ))}
            </div>
          )}

          {/* Pagination */}
          {pageCount > 1 && (
            <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginTop: 16 }}>
              <button disabled={page === 1} onClick={() => setPage(p => Math.max(1, p - 1))}>‹</button>
              {Array.from({ length: pageCount }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  style={pageBtnStyle(page === i + 1)}
                >
                  {i + 1}
                </button>
              ))}
              <button disabled={page === pageCount} onClick={() => setPage(p => Math.min(pageCount, p + 1))}>›</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* styles */
const catBtnStyle = (active) => ({
  padding: '8px 12px',
  borderRadius: 999,
  border: active ? '1px solid transparent' : '1px solid rgba(0,0,0,.12)',
  background: active ? 'linear-gradient(135deg, #4f46e5, #7c3aed)' : 'transparent',
  color: active ? '#fff' : 'inherit',
  cursor: 'pointer'
});

const grid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
  gap: 14
};

const card = {
  background: 'rgba(0,0,0,0.04)',
  border: '1px solid rgba(0,0,0,0.08)',
  borderRadius: 14,
  padding: 10
};

const thumb = {
  width: '100%',
  height: 150,
  borderRadius: 12,
  overflow: 'hidden',
  background: 'rgba(0,0,0,0.06)'
};

const pageBtnStyle = (active) => ({
  padding: '6px 10px',
  borderRadius: 6,
  border: active ? '1px solid transparent' : '1px solid rgba(0,0,0,.12)',
  background: active ? '#4f46e5' : 'transparent',
  color: active ? '#fff' : 'inherit',
  cursor: 'pointer'
});
