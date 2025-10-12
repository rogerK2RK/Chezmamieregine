import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authHeaderAdmin from '../../../services/authHeaderAdmin';
import apiAdmin from '../../../services/apiAdmin';
import './style.css';

export default function AdminPlats() {
  const [plats, setPlats] = useState([]);
  const [cats, setCats] = useState([]);
  const [catMap, setCatMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [busyBulk, setBusyBulk] = useState(false);
  const navigate = useNavigate();
  const headers = useMemo(() => ({ ...authHeaderAdmin() }), []);

  const fetchPlats = async () => {
    try {
      setLoading(true);
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

  const fetchCats = async () => {
    try {
      const { data } = await apiAdmin.get('/categories', { headers });
      setCats(Array.isArray(data) ? data : []);
      const map = {};
      (data || []).forEach(c => { map[c._id] = c.name; });
      setCatMap(map);
    } catch (e) {
      console.error('Erreur chargement catégories', e?.response?.data || e);
    }
  };

  useEffect(() => { fetchPlats(); fetchCats(); }, []);

  // Helpers
  const getDisplayCategory = (c) => {
    if (!c) return '-';
    if (typeof c === 'object') return c.name || '-';
    if (typeof c === 'string') return catMap[c] || '-';
    return '-';
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
      await Promise.all(
        ids.map(id => apiAdmin.put(`/plats/${id}`, { isAvailable }, { headers }))
      );
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
      <div className="toolbar">
        <input
          className="input"
          placeholder="Rechercher (nom, AR, ID, catégorie, prix)"
          value={q}
          onChange={e => setQ(e.target.value)}
        />
        <button onClick={() => navigate('/admin/plats/new')} className="btn-primary-back">
          + Nouveau plat
        </button>
      </div>

      {/* ✅ Barre d'actions groupées */}
      {selectedIds.size > 0 && (
        <div className="bulk-bar">
          <div>{selectedIds.size} sélectionné(s)</div>
          <div className="bulk-actions">
            <button disabled={busyBulk} onClick={() => bulkSetAvailability(true)} className="btn-ghost">
              Marquer “Disponible”
            </button>
            <button disabled={busyBulk} onClick={() => bulkSetAvailability(false)} className="btn-ghost">
              Marquer “Indisponible”
            </button>
            <button disabled={busyBulk} onClick={bulkDelete} className="btn-danger">
              Supprimer la sélection
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div>Chargement…</div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th className="cell cell-checkbox">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleAll}
                    aria-label="Tout sélectionner"
                  />
                </th>
                <th className="cell">Image</th>
                <th className="cell">ID</th>
                <th className="cell">AR</th>
                <th className="cell">Nom</th>
                <th className="cell">Catégorie</th>
                <th className="cell">Prix (€)</th>
                <th className="cell">Statut</th>
                <th className="cell">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(plat => {
                const checked = selectedIds.has(plat._id);
                return (
                  <tr key={plat._id}>
                    <td className="cell">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleOne(plat._id)}
                      />
                    </td>
                    <td className="cell">
                      {Array.isArray(plat.images) && plat.images[0] ? (
                        <img
                          src={plat.images[0]}
                          alt={plat.name}
                          className="thumb"
                        />
                      ) : (
                        <div className="thumb-placeholder">🍽️</div>
                      )}
                    </td>
                    <td className="cell">{plat.platId}</td>
                    <td className="cell">{plat.ar}</td>
                    <td className="cell">{plat.name}</td>
                    <td className="cell">{getDisplayCategory(plat.category)}</td>
                    <td className="cell">{Number(plat.price).toFixed(2)}</td>
                    <td className="cell">
                      <span className={plat.isAvailable ? 'badge-ok' : 'badge-off'}>
                        {plat.isAvailable ? 'Disponible' : 'Indisponible'}
                      </span>
                    </td>
                    <td className="cell">
                      <button
                        className="btn-ghost"
                        onClick={() => navigate(`/admin/plats/${plat._id}/edit`)}
                      >
                        Éditer
                      </button>
                      <button
                        className="btn-danger"
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
                  <td className="cell" colSpan={9}>Aucun plat trouvé</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
