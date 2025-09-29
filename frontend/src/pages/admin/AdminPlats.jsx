import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import authHeaderAdmin from '../../services/authHeaderAdmin';

export default function AdminPlats() {
  const [plats, setPlats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [selectedIds, setSelectedIds] = useState(new Set());
  const navigate = useNavigate();
  const headers = useMemo(() => ({ ...authHeaderAdmin() }), []);

  const fetchPlats = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/plats', { headers });
      setPlats(data || []);
      setSelectedIds(new Set());
    } catch (e) {
      console.error(e);
      alert('Erreur chargement plats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPlats(); }, []);

  // ---- Sélection
  const toggleOne = (id) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const allFilteredIds = plats
    .filter(p =>
      (p.name || '').toLowerCase().includes(q.toLowerCase()) ||
      (p.category || '').toLowerCase().includes(q.toLowerCase()) ||
      (p.ar || '').toLowerCase().includes(q.toLowerCase()) ||
      (p.platId || '').toLowerCase().includes(q.toLowerCase()) ||
      String(p.price || '').includes(q)
    )
    .map(p => p._id);

  const allSelected = allFilteredIds.length > 0 && allFilteredIds.every(id => selectedIds.has(id));

  const toggleAll = () => {
    setSelectedIds(prev => {
      if (allSelected) {
        const next = new Set(prev);
        allFilteredIds.forEach(id => next.delete(id));
        return next;
      } else {
        const next = new Set(prev);
        allFilteredIds.forEach(id => next.add(id));
        return next;
      }
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ce plat ?')) return;
    try {
      await api.delete(`/plats/${id}`, { headers });
      setPlats(prev => prev.filter(p => p._id !== id));
      setSelectedIds(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    } catch {
      alert('Suppression impossible');
    }
  };

  const filtered = plats.filter(p =>
    (p.name || '').toLowerCase().includes(q.toLowerCase()) ||
    (p.category || '').toLowerCase().includes(q.toLowerCase()) ||
    (p.ar || '').toLowerCase().includes(q.toLowerCase()) ||
    (p.platId || '').toLowerCase().includes(q.toLowerCase()) ||
    String(p.price || '').includes(q)
  );

  return (
    <div className="admin-page">
      <h1 style={{ marginBottom: 16 }}>Plats</h1>

      {/* Barre de recherche + bouton créer */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <input
          placeholder="Rechercher..."
          value={q}
          onChange={e => setQ(e.target.value)}
          style={input}
        />
        <button onClick={() => navigate('/admin/plats/new')} style={btnPrimary}>
          + Nouveau plat
        </button>
      </div>

      {loading ? (
        <div>Chargement…</div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={table}>
            <thead>
              <tr>
                <th style={thTd}>
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleAll}
                    aria-label="Tout sélectionner"
                  />
                </th>
                <th style={thTd}>Image</th>
                <th style={thTd}>ID</th>
                <th style={thTd}>AR</th>
                <th style={thTd}>Nom</th>
                <th style={thTd}>Catégorie</th>
                <th style={thTd}>Prix (€)</th>
                <th style={thTd}>Statut</th>
                <th style={thTd}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(plat => {
                const checked = selectedIds.has(plat._id);
                return (
                  <tr key={plat._id}>
                    <td style={thTd}>
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleOne(plat._id)}
                      />
                    </td>
                    <td style={thTd}>
                      {Array.isArray(plat.images) && plat.images[0] ? (
                        <img
                          src={plat.images[0]}
                          alt={plat.name}
                          style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 8 }}
                        />
                      ) : (
                        <div style={thumbPlaceholder}>🍽️</div>
                      )}
                    </td>
                    <td style={thTd}>{plat.platId}</td>
                    <td style={thTd}>{plat.ar}</td>
                    <td style={thTd}>{plat.name}</td>
                    <td style={thTd}>{plat.category || '-'}</td>
                    <td style={thTd}>{Number(plat.price).toFixed(2)}</td>
                    <td style={thTd}>
                      <span style={plat.isAvailable ? badgeOk : badgeOff}>
                        {plat.isAvailable ? 'Disponible' : 'Indisponible'}
                      </span>
                    </td>
                    <td style={thTd}>
                      <button
                        style={btnGhost}
                        onClick={() => navigate(`/admin/plats/${plat._id}/edit`)}
                      >
                        Éditer
                      </button>
                      <button
                        style={btnDanger}
                        onClick={() => handleDelete(plat._id)}
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td style={thTd} colSpan={9}>Aucun plat trouvé</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* 🎨 Styles */
const table = {
  width: '100%',
  borderCollapse: 'collapse',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: 12,
  overflow: 'hidden',
  background: 'rgba(255,255,255,0.03)',
};
const thTd = {
  padding: '12px 10px',
  borderBottom: '1px solid rgba(255,255,255,0.08)',
  textAlign: 'left',
  color: '#e5e7eb',
};
const input = {
  flex: 1,
  padding: '10px 12px',
  borderRadius: 8,
  border: '1px solid rgba(255,255,255,0.18)',
  background: 'rgba(255,255,255,0.06)',
  color: '#fff',
  minWidth: 240,
};
const btnPrimary = {
  background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
  color: '#fff',
  border: 'none',
  padding: '10px 14px',
  borderRadius: 10,
  cursor: 'pointer',
};
const btnGhost = {
  background: 'rgba(255,255,255,0.06)',
  color: '#e5e7eb',
  border: '1px solid rgba(255,255,255,0.18)',
  padding: '8px 12px',
  borderRadius: 10,
  cursor: 'pointer',
  marginRight: 6,
};
const btnDanger = {
  background: 'rgba(239,68,68,0.14)',
  color: '#fecaca',
  border: '1px solid rgba(239,68,68,0.35)',
  padding: '8px 12px',
  borderRadius: 10,
  cursor: 'pointer',
};
const badgeOk = {
  display: 'inline-block',
  padding: '4px 10px',
  borderRadius: 999,
  fontSize: 12,
  background: 'rgba(34,197,94,.18)',
  color: '#86efac',
  border: '1px solid rgba(34,197,94,.35)',
};
const badgeOff = {
  display: 'inline-block',
  padding: '4px 10px',
  borderRadius: 999,
  fontSize: 12,
  background: 'rgba(239,68,68,.18)',
  color: '#fecaca',
  border: '1px solid rgba(239,68,68,.35)',
};
const thumbPlaceholder = {
  width: 56,
  height: 56,
  borderRadius: 8,
  display: 'grid',
  placeItems: 'center',
  background: 'rgba(255,255,255,0.06)',
  color: '#ccc'
};
