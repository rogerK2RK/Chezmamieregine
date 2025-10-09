// frontend/src/pages/admin/AdminCategories.jsx
import { useEffect, useMemo, useState } from 'react';
import apiAdmin from '../../services/apiAdmin';           // ✅ bon client
import authHeaderAdmin from '../../services/authHeaderAdmin';

export default function AdminCategories() {
  const headers = useMemo(() => ({ ...authHeaderAdmin() }), []);
  const [cats, setCats] = useState([]);
  const [plats, setPlats] = useState([]); // pour assignation
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);

  // --- Modale Catégorie (create / edit) ---
  const [catModalOpen, setCatModalOpen] = useState(false);
  const [editing, setEditing] = useState(null); // null = création
  const [form, setForm] = useState({ name: '', description: '', isActive: true });

  // --- Modale d’assignation de plats ---
  const [assignOpen, setAssignOpen] = useState(null); // id catégorie
  const [selectedPlatIds, setSelectedPlatIds] = useState([]);

  const fetchCats = async () => {
    setLoading(true);
    try {
      // ✅ /api/categories
      const { data } = await apiAdmin.get('/categories', { headers });
      setCats(data || []);
    } catch {
      alert('Erreur chargement catégories');
    } finally {
      setLoading(false);
    }
  };

  const fetchPlats = async () => {
    try {
      // ✅ /api/plats
      const { data } = await apiAdmin.get('/plats', { headers });
      setPlats(data || []);
    } catch {
      /* silencieux */
    }
  };

  useEffect(() => { fetchCats(); fetchPlats(); /* eslint-disable */ }, []);

  const filtered = cats.filter(c => {
    const s = q.toLowerCase().trim();
    if (!s) return true;
    return (c.name || '').toLowerCase().includes(s)
        || (c.slug || '').toLowerCase().includes(s); // ✅ toLowerCase
  });

  // --- Ouvrir modale création ---
  const openCreate = () => {
    setEditing(null);
    setForm({ name: '', description: '', isActive: true });
    setCatModalOpen(true);
  };

  // --- Ouvrir modale édition ---
  const openEdit = (c) => {
    setEditing(c);
    setForm({
      name: c.name || '',
      description: c.description || '',
      isActive: !!c.isActive,
    });
    setCatModalOpen(true);
  };

  // --- Enregistrer (création/édition) ---
  const saveCat = async (e) => {
    e.preventDefault();
    const payload = {
      name: (form.name || '').trim(),
      description: (form.description || '').trim(),
      isActive: !!form.isActive,
    };
    if (!payload.name) {
      alert('Le nom est requis');
      return;
    }
    try {
      if (editing) {
        // ✅ /api/categories/:id
        const { data } = await apiAdmin.put(`/categories/${editing._id}`, payload, { headers });
        setCats(prev => prev.map(c => (c._id === editing._id ? data : c)));
      } else {
        // ✅ /api/categories
        const { data } = await apiAdmin.post('/categories', payload, { headers });
        setCats(prev => [data, ...prev]);
      }
      setCatModalOpen(false);
      setEditing(null);
      setForm({ name: '', description: '', isActive: true });
    } catch (e2) {
      alert(e2?.response?.data?.message || 'Enregistrement impossible');
    }
  };

  const removeCat = async (id) => {
    if (!window.confirm('Supprimer cette catégorie ?\n(Refusée si des plats y sont rattachés)')) return; // ✅ window.confirm
    try {
      // ✅ /api/categories/:id
      await apiAdmin.delete(`/categories/${id}`, { headers });
      setCats(prev => prev.filter(c => c._id !== id));
    } catch (e) {
      alert(e?.response?.data?.message || 'Suppression impossible');
    }
  };

  // --- Toggle rapide isActive dans le tableau ---
  const quickToggleActive = async (cat) => {
    try {
      // ✅ /api/categories/:id
      const { data } = await apiAdmin.put(`/categories/${cat._id}`, { isActive: !cat.isActive }, { headers });
      setCats(prev => prev.map(c => (c._id === cat._id ? data : c)));
    } catch {
      alert('Impossible de changer la visibilité');
    }
  };

  // --- Assignation de plats ---
  const openAssign = (catId) => {
    setAssignOpen(catId);
    setSelectedPlatIds([]);
  };

  const toggleSelectPlat = (id) => {
    setSelectedPlatIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const assign = async () => {
    try {
      // ✅ /api/categories/:id/assign-plats
      await apiAdmin.post(`/categories/${assignOpen}/assign-plats`, { platIds: selectedPlatIds }, { headers });
      setAssignOpen(null);
      setSelectedPlatIds([]);
      // Optionnel: fetchCats();
    } catch {
      alert('Assignation impossible');
    }
  };

  return (
    <div className="admin-page">
      <h1 style={{ marginBottom: 16 }}>Catégories</h1>

      {/* Barre d’actions */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <input
          placeholder="Rechercher une catégorie"
          value={q}
          onChange={e => setQ(e.target.value)}
          style={input}
        />
        <button style={btnPrimary} onClick={openCreate}>+ Nouvelle catégorie</button>
      </div>

      {loading ? (
        <div>Chargement…</div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={table}>
            <thead>
              <tr>
                <th style={cell}>Nom</th>
                <th style={cell}>Slug</th>
                <th style={cell}>Active</th>
                <th style={cell}>Créée le</th>
                <th style={cell}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c._id}>
                  <td style={cell}>{c.name}</td>
                  <td style={cell}>{c.slug}</td>
                  <td style={cell}>
                    <span style={c.isActive ? badgeOk : badgeOff}>
                      {c.isActive ? 'Oui' : 'Non'}
                    </span>
                  </td>
                  <td style={cell}>{new Date(c.createdAt).toLocaleString()}</td>
                  <td style={cell}>
                    <button style={btnGhost} onClick={() => openEdit(c)}>Éditer</button>
                    <button style={btnGhost} onClick={() => openAssign(c._id)}>Assigner des plats</button>
                    <button style={btnGhost} onClick={() => quickToggleActive(c)}>
                      {c.isActive ? 'Désactiver' : 'Activer'}
                    </button>
                    <button style={btnDanger} onClick={() => removeCat(c._id)}>Supprimer</button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td style={cell} colSpan={5}>Aucune catégorie</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {/* Modale CREATE/EDIT Catégorie */}
      {catModalOpen && (
        <div style={backdrop} onClick={() => setCatModalOpen(false)}>
          <div style={card} onClick={e => e.stopPropagation()}>
            <h3 style={{ marginTop: 0 }}>{editing ? 'Éditer la catégorie' : 'Nouvelle catégorie'}</h3>
            <form onSubmit={saveCat} style={{ display: 'grid', gap: 10, maxWidth: 520 }}>
              <div>
                <label>Nom *</label>
                <input
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  style={input}
                  required
                />
              </div>
              <div>
                <label>Description</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  style={{ ...input, minHeight: 90 }}
                />
              </div>

              {/* ✅ checkbox visibilité front */}
              <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input
                  type="checkbox"
                  checked={!!form.isActive}
                  onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))}
                />
                Afficher cette catégorie en front
              </label>

              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <button type="button" style={btnGhost} onClick={() => setCatModalOpen(false)}>Annuler</button>
                <button type="submit" style={btnPrimary}>{editing ? 'Enregistrer' : 'Créer'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modale d’assignation de plats */}
      {assignOpen && (
        <div style={backdrop} onClick={() => setAssignOpen(null)}>
          <div style={card} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginTop: 0 }}>Assigner des plats</h3>
            <div style={{ maxHeight: '50vh', overflow: 'auto', paddingRight: 4 }}>
              {plats.map(p => (
                <label key={p._id} style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '6px 0' }}>
                  <input
                    type="checkbox"
                    checked={selectedPlatIds.includes(p._id)}
                    onChange={() => toggleSelectPlat(p._id)}
                  />
                  <span>{p.name} — {Number(p.price).toFixed(2)} €</span>
                </label>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 12 }}>
              <button style={btnGhost} onClick={() => setAssignOpen(null)}>Annuler</button>
              <button style={btnPrimary} onClick={assign}>Assigner</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* Styles */
const table = {
  width: '100%',
  borderCollapse: 'collapse',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: 12,
  overflow: 'hidden'
};
const cell = {
  padding: '12px 10px',
  borderBottom: '1px solid rgba(255,255,255,0.08)',
  textAlign: 'left'
};
const input = {
  flex: 1,
  padding: '10px 12px',
  borderRadius: 8,
  border: '1px solid rgba(255,255,255,0.18)',
  background: 'rgba(255,255,255,0.06)',
  color: '#fff',
  minWidth: 260
};
const btnPrimary = {
  background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
  color: '#fff',
  border: 'none',
  padding: '10px 14px',
  borderRadius: 10,
  cursor: 'pointer'
};
const btnGhost = {
  background: 'rgba(255,255,255,0.06)',
  color: '#e5e7eb',
  border: '1px solid rgba(255,255,255,0.18)',
  padding: '8px 12px',
  borderRadius: 10,
  cursor: 'pointer'
};
const btnDanger = {
  background: 'rgba(239,68,68,0.14)',
  color: '#fecaca',
  border: '1px solid rgba(239,68,68,0.35)',
  padding: '8px 12px',
  borderRadius: 10,
  cursor: 'pointer'
};
const backdrop = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.55)',
  display: 'grid',
  placeItems: 'center',
  zIndex: 40
};
const card = {
  width: 'min(720px, 92vw)',
  background: 'rgba(13,15,18, 0.98)',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: 14,
  padding: 18,
  color: '#e5e7eb'
};
const badgeOk = {
  display: 'inline-block',
  padding: '4px 10px',
  borderRadius: 999,
  fontSize: 12,
  background: 'rgba(34,197,94,.18)',
  color: '#86efac',
  border: '1px solid rgba(34,197,94,.35)'
};
const badgeOff = {
  display: 'inline-block',
  padding: '4px 10px',
  borderRadius: 999,
  fontSize: 12,
  background: 'rgba(239,68,68,.18)',
  color: '#fecaca',
  border: '1px solid rgba(239,68,68,.35)'
};
