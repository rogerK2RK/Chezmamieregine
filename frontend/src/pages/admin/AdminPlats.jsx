import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authHeaderAdmin from '../../services/authHeaderAdmin';
import apiAdmin from '../../services/apiAdmin'; // ← on utilise UNIQUEMENT apiAdmin

export default function AdminPlats() {
  const [plats, setPlats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [busyBulk, setBusyBulk] = useState(false);
  const navigate = useNavigate();
  const headers = useMemo(() => ({ ...authHeaderAdmin() }), []);

  const fetchPlats = async () => {
    try {
      setLoading(true);
      // ✅ bonne URL (préfixe /api) + bon client apiAdmin
      const { data } = await apiAdmin.get('/plats', { headers });
      setPlats(data || []);
      setSelectedIds(new Set());
    } catch (e) {
      console.error(e);
      alert('Erreur chargement plats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPlats(); /* eslint-disable-next-line */ }, []);

  // Helpers
  const getDisplayCategory = (c) => {
    if (!c) return '-';
    if (typeof c === 'string') return c;         // si modèle "category: String"
    if (typeof c === 'object') return c.name || c._id || '-';  // si ref Category
    return String(c);
  };

  // Sélection
  const toggleOne = (id) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  // Liste filtrée + ids filtrés
  const filtered = plats.filter(p => {
    const s = q.toLowerCase();
    const inName = (p.name || '').toLowerCase().includes(s);
    const inAr   = (p.ar || '').toLowerCase().includes(s);
    const inPid  = (p.platId || '').toLowerCase().includes(s);
    const inCat  = getDisplayCategory(p.category).toLowerCase().includes(s);
    const inPrice = String(p.price ?? '').includes(s);
    return inName || inAr || inPid || inCat || inPrice;
  });

  const allFilteredIds = filtered.map(p => p._id);
  const allSelected = allFilteredIds.length > 0 && allFilteredIds.every(id => selectedIds.has(id));

  const toggleAll = () => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (allSelected) {
        allFilteredIds.forEach(id => next.delete(id));
      } else {
        allFilteredIds.forEach(id => next.add(id));
      }
      return next;
    });
  };

  // Actions unitaires
  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ce plat ?')) return;
    try {
      // ✅ /api/plats/:id et apiAdmin
      await apiAdmin.delete(`/plats/${id}`, { headers });
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

  // 🎯 ACTIONS GROUPÉES
  const bulkDelete = async () => {
    if (selectedIds.size === 0) return;
    if (!window.confirm(`Supprimer ${selectedIds.size} plat(s) ?`)) return;
    setBusyBulk(true);
    try {
      const ids = Array.from(selectedIds);
      // ✅ /api/plats/:id et apiAdmin
      await Promise.all(ids.map(id => apiAdmin.delete(`/api/plats/${id}`, { headers })));
      setPlats(prev => prev.filter(p => !selectedIds.has(p._id)));
      setSelectedIds(new Set());
    } catch (e) {
      console.error(e);
      alert("Suppression groupée impossible");
    } finally {
      setBusyBulk(false);
    }
  };

  const bulkSetAvailability = async (isAvailable) => {
    if (selectedIds.size === 0) return;
    setBusyBulk(true);
    try {
      const ids = Array.from(selectedIds);
      // ✅ /api/plats/:id et apiAdmin
      await Promise.all(
        ids.map(id => apiAdmin.put(`/plats/${id}`, { isAvailable }, { headers }))
      );
      // Mise à jour optimiste locale
      setPlats(prev =>
        prev.map(p => selectedIds.has(p._id) ? { ...p, isAvailable } : p)
      );
      setSelectedIds(new Set());
    } catch (e) {
      console.error(e);
      alert("Mise à jour groupée impossible");
    } finally {
      setBusyBulk(false);
    }
  };

  return (
    <div className="admin-page">
      {/* Barre de recherche + bouton créer */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 12, alignItems: 'center' }}>
        <input
          placeholder="Rechercher (nom, AR, ID, catégorie, prix)"
          value={q}
          onChange={e => setQ(e.target.value)}
          style={input}
        />
        <button onClick={() => navigate('/admin/plats/new')} style={btnPrimary}>
          + Nouveau plat
        </button>
      </div>

      {/* ✅ Barre d'actions groupées (s’affiche s’il y a une sélection) */}
      {selectedIds.size > 0 && (
        <div style={bulkBar}>
          <div>{selectedIds.size} sélectionné(s)</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button disabled={busyBulk} onClick={() => bulkSetAvailability(true)} style={btnGhost}>
              Marquer “Disponible”
            </button>
            <button disabled={busyBulk} onClick={() => bulkSetAvailability(false)} style={btnGhost}>
              Marquer “Indisponible”
            </button>
            <button disabled={busyBulk} onClick={bulkDelete} style={btnDanger}>
              Supprimer la sélection
            </button>
          </div>
        </div>
      )}

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
                    <td style={thTd}>{getDisplayCategory(plat.category)}</td>
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
const bulkBar = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 12,
  padding: '10px 12px',
  border: '1px dashed rgba(255,255,255,0.18)',
  borderRadius: 10,
  marginBottom: 12,
  background: 'rgba(255,255,255,0.04)',
  color: '#e5e7eb',
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
