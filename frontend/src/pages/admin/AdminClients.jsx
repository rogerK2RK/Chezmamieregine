// frontend/src/pages/admin/AdminClients.jsx
import { useEffect, useMemo, useState } from 'react';
import api from '../../services/api';
import authHeaderAdmin from '../../services/authHeaderAdmin';

export default function AdminClients() {
  const [clients, setClients] = useState([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    sex: '',
    email: ''
  });

  const headers = useMemo(() => ({ ...authHeaderAdmin() }), []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/admin/clients', { headers });
      setClients(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error('[GET clients] error', e?.response?.data || e);
      alert('Erreur lors du chargement des clients');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchClients(); /* eslint-disable-next-line */ }, []);

  const filtered = clients.filter(c => {
    const s = q.toLowerCase().trim();
    if (!s) return true;
    const fullName = `${c.firstName || ''} ${c.lastName || ''}`.toLowerCase();
    return (
      (c.clientId || '').toLowerCase().includes(s) ||
      fullName.includes(s) ||
      (c.email || '').toLowerCase().includes(s)
    );
  });

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
      const { data } = await api.put(`/admin/clients/${editing._id}`, {
        firstName: form.firstName.trim(),
        lastName:  form.lastName.trim(),
        sex:       form.sex,
        email:     form.email.trim()
      }, { headers });

      setClients(prev => prev.map(c => (c._id === editing._id ? data : c)));
      setEditing(null);
    } catch (e2) {
      console.error('[PUT client] error', e2?.response?.data || e2);
      const msg = e2?.response?.data?.message || 'Mise à jour impossible';
      alert(msg);
    }
  };

  const removeClient = async (id) => {
    if (!window.confirm('Supprimer ce client ?')) return;
    try {
      await api.delete(`/admin/clients/${id}`, { headers });
      setClients(prev => prev.filter(c => c._id !== id));
    } catch (e) {
      console.error('[DELETE client] error', e?.response?.data || e);
      alert('Suppression impossible');
    }
  };

  return (
    <div className="admin-page">
      <h1 style={{ marginBottom: 12 }}>Clients</h1>

      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <input
          placeholder="Rechercher (Client ID, nom, email)"
          value={q}
          onChange={e => setQ(e.target.value)}
          style={input}
        />
      </div>

      {loading ? (
        <div>Chargement…</div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={table}>
            <thead>
              <tr>
                <th style={cell}>Client ID</th>
                <th style={cell}>Nom complet</th>
                <th style={cell}>Sexe</th>
                <th style={cell}>Email</th>
                <th style={cell}>Créé le</th>
                <th style={cell}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c._id}>
                  <td style={cell}>{c.clientId || '-'}</td>
                  <td style={cell}>{`${c.firstName || ''} ${c.lastName || ''}`.trim() || '-'}</td>
                  <td style={cell}>{c.sex || '-'}</td>
                  <td style={cell}>{c.email || '-'}</td>
                  <td style={cell}>{c.createdAt ? new Date(c.createdAt).toLocaleString() : '-'}</td>
                  <td style={cell}>
                    <button style={btnGhost} onClick={() => openEdit(c)}>Éditer</button>
                    <button style={btnDanger} onClick={() => removeClient(c._id)}>Supprimer</button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td style={cell} colSpan={6}>Aucun client</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modale édition client */}
      {editing && (
        <div style={backdrop} onClick={() => setEditing(null)}>
          <div style={card} onClick={e => e.stopPropagation()}>
            <h3 style={{ marginTop: 0 }}>
              Éditer {editing.firstName} {editing.lastName}
            </h3>

            {/* Client ID en lecture seule */}
            <div style={{ display: 'grid', gap: 8, marginBottom: 8 }}>
              <label>Client ID</label>
              <div style={readonlyField}>
                <span>{editing.clientId || '-'}</span>
              </div>
            </div>

            <form onSubmit={saveEdit} style={{ display: 'grid', gap: 12 }}>
              <div>
                <label>Prénom</label>
                <input
                  style={input}
                  value={form.firstName}
                  onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))}
                  required
                />
              </div>

              <div>
                <label>Nom</label>
                <input
                  style={input}
                  value={form.lastName}
                  onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))}
                  required
                />
              </div>

              <div>
                <label>Sexe</label>
                <select
                  style={input}
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
                  style={input}
                  type="email"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <button type="button" style={btnGhost} onClick={() => setEditing(null)}>Annuler</button>
                <button type="submit" style={btnPrimary}>Enregistrer</button>
              </div>
            </form>
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
  minWidth: 240 
};

const readonlyField = { 
  padding: '10px 12px', 
  borderRadius: 8, 
  border: '1px dashed rgba(255,255,255,0.18)', 
  background: 'rgba(255,255,255,0.04)', 
  color: '#ddd' 
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
  cursor: 'pointer', marginRight: 6 
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
