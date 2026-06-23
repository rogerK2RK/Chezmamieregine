import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../services/api.js';
import SafeImage from '../components/SafeImage.jsx';
import { getMockPlatById } from '../data/mockPlats.js';
import { whatsappLink, TEL_LINK } from '../config/contact.js';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plat, setPlat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  useEffect(() => {
    let off = false;
    (async () => {
      try {
        const { data } = await api.get(`/public/plats/${id}`);
        if (!off) setPlat(data || getMockPlatById(id));
      } catch {
        const m = getMockPlatById(id);
        if (!off) { if (m) setPlat(m); else setErr('Impossible de charger ce plat.'); }
      } finally { if (!off) setLoading(false); }
    })();
    return () => { off = true; };
  }, [id]);

  useEffect(() => { if (plat) document.title = `${plat.name} — Chez Mamie Régine`; }, [plat]);

  if (loading) return <main className="pd"><p className="loading">Chargement…</p></main>;
  if (err || !plat) return <main className="pd"><p className="empty">{err || 'Plat introuvable.'}</p><Link className="btn-primary" to="/produits">Retour au menu</Link></main>;

  const img = plat.images?.[0];
  const badges = plat.badges?.length ? plat.badges : ['Fait maison'];
  const order = whatsappLink(`Bonjour, je souhaite commander : ${plat.name}${plat.price ? ` (${plat.price} €)` : ''}.`);

  return (
    <main className="pd">
      <button className="pd-back" onClick={() => navigate(-1)}>← Retour</button>
      <div className="pd-layout">
        <div className="pd-media" data-reveal="left">
          <SafeImage src={img} alt={plat.name} fallback={<div style={{ padding: '4rem', textAlign: 'center' }}>🍽️</div>} />
        </div>
        <div data-reveal="right">
          <div className="pd-head">
            <h1 className="pd-title">{plat.name}{plat.nameAccent ? <span className="accent-serif"> {plat.nameAccent}</span> : null}</h1>
            <span className="pd-price">{Number(plat.price ?? 0).toFixed(0)} €</span>
          </div>
          <ul className="pd-badges">{badges.map((b) => <li key={b}>{b}</li>)}</ul>
          {plat.description && <p className="pd-desc">{plat.description}</p>}
          {plat.sideDishes?.length > 0 && (
            <p style={{ color: 'var(--color-text-muted)' }}><strong>Accompagnements : </strong>{plat.sideDishes.map((s) => s.name).join(', ')}</p>
          )}
          <div className="pd-cta">
            <a className="btn-primary" href={order} target="_blank" rel="noreferrer">Commander sur WhatsApp</a>
            <a className="btn-outline" href={TEL_LINK}>Commander par téléphone</a>
          </div>
        </div>
      </div>
    </main>
  );
}
