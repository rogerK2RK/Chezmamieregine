import { useEffect, useMemo, useState } from 'react';
import api from '../../services/api';
import authHeaderAdmin from '../../services/authHeaderAdmin';

export default function AdminClients() {
  const [clients, setClients] = useState([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '' });

  const headers = useMemo(() => ({ ...authHeaderAdmin() }), []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/admin/clients', { headers });
      setClients(data || []);
    } catch (e) {
      console.error(e);
      alert('Erreur lors du chargement des clients');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchClients(); /* eslint-disable-next-line */ }, []);

  const filtered = clients.filter(c => {
    const s = q.toLowerCase().trim();
    if (!s) return true;
    return (
      (c.name || '').toLowerCase().includes(s) ||
      (c.email || '').toLowerCase().includes(s) ||
      (c.phone || '').toLowerCase().includes(s)
    );
  });

  const openEdit = (c) => {
    setEditing(c);
    setForm({ name: c.name || '', email: c.email || '', phone: c.phone || '' });
  };

  const saveEdit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.put(`/admin/clients/${editing._id}`, form, { headers });
      setClients(prev => prev.map(c => (c._id === editing._id ? data : c)));
      setEditing(null);
    } catch (e2) {
      console.error(e2);
      alert('Mise à jour impossible');
    }
  };

  const removeClient = async (id) => {
    if (!confirm('Supprimer ce client ?')) return;
    try {
      await api.delete(`/admin/clients/${id}`, { headers });
      setClients(prev => prev.filter(c => c._id !== id));
    } catch (e) {
      console.error(e);
      alert('Suppression impossible');
    }
  };

  return (
    <div className="admin-page">
      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <input
          placeholder="Rechercher (nom, email, téléphone)"
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
                <th style={cell}>Nom</th>
                <th style={cell}>Email</th>
                <th style={cell}>Téléphone</th>
                <th style={cell}>Créé le</th>
                <th style={cell}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c._id}>
                  <td style={cell}>{c.name}</td>
                  <td style={cell}>{c.email}</td>
                  <td style={cell}>{c.phone || '-'}</td>
                  <td style={cell}>{new Date(c.createdAt).toLocaleString()}</td>
                  <td style={cell}>
                    <button style={btnGhost} onClick={() => openEdit(c)}>Éditer</button>
                    <button style={btnDanger} onClick={() => removeClient(c._id)}>Supprimer</button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td style={cell} colSpan={5}>Aucun client</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modale édition simple */}
      {editing && (
        <div style={backdrop} onClick={() => setEditing(null)}>
          <div style={card} onClick={e => e.stopPropagation()}>
            <h3 style={{ marginTop: 0 }}>Éditer le client</h3>
            <form onSubmit={saveEdit} style={{ display: 'grid', gap: 12 }}>
              <div>
                <label>Nom</label>
                <input style={input} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div>
                <label>Email</label>
                <input style={input} value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
              </div>
              <div>
                <label>Téléphone</label>
                <input style={input} value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
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
  cursor: 'pointer',
  marginRight: 6
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
  width: 'min(640px, 92vw)',
  background: 'rgba(13,15,18, 0.98)',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: 14,
  padding: 18,
  color: '#e5e7eb'
};
