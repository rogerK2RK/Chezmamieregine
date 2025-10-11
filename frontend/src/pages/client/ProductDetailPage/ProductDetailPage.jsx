import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../../services/api';
import './ProductDetailPage.css';

export default function ProductDetailPage() {
  const { id } = useParams();
  const [plat, setPlat] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        // Assure-toi d’avoir l’endpoint /api/public/plats/:id côté backend
        const { data } = await api.get(`/public/plats/${id}`);
        setPlat(data);
      } catch (e) {
        console.error('[GET /public/plats/:id]', e?.response?.data || e);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <div className="product-detail">Chargement…</div>;
  if (!plat) return <div className="product-detail">Plat introuvable.</div>;

  return (
    <div className="product-detail">
      <h1>{plat.name}</h1>
      <div className="detail-top">
        {plat.images?.[0] ? (
          <img src={plat.images[0]} alt={plat.name} className="detail-img" />
        ) : (
          <div className="detail-img placeholder">🍽️</div>
        )}
        <div className="detail-info">
          <p className="price">{Number(plat.price).toFixed(2)} €</p>
          <p className="desc">{plat.description || ''}</p>
        </div>
      </div>
    </div>
  );
}
