// frontend/src/pages/admin/AdminUsers.jsx
import { useEffect, useState, useCallback } from 'react';
import apiAdmin from '../../services/apiAdmin';          // ✅ utilise l'API admin
import authHeaderAdmin from '../../services/authHeaderAdmin';

const ROLES = ['admin', 'owner'];

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);

  // Modale création
  const [openCreate, setOpenCreate] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'admin' });

  const getHeaders = () => ({ headers: authHeaderAdmin() || {} });

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      // ✅ bon endpoint
      const { data } = await apiAdmin.get('/admin/users', getHeaders());
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('[GET /admin/users] error', err?.response?.data || err);
      alert("Impossible de charger les utilisateurs");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  // Fermer la modale avec Echap
  useEffect(() => {
    if (!openCreate) return;
    const onKey = (e) => { if (e.key === 'Escape') setOpenCreate(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [openCreate]);

  const filtered = users.filter(u => {
    const s = q.toLowerCase().trim();
    if (!s) return true;
    return (
      (u?.name || '').toLowerCase().includes(s) ||
      (u?.email || '').toLowerCase().includes(s) ||
      (u?.role || '').toLowerCase().includes(s)
    );
  });

  const openModal = () => {
    setForm({ name: '', email: '', password: '', role: 'admin' });
    setShowPwd(false);
    setErrorMsg('');
    setOpenCreate(true);
  };

  const submitCreate = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    const name = form.name.trim();
    const email = form.email.trim();
    const password = form.password;

    if (!name || !email || !password) {
      setErrorMsg('Nom, email et mot de passe sont requis.');
      return;
    }

    try {
      setSaving(true);
      const body = { name, email, password, role: form.role };
      // ✅ bon endpoint
      const { data } = await apiAdmin.post('/admin/create-user', body, getHeaders());

      const normalized = { createdAt: new Date().toISOString(), ...data };
      setUsers(prev => [normalized, ...prev]);

      setOpenCreate(false);
      setForm({ name: '', email: '', password: '', role: 'admin' });
      setShowPwd(false);
    } catch (err) {
      const msg = err?.response?.data?.message || 'Création impossible';
      setErrorMsg(msg);
      console.error('[POST /admin/create-user] error', err?.response?.data || err);
    } finally {
      setSaving(false);
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
          style={inputStyle}
        />
        <button style={btnPrimary} onClick={openModal}>
          + Nouvel utilisateur
        </button>
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
                <tr key={u?._id || `${u?.email}-${u?.name}`}>
                  <td style={cell}>{u?.name || '-'}</td>
                  <td style={cell}>{u?.email || '-'}</td>
                  <td style={cell}>{u?.role || '-'}</td>
                  <td style={cell}>{u?.createdAt ? new Date(u.createdAt).toLocaleString() : '-'}</td>
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

            {errorMsg && (
              <div style={alertErr}>
                {errorMsg}
              </div>
            )}

            <form onSubmit={submitCreate} style={{ display: 'grid', gap: 12, maxWidth: 560 }}>
              <div>
                <label>Nom *</label>
                <input
                  style={inputStyle}
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  required
                />
              </div>

              <div>
                <label>Email *</label>
                <input
                  style={inputStyle}
                  type="email"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  required
                />
              </div>

              <div style={{ position: 'relative' }}>
                <label>Mot de passe *</label>
                <input
                  style={inputStyle}
                  type={showPwd ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(s => !s)}
                  aria-label={showPwd ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                  style={eyeBtn}
                >
                  {showPwd ? '👁️' : '🙈'}
                </button>
              </div>

              <div>
                <label>Rôle *</label>
                <select
                  style={inputStyle}
                  value={form.role}
                  onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                  required
                >
                  {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>

              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  style={btnGhost}
                  onClick={() => setOpenCreate(false)}
                  disabled={saving}
                >
                  Annuler
                </button>
                <button type="submit" style={btnPrimary} disabled={saving}>
                  {saving ? 'Création…' : 'Créer'}
                </button>
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
const inputStyle = {
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
const alertErr = {
  background: 'rgba(239,68,68,0.15)',
  color: '#fecaca',
  border: '1px solid rgba(239,68,68,0.35)',
  borderRadius: 10,
  padding: '10px 12px',
  marginBottom: 6
};
const eyeBtn = {
  position: 'absolute',
  right: 10,
  top: 34,
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
  fontSize: 18,
  lineHeight: 1
};
