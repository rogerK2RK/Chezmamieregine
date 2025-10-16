import { useEffect, useState, useCallback } from 'react';
import apiAdmin from '../../../services/apiAdmin';
import authHeaderAdmin from '../../../services/authHeaderAdmin';
import './style.css';

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
    <main className="admin-page">
      <h1 className="title-spacing">Utilisateurs (back-office)</h1>

      {/* Barre d'action */}
      <div className="toolbar">
        <input
          className="input"
          placeholder="Rechercher (nom, email, rôle)"
          value={q}
          onChange={e => setQ(e.target.value)}
        />
        <button className="btn-primary-back" onClick={openModal}>
          + Nouvel utilisateur
        </button>
      </div>

      {loading ? (
        <div>Chargement…</div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th className="cell">Nom</th>
                <th className="cell">Email</th>
                <th className="cell">Rôle</th>
                <th className="cell">Créé le</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u?._id || `${u?.email}-${u?.name}`}>
                  <td className="cell">{u?.name || '-'}</td>
                  <td className="cell">{u?.email || '-'}</td>
                  <td className="cell">{u?.role || '-'}</td>
                  <td className="cell">{u?.createdAt ? new Date(u.createdAt).toLocaleString() : '-'}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td className="cell" colSpan={4}>Aucun utilisateur</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modale création */}
      {openCreate && (
        <div className="backdrop" onClick={() => setOpenCreate(false)}>
          <div className="card" onClick={e => e.stopPropagation()}>
            <h3 className="no-top-margin">Créer un utilisateur (admin/owner)</h3>

            {errorMsg && (
              <div className="alert-err">
                {errorMsg}
              </div>
            )}

            <form onSubmit={submitCreate} className="form-grid">
              <div>
                <label>Nom *</label>
                <input
                  className="input"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  required
                />
              </div>

              <div>
                <label>Email *</label>
                <input
                  className="input"
                  type="email"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  required
                />
              </div>

              <div className="relative">
                <label>Mot de passe *</label>
                <input
                  className="input"
                  type={showPwd ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(s => !s)}
                  aria-label={showPwd ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                  className="eye-btn"
                >
                  {showPwd ? '👁️' : '🙈'}
                </button>
              </div>

              <div>
                <label>Rôle *</label>
                <select
                  className="input"
                  value={form.role}
                  onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                  required
                >
                  {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>

              <div className="actions-right">
                <button
                  type="button"
                  className="btn-ghost"
                  onClick={() => setOpenCreate(false)}
                  disabled={saving}
                >
                  Annuler
                </button>
                <button type="submit" className="btn-primary-back" disabled={saving}>
                  {saving ? 'Création…' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
