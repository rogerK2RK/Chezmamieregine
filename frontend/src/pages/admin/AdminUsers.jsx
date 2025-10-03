import { useEffect, useMemo, useState } from 'react';
import api from '../../services/api';
import authHeaderAdmin from '../../services/authHeaderAdmin';

const ROLES = ['admin', 'owner']; // (création via /api/admin/create-user)

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);

  // Modale création
  const [openCreate, setOpenCreate] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'admin' });

  // ✅ Utilise le token ADMIN (via helper)
  const headers = useMemo(() => ({ ...authHeaderAdmin() }), []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/admin/users', { headers }); // GET /api/admin/users (cf. back plus bas)
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Erreur lors du chargement des utilisateurs', err?.response?.data || err);
      alert("Impossible de charger les utilisateurs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); /* eslint-disable-next-line */ }, []);

  const filtered = users.filter(u => {
    const s = q.toLowerCase().trim();
    if (!s) return true;
    return (
      (u.name || '').toLowerCase().includes(s) ||
      (u.email || '').toLowerCase().includes(s) ||
      (u.role || '').toLowerCase().includes(s)
    );
  });

  const submitCreate = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      alert('Nom, email et mot de passe sont requis');
      return;
    }
    try {
      const body = {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        role: form.role,
      };
      const { data } = await api.post('/admin/create-user', body, { headers }); // POST /api/admin/create-user
      setUsers(prev => [data, ...prev]);
      setOpenCreate(false);
      setForm({ name: '', email: '', password: '', role: 'admin' });
    } catch (err) {
      const msg = err?.response?.data?.message || 'Création impossible';
      alert(msg);
      console.error('[create-user] error', err?.response?.data || err);
    }
  };

  return (
    <div className="admin-page">
      <h1 style={{ marginBottom: 16 }}>Utilisateurs (back-office)</h1>

      {/* Barre d'action */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <input
          placeholder="Rechercher (nom, email, rôle)"
          value={q}
          onChange={e => setQ(e.target.value)}
          style={input}
        />
        <button style={btnPrimary} onClick={() => setOpenCreate(true)}>+ Nouvel utilisateur</button>
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
                <th style={cell}>Rôle</th>
                <th style={cell}>Créé le</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u._id}>
                  <td style={cell}>{u.name}</td>
                  <td style={cell}>{u.email}</td>
                  <td style={cell}>{u.role}</td>
                  <td style={cell}>{new Date(u.createdAt).toLocaleString()}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td style={cell} colSpan={4}>Aucun utilisateur</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modale création */}
      {openCreate && (
        <div style={backdrop} onClick={() => setOpenCreate(false)}>
          <div style={card} onClick={e => e.stopPropagation()}>
            <h3 style={{ marginTop: 0 }}>Créer un utilisateur (admin/owner)</h3>
            <form onSubmit={submitCreate} style={{ display: 'grid', gap: 12, maxWidth: 560 }}>
              <div>
                <label>Nom *</label>
                <input
                  style={input}
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label>Email *</label>
                <input
                  style={input}
                  type="email"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label>Mot de passe *</label>
                <input
                  style={input}
                  type="password"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label>Rôle *</label>
                <select
                  style={input}
                  value={form.role}
                  onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                  required
                >
                  {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>

              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <button type="button" style={btnGhost} onClick={() => setOpenCreate(false)}>Annuler</button>
                <button type="submit" style={btnPrimary}>Créer</button>
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
