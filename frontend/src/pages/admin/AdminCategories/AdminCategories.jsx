import { useEffect, useMemo, useState } from 'react';
import apiAdmin from '../../../services/apiAdmin';
import authHeaderAdmin from '../../../services/authHeaderAdmin';
import './style.css'; // ⬅️ nouveau CSS

export default function AdminCategories() {
  const headers = useMemo(() => ({ ...authHeaderAdmin() }), []);
  const [cats, setCats] = useState([]);
  const [plats, setPlats] = useState([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);

  const [catModalOpen, setCatModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', isActive: true });

  const [assignOpen, setAssignOpen] = useState(null);
  const [selectedPlatIds, setSelectedPlatIds] = useState([]);

  const fetchCats = async () => {
    setLoading(true);
    try {
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
      const { data } = await apiAdmin.get('/plats', { headers });
      setPlats(data || []);
    } catch {}
  };

  useEffect(() => { fetchCats(); fetchPlats(); /* eslint-disable */ }, []);

  const filtered = cats.filter(c => {
    const s = q.toLowerCase().trim();
    if (!s) return true;
    return (c.name || '').toLowerCase().includes(s)
        || (c.slug || '').toLowerCase().includes(s);
  });

  const openCreate = () => {
    setEditing(null);
    setForm({ name: '', description: '', isActive: true });
    setCatModalOpen(true);
  };

  const openEdit = (c) => {
    setEditing(c);
    setForm({
      name: c.name || '',
      description: c.description || '',
      isActive: !!c.isActive,
    });
    setCatModalOpen(true);
  };

  const saveCat = async (e) => {
    e.preventDefault();
    const payload = {
      name: (form.name || '').trim(),
      description: (form.description || '').trim(),
      isActive: !!form.isActive,
    };
    if (!payload.name) { alert('Le nom est requis'); return; }

    try {
      if (editing) {
        const { data } = await apiAdmin.put(`/categories/${editing._id}`, payload, { headers });
        setCats(prev => prev.map(c => (c._id === editing._id ? data : c)));
      } else {
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
    if (!window.confirm('Supprimer cette catégorie ?\n(Refusée si des plats y sont rattachés)')) return;
    try {
      await apiAdmin.delete(`/categories/${id}`, { headers });
      setCats(prev => prev.filter(c => c._id !== id));
    } catch (e) {
      alert(e?.response?.data?.message || 'Suppression impossible');
    }
  };

  const quickToggleActive = async (cat) => {
    try {
      const { data } = await apiAdmin.put(`/categories/${cat._id}`, { isActive: !cat.isActive }, { headers });
      setCats(prev => prev.map(c => (c._id === cat._id ? data : c)));
    } catch {
      alert('Impossible de changer la visibilité');
    }
  };

  const openAssign = (catId) => {
    setAssignOpen(catId);
    setSelectedPlatIds([]);
  };

  const toggleSelectPlat = (id) => {
    setSelectedPlatIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const assign = async () => {
    try {
      await apiAdmin.post(`/categories/${assignOpen}/assign-plats`, { platIds: selectedPlatIds }, { headers });
      setAssignOpen(null);
      setSelectedPlatIds([]);
    } catch {
      alert('Assignation impossible');
    }
  };

  return (
    <main className="admin-page">
      <h1 className="h1-mb16">Catégories</h1>

      {/* Barre d’actions */}
      <div className="admin-actions">
        <input
          className="admin-input"
          placeholder="Rechercher une catégorie"
          value={q}
          onChange={e => setQ(e.target.value)}
        />
        <button className="btn-primary-back" onClick={openCreate}>+ Nouvelle catégorie</button>
      </div>

      {loading ? (
        <div>Chargement…</div>
      ) : (
        <div className="overflow-x">
          <table className="admin-table">
            <thead>
              <tr>
                <th className="admin-cell">Nom</th>
                <th className="admin-cell">Slug</th>
                <th className="admin-cell">Active</th>
                <th className="admin-cell">Créée le</th>
                <th className="admin-cell">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c._id}>
                  <td className="admin-cell">{c.name}</td>
                  <td className="admin-cell">{c.slug}</td>
                  <td className="admin-cell">
                    <span className={c.isActive ? 'badge-ok' : 'badge-off'}>
                      {c.isActive ? 'Oui' : 'Non'}
                    </span>
                  </td>
                  <td className="admin-cell">{new Date(c.createdAt).toLocaleString()}</td>
                  <td className="admin-cell">
                    <button className="btn-ghost" onClick={() => openEdit(c)}>Éditer</button>
                    <button className="btn-ghost" onClick={() => openAssign(c._id)}>Assigner des plats</button>
                    <button className="btn-ghost" onClick={() => quickToggleActive(c)}>
                      {c.isActive ? 'Désactiver' : 'Activer'}
                    </button>
                    <button className="btn-danger" onClick={() => removeCat(c._id)}>Supprimer</button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td className="admin-cell" colSpan={5}>Aucune catégorie</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {/* Modale CREATE/EDIT */}
      {catModalOpen && (
        <div className="backdrop" onClick={() => setCatModalOpen(false)}>
          <div className="card" onClick={e => e.stopPropagation()}>
            <h3 className="mt0">{editing ? 'Éditer la catégorie' : 'Nouvelle catégorie'}</h3>
            <form onSubmit={saveCat} className="modal-form">
              <div>
                <label>Nom *</label>
                <input
                  className="admin-input"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label>Description</label>
                <textarea
                  className="admin-input"
                  style={{ minHeight: 90 }}
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                />
              </div>

              <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input
                  type="checkbox"
                  checked={!!form.isActive}
                  onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))}
                />
                Afficher cette catégorie en front
              </label>

              <div className="modal-actions">
                <button type="button" className="btn-ghost" onClick={() => setCatModalOpen(false)}>Annuler</button>
                <button type="submit" className="btn-primary-back">{editing ? 'Enregistrer' : 'Créer'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modale d’assignation */}
      {assignOpen && (
        <div className="backdrop" onClick={() => setAssignOpen(null)}>
          <div className="card" onClick={(e) => e.stopPropagation()}>
            <h3 className="mt0">Assigner des plats</h3>
            <div className="assign-list">
              {plats.map(p => (
                <label key={p._id} className="assign-row">
                  <input
                    type="checkbox"
                    checked={selectedPlatIds.includes(p._id)}
                    onChange={() => toggleSelectPlat(p._id)}
                  />
                  <span>{p.name} — {Number(p.price).toFixed(2)} €</span>
                </label>
              ))}
            </div>
            <div className="modal-actions">
              <button className="btn-ghost" onClick={() => setAssignOpen(null)}>Annuler</button>
              <button className="btn-primary-back" onClick={assign}>Assigner</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
