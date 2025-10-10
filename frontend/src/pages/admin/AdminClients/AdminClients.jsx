import { useEffect, useMemo, useState } from 'react';
import apiAdmin from '../../../services/apiAdmin';
import authHeaderAdmin from '../../../services/authHeaderAdmin';
import './AdminClients.css'; // ⬅️ nouveau CSS

export default function AdminClients() {
  const [clients, setClients] = useState([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);

  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ firstName: '', lastName: '', sex: '', email: '' });

  const [selectedIds, setSelectedIds] = useState(new Set());
  const headers = useMemo(() => ({ ...authHeaderAdmin() }), []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const { data } = await apiAdmin.get('/admin/clients', { headers });
      setClients(Array.isArray(data) ? data : []);
      setSelectedIds(new Set());
    } catch (e) {
      console.error('[GET clients] error', e?.response?.data || e);
      alert('Erreur lors du chargement des clients');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchClients();
   }, []);

  const filtered = clients.filter(c => {
    const s = q.toLowerCase().trim();
    if (!s) return true;
    return (
      (c.clientId || '').toLowerCase().includes(s) ||
      (c.firstName || '').toLowerCase().includes(s) ||
      (c.lastName || '').toLowerCase().includes(s) ||
      (c.email || '').toLowerCase().includes(s)
    );
  });

  const filteredIds = filtered.map(c => c._id);
  const allSelected = filteredIds.length > 0 && filteredIds.every(id => selectedIds.has(id));

  const toggleAll = () => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (allSelected) filteredIds.forEach(id => next.delete(id));
      else filteredIds.forEach(id => next.add(id));
      return next;
    });
  };

  const toggleOne = (id) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const openEdit = (c) => {
    setEditing(c);
    setForm({
      firstName: c.firstName || '',
      lastName:  c.lastName  || '',
      sex:       c.sex       || '',
      email:     c.email     || ''
    });
  };

  const saveEdit = async (e) => {
    e.preventDefault();
    if (!form.firstName.trim() || !form.lastName.trim() || !form.email.trim()) {
      alert('Prénom, nom et email sont requis');
      return;
    }
    if (form.sex && !['H', 'F', 'other'].includes(form.sex)) {
      alert('Sexe invalide (H, F ou other)');
      return;
    }
    try {
      const { data } = await apiAdmin.put(
        `/api/admin/clients/${editing._id}`,
        {
          firstName: form.firstName.trim(),
          lastName:  form.lastName.trim(),
          sex:       form.sex,
          email:     form.email.trim()
        },
        { headers }
      );
      setClients(prev => prev.map(c => (c._id === editing._id ? data : c)));
      setEditing(null);
    } catch (e2) {
      console.error('[PUT client] error', e2?.response?.data || e2);
      alert(e2?.response?.data?.message || 'Mise à jour impossible');
    }
  };

  const removeClient = async (id) => {
    if (!window.confirm('Supprimer ce client ?')) return;
    try {
      await apiAdmin.delete(`/admin/clients/${id}`, { headers });
      setClients(prev => prev.filter(c => c._id !== id));
      setSelectedIds(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    } catch (e) {
      console.error('[DELETE client] error', e?.response?.data || e);
      alert('Suppression impossible');
    }
  };

  const removeSelected = async () => {
    if (selectedIds.size === 0) return;
    if (!window.confirm(`Supprimer ${selectedIds.size} client(s) sélectionné(s) ?`)) return;
    try {
      for (const id of selectedIds) {
        await apiAdmin.delete(`/admin/clients/${id}`, { headers });
      }
      setClients(prev => prev.filter(c => !selectedIds.has(c._id)));
      setSelectedIds(new Set());
    } catch (e) {
      console.error('[BULK DELETE clients] error', e?.response?.data || e);
      alert('Suppression groupée interrompue (voir console).');
      fetchClients();
    }
  };

  return (
    <div className="admin-page">
      {/* Barre d’actions */}
      <div className="admin-actions">
        <input
          className="admin-input"
          placeholder="Rechercher (ID, nom, email)"
          value={q}
          onChange={e => setQ(e.target.value)}
        />
        <button
          className={`btn-danger ${selectedIds.size ? '' : 'is-disabled'}`}
          disabled={selectedIds.size === 0}
          onClick={removeSelected}
          title={selectedIds.size ? `Supprimer ${selectedIds.size} sélection(s)` : 'Sélectionnez des clients'}
        >
          Supprimer la sélection
        </button>
      </div>

      {loading ? (
        <div>Chargement…</div>
      ) : (
        <div className="overflow-x">
          <table className="admin-table">
            <thead>
              <tr>
                <th className="admin-cell">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleAll}
                    aria-label="Tout sélectionner"
                  />
                </th>
                <th className="admin-cell">ID client</th>
                <th className="admin-cell">Nom</th>
                <th className="admin-cell">Email</th>
                <th className="admin-cell">Sexe</th>
                <th className="admin-cell">Créé le</th>
                <th className="admin-cell">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => {
                const checked = selectedIds.has(c._id);
                return (
                  <tr key={c._id}>
                    <td className="admin-cell">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleOne(c._id)}
                        aria-label={`Sélectionner ${c.firstName} ${c.lastName}`}
                      />
                    </td>
                    <td className="admin-cell">{c.clientId || '-'}</td>
                    <td className="admin-cell">{`${c.firstName || ''} ${c.lastName || ''}`.trim()}</td>
                    <td className="admin-cell">{c.email}</td>
                    <td className="admin-cell">{c.sex || '-'}</td>
                    <td className="admin-cell">{new Date(c.createdAt).toLocaleString()}</td>
                    <td className="admin-cell">
                      <button className="btn-ghost" onClick={() => openEdit(c)}>Éditer</button>
                      <button className="btn-danger" onClick={() => removeClient(c._id)}>Supprimer</button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td className="admin-cell" colSpan={7}>Aucun client</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modale édition client */}
      {editing && (
        <div className="backdrop" onClick={() => setEditing(null)}>
          <div className="card" onClick={e => e.stopPropagation()}>
            <h3 className="mt0">Éditer {editing.firstName} {editing.lastName}</h3>

            <div className="grid-gap-8">
              <label>Client ID</label>
              <div className="readonly-field">
                <span>{editing.clientId || '-'}</span>
              </div>
            </div>

            <form onSubmit={saveEdit} className="modal-form">
              <div>
                <label>Prénom</label>
                <input
                  className="admin-input"
                  value={form.firstName}
                  onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))}
                  required
                />
              </div>

              <div>
                <label>Nom</label>
                <input
                  className="admin-input"
                  value={form.lastName}
                  onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))}
                  required
                />
              </div>

              <div>
                <label>Sexe</label>
                <select
                  className="admin-input"
                  value={form.sex}
                  onChange={e => setForm(f => ({ ...f, sex: e.target.value }))}
                >
                  <option value="">— Non précisé —</option>
                  <option value="H">Homme</option>
                  <option value="F">Femme</option>
                  <option value="other">Autres</option>
                </select>
              </div>

              <div>
                <label>Email</label>
                <input
                  className="admin-input"
                  type="email"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  required
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-ghost" onClick={() => setEditing(null)}>Annuler</button>
                <button type="submit" className="btn-primary">Enregistrer</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
