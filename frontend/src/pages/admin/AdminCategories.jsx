import { useEffect, useState } from 'react';
import api from '../../services/api.js';
import apiAdmin from '../../services/apiAdmin.js';

export default function AdminCategories() {
  const [cats, setCats] = useState([]);
  const [name, setName] = useState('');
  const [parent, setParent] = useState('');
  const [err, setErr] = useState('');

  const load = async () => { try { const { data } = await api.get('/public/categories'); setCats(data || []); } catch { setCats([]); } };
  useEffect(() => { load(); }, []);

  const add = async (e) => {
    e.preventDefault(); setErr('');
    try { await apiAdmin.post('/admin/categories', { name, parent: parent || null }); setName(''); setParent(''); load(); }
    catch (e2) { setErr(e2?.response?.data?.message || 'Erreur.'); }
  };
  const remove = async (cid) => {
    if (!window.confirm('Supprimer ?')) return;
    try { await apiAdmin.delete(`/admin/categories/${cid}`); load(); } catch { /* ignore */ }
  };

  return (
    <>
      <div className="admin-head"><h1>Catégories</h1></div>
      {err && <p className="alert err">{err}</p>}
      <form className="form-card" onSubmit={add} style={{ marginBottom: '1.5rem' }}>
        <div className="form-row">
          <div className="field"><label>Nom de la catégorie</label><input value={name} onChange={(e) => setName(e.target.value)} required /></div>
          <div className="field"><label>Catégorie parente (arborescence)</label>
            <select value={parent} onChange={(e) => setParent(e.target.value)}>
              <option value="">— Racine —</option>
              {cats.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </div>
        </div>
        <button className="btn-primary">Ajouter</button>
      </form>

      <table className="admin-table">
        <thead><tr><th>Nom</th><th>Parent</th><th>Slug</th><th></th></tr></thead>
        <tbody>
          {cats.map((c) => (
            <tr key={c._id}>
              <td>{c.parent ? '› ' : ''}{c.name}</td>
              <td>{c.parent?.name || '—'}</td>
              <td>{c.slug}</td>
              <td><button className="admin-btn danger" onClick={() => remove(c._id)}>Suppr.</button></td>
            </tr>
          ))}
          {cats.length === 0 && <tr><td colSpan="4" style={{ color: 'var(--color-text-muted)' }}>Aucune catégorie.</td></tr>}
        </tbody>
      </table>
    </>
  );
}
