import { useEffect, useState } from 'react';
import api from '../../services/api.js';
import apiAdmin from '../../services/apiAdmin.js';

const EMPTY = { name: '', nameMg: '', description: '', image: '', order: 0, parent: '' };

export default function AdminCategories() {
  const [cats, setCats] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState('');

  const load = async () => { try { const { data } = await api.get('/public/categories'); setCats(data || []); } catch { setCats([]); } };
  useEffect(() => { load(); }, []);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const resetForm = () => { setForm(EMPTY); setEditId(null); setErr(''); };

  const onFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true); setErr('');
    try {
      const fd = new FormData();
      fd.append('image', file);
      const { data } = await apiAdmin.post('/admin/uploads', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setForm((f) => ({ ...f, image: data.url || data.id }));
    } catch { setErr("Échec de l'upload de l'image."); }
    finally { setUploading(false); }
  };

  const submit = async (e) => {
    e.preventDefault(); setErr('');
    const payload = { ...form, order: Number(form.order) || 0, parent: form.parent || null };
    try {
      if (editId) await apiAdmin.put(`/admin/categories/${editId}`, payload);
      else await apiAdmin.post('/admin/categories', payload);
      resetForm(); load();
    } catch (e2) { setErr(e2?.response?.data?.message || 'Erreur.'); }
  };

  const edit = (c) => {
    setEditId(c._id);
    setForm({
      name: c.name || '', nameMg: c.nameMg || '', description: c.description || '',
      image: c.image || '', order: c.order || 0, parent: c.parent?._id || c.parent || '',
    });
    window.scrollTo(0, 0);
  };

  const remove = async (cid) => {
    if (!window.confirm('Supprimer ?')) return;
    try { await apiAdmin.delete(`/admin/categories/${cid}`); if (editId === cid) resetForm(); load(); } catch { /* ignore */ }
  };

  return (
    <>
      <div className="admin-head"><h1>Catégories</h1></div>
      {err && <p className="alert err">{err}</p>}

      <form className="form-card" onSubmit={submit} style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ marginTop: 0 }}>{editId ? 'Modifier la catégorie' : 'Nouvelle catégorie'}</h3>
        <div className="form-row">
          <div className="field"><label>Nom (français)</label><input value={form.name} onChange={set('name')} required placeholder="Ex. Plats" /></div>
          <div className="field"><label>Nom (malgache)</label><input value={form.nameMg} onChange={set('nameMg')} placeholder="Ex. Sakafo" /></div>
        </div>
        <div className="form-row">
          <div className="field"><label>Ordre d'affichage</label><input type="number" value={form.order} onChange={set('order')} /></div>
          <div className="field"><label>Catégorie parente (arborescence)</label>
            <select value={form.parent} onChange={set('parent')}>
              <option value="">— Racine —</option>
              {cats.filter((c) => c._id !== editId).map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </div>
        </div>
        <div className="field">
          <label>Texte SEO / présentation (affiché en haut de la page catégorie)</label>
          <textarea rows="4" value={form.description} onChange={set('description')} placeholder="Quelques phrases décrivant la catégorie…" />
        </div>
        <div className="field">
          <label>Image représentative</label>
          {form.image && <img src={form.image} alt="" style={{ display: 'block', maxWidth: 220, borderRadius: 8, margin: '0 0 .5rem' }} />}
          <input type="file" accept="image/*" onChange={onFile} disabled={uploading} />
          {uploading && <span className="form-hint">Upload en cours…</span>}
          {form.image && <button type="button" className="admin-btn danger" style={{ marginTop: '.5rem' }} onClick={() => setForm((f) => ({ ...f, image: '' }))}>Retirer l'image</button>}
        </div>
        <div style={{ display: 'flex', gap: '.6rem' }}>
          <button className="btn-primary">{editId ? 'Enregistrer' : 'Ajouter'}</button>
          {editId && <button type="button" className="btn-outline" onClick={resetForm}>Annuler</button>}
        </div>
      </form>

      <table className="admin-table">
        <thead><tr><th>Nom</th><th>MG</th><th>Parent</th><th>Slug</th><th>Image</th><th></th></tr></thead>
        <tbody>
          {cats.map((c) => (
            <tr key={c._id}>
              <td>{c.parent ? '› ' : ''}{c.name}</td>
              <td>{c.nameMg || '—'}</td>
              <td>{c.parent?.name || '—'}</td>
              <td>{c.slug}</td>
              <td>{c.image ? <img src={c.image} alt="" style={{ width: 48, height: 36, objectFit: 'cover', borderRadius: 4 }} /> : '—'}</td>
              <td style={{ whiteSpace: 'nowrap' }}>
                <button className="admin-btn" onClick={() => edit(c)}>Modifier</button>{' '}
                <button className="admin-btn danger" onClick={() => remove(c._id)}>Suppr.</button>
              </td>
            </tr>
          ))}
          {cats.length === 0 && <tr><td colSpan="6" style={{ color: 'var(--color-text-muted)' }}>Aucune catégorie.</td></tr>}
        </tbody>
      </table>
    </>
  );
}
