import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../../services/api'; 
import './style.css';

const PAGE_SIZE = 8;

export default function ProductsPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [cats, setCats] = useState([]);
  const [plats, setPlats] = useState([]);
  const [activeCat, setActiveCat] = useState(null);
  const [loadingCats, setLoadingCats] = useState(true);
  const [loadingPlats, setLoadingPlats] = useState(true);
  const [page, setPage] = useState(1);
  const [errMsg, setErrMsg] = useState('');

  // 1) Catégories publiques
  useEffect(() => {
    (async () => {
      try {
        setLoadingCats(true);
        setErrMsg('');
        // bon endpoint public
        const { data } = await api.get('/public/categories');
        const list = Array.isArray(data) ? data : [];
        setCats(list);

        if (slug) {
          const found = list.find(c => c.slug === slug);
          if (found) setActiveCat(found._id);
          else {
            setActiveCat(null);
            navigate('/produits', { replace: true });
          }
        } else {
          setActiveCat(null);
        }
      } catch (e) {
        console.error('[GET /api/public/categories]', e?.response?.data || e);
        setErrMsg('Impossible de charger les catégories.');
      } finally {
        setLoadingCats(false);
      }
    })();
  }, [slug, navigate]);

  // 2) Plats publics (optionnellement filtrés par catégorie)
  useEffect(() => {
    (async () => {
      try {
        setLoadingPlats(true);
        setErrMsg('');
        setPage(1);

        // bon endpoint public
        const url = activeCat
          ? `/public/plats?category=${activeCat}`
          : `/public/plats`;

        const { data } = await api.get(url);
        setPlats(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error('[GET /api/public/plats]', e?.response?.data || e);
        setErrMsg('Impossible de charger les plats.');
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
    <div className="products-container">
      <h2>Nos plats</h2>

      {/* Boutons catégories */}
      <div className="products-categories">
        <button
          onClick={() => goCat(null)}
          className={`cat-btn ${!slug ? 'active' : ''}`}
        >
          Tous
        </button>
        {!loadingCats && cats.map(c => (
          <button
            key={c._id}
            onClick={() => goCat(c)}
            className={`cat-btn ${slug === c.slug ? 'active' : ''}`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Erreur globale éventuelle */}
      {errMsg && <div className="error-msg">{errMsg}</div>}

      {/* Liste des plats */}
      {loadingPlats ? (
        <div className="loading">Chargement…</div>
      ) : (
        <>
          {currentPageItems.length === 0 ? (
            <div className="no-results">Aucun plat dans cette catégorie.</div>
          ) : (
            <div className="products-grid">
             {currentPageItems.map(p => (
                <article
                  key={p._id}
                  className="product-card is-clickable"
                  onClick={() => navigate(`/produit/${p._id}`)}
                  tabIndex={0}
                  onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && navigate(`/produit/${p._id}`)}
                  role="button"
                  aria-label={`Ouvrir ${p.name}`}
                >
                  <div className="thumb">
                    {Array.isArray(p.images) && p.images[0] ? (
                      <img src={p.images[0]} alt={p.name} className="thumb-img" />
                    ) : (
                      <div className="thumb-placeholder">🍽️</div>
                    )}
                  </div>
                  <h3>{p.name}</h3>
                  <p className="desc">{p.description || ''}</p>
                  <p className="price">{Number(p.price ?? 0).toFixed(2)} €</p>
                  <button className='btn-primary' onClick={(e) => { e.stopPropagation(); navigate(`/produit/${p._id}`); }}>Voir le plat</button>
                </article>
              ))}
            </div>
          )}

          {/* Pagination */}
          {pageCount > 1 && (
            <div className="pagination">
              <button
                disabled={page === 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
              >
                ‹
              </button>
              {Array.from({ length: pageCount }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={page === i + 1 ? 'active' : ''}
                >
                  {i + 1}
                </button>
              ))}
              <button
                disabled={page === pageCount}
                onClick={() => setPage(p => Math.min(pageCount, p + 1))}
              >
                ›
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
