import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api.js';
import apiAdmin from '../../services/apiAdmin.js';

export default function AdminPlats() {
  const [plats, setPlats] = useState([]);
  const [msg, setMsg] = useState('');

  const load = async () => {
    try { const { data } = await api.get('/public/plats'); setPlats(data || []); } catch { setPlats([]); }
  };
  useEffect(() => { load(); }, []);

  const remove = async (id) => {
    if (!window.confirm('Supprimer ce plat ?')) return;
    try { await apiAdmin.delete(`/admin/plats/${id}`); setMsg('Plat supprimé.'); load(); }
    catch (e) { setMsg(e?.response?.data?.message || 'Erreur.'); }
  };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <h1>Plats</h1>
        <Link to="/admin/plats/new" className="admin-btn primary">+ Nouveau plat</Link>
      </div>
      {msg && <p className="alert ok">{msg}</p>}
      <table className="admin-table">
        <thead><tr><th>Nom</th><th>Prix</th><th>Catégorie</th><th></th></tr></thead>
        <tbody>
          {plats.map((p) => (
            <tr key={p._id}>
              <td>{p.name}</td>
              <td>{Number(p.price ?? 0).toFixed(0)} €</td>
              <td>{p.category?.name || '—'}</td>
              <td><div className="admin-actions">
                <Link className="admin-btn" to={`/admin/plats/${p._id}/edit`}>Éditer</Link>
                <button className="admin-btn danger" onClick={() => remove(p._id)}>Suppr.</button>
              </div></td>
            </tr>
          ))}
          {plats.length === 0 && <tr><td colSpan="4" style={{ color: 'var(--color-text-muted)' }}>Aucun plat.</td></tr>}
        </tbody>
      </table>
    </>
  );
}
