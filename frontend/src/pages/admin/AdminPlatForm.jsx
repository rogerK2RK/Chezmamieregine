import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api.js';
import apiAdmin from '../../services/apiAdmin.js';

const empty = {
  name: '', nameAccent: '', price: '', description: '', badges: '',
  images: [], category: '', categories: [], sideDishes: [],
  isPack: false, packItems: [], allergenes: '',
};

export default function AdminPlatForm() {
  const { id } = useParams();
  const editing = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState(empty);
  const [cats, setCats] = useState([]);
  const [plats, setPlats] = useState([]);
  const [err, setErr] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    (async () => { try { const { data } = await api.get('/public/categories'); setCats(data || []); } catch { /* ignore */ } })();
    (async () => { try { const { data } = await api.get('/public/plats'); setPlats(data || []); } catch { /* ignore */ } })();
    if (editing) {
      (async () => {
        try {
          const { data } = await api.get(`/public/plats/${id}`);
          setForm({
            name: data.name || '', nameAccent: data.nameAccent || '', price: data.price ?? '',
            description: data.description || '', badges: (data.badges || []).join(', '),
            images: Array.isArray(data.images) ? data.images : [],
            category: data.category?._id || data.category || '',
            categories: (data.categories || []).map((c) => c._id || c),
            sideDishes: (data.sideDishes || []).map((s) => s.name).filter(Boolean),
            isPack: !!data.isPack,
            packItems: (data.packItems || []).map((p) => ({ plat: p.plat?._id || p.plat || '', qty: p.qty || 1 })),
            allergenes: data.allergenes || '',
          });
        } catch { setErr('Plat introuvable.'); }
      })();
    }
  }, [id, editing]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const change = (e) => set(e.target.name, e.target.value);

  // ---- Images (multi-upload) ----
  const onFiles = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true); setErr('');
    try {
      const urls = [];
      for (const file of files) {
        const fd = new FormData();
        fd.append('image', file);
        const { data } = await apiAdmin.post('/admin/uploads', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        urls.push(data.url);
      }
      setForm((f) => ({ ...f, images: [...f.images, ...urls] }));
    } catch { setErr("Échec de l'upload d'une image."); }
    finally { setUploading(false); e.target.value = ''; }
  };
  const removeImage = (i) => setForm((f) => ({ ...f, images: f.images.filter((_, idx) => idx !== i) }));
  const makeMainImage = (i) => setForm((f) => { const a = [...f.images]; const [x] = a.splice(i, 1); return { ...f, images: [x, ...a] }; });

  // ---- Catégories ----
  const toggleCat = (cid) => setForm((f) => {
    const has = f.categories.includes(cid);
    const categories = has ? f.categories.filter((c) => c !== cid) : [...f.categories, cid];
    let category = f.category;
    if (has && category === cid) category = '';
    if (!has && !category) category = cid; // 1ère cochée = principale par défaut
    return { ...f, categories, category };
  });

  // ---- Accompagnements ----
  const addSide = () => set('sideDishes', [...form.sideDishes, '']);
  const changeSide = (i, v) => set('sideDishes', form.sideDishes.map((s, idx) => (idx === i ? v : s)));
  const removeSide = (i) => set('sideDishes', form.sideDishes.filter((_, idx) => idx !== i));

  // ---- Pack ----
  const addPackItem = () => set('packItems', [...form.packItems, { plat: '', qty: 1 }]);
  const changePackItem = (i, k, v) => set('packItems', form.packItems.map((p, idx) => (idx === i ? { ...p, [k]: v } : p)));
  const removePackItem = (i) => set('packItems', form.packItems.filter((_, idx) => idx !== i));

  const submit = async (e) => {
    e.preventDefault(); setErr('');
    const payload = {
      name: form.name, nameAccent: form.nameAccent, price: Number(form.price) || 0,
      description: form.description, allergenes: form.allergenes,
      images: form.images,
      category: form.category || undefined,
      categories: form.categories,
      badges: form.badges ? form.badges.split(',').map((s) => s.trim()).filter(Boolean) : [],
      sideDishes: form.sideDishes.map((n) => n.trim()).filter(Boolean).map((name) => ({ name })),
      isPack: form.isPack,
      packItems: form.isPack ? form.packItems.filter((p) => p.plat).map((p) => ({ plat: p.plat, qty: Number(p.qty) || 1 })) : [],
    };
    try {
      if (editing) await apiAdmin.put(`/admin/plats/${id}`, payload);
      else await apiAdmin.post('/admin/plats', payload);
      navigate('/admin/plats');
    } catch (e2) { setErr(e2?.response?.data?.message || 'Erreur.'); }
  };

  return (
    <>
      <div className="admin-head"><h1>{editing ? 'Éditer le plat' : 'Nouveau plat'}</h1></div>
      <form className="form-card" onSubmit={submit}>
        {err && <p className="alert err">{err}</p>}

        {/* Infos */}
        <h3 className="form-section-title">Informations</h3>
        <div className="form-row">
          <div className="field"><label>Nom</label><input name="name" value={form.name} onChange={change} required /></div>
          <div className="field"><label>Accent (mot orange)</label><input name="nameAccent" value={form.nameAccent} onChange={change} /></div>
        </div>
        <div className="form-row">
          <div className="field"><label>Prix (€)</label><input type="number" step="0.01" name="price" value={form.price} onChange={change} /></div>
          <div className="field"><label>Badges (virgules)</label><input name="badges" value={form.badges} onChange={change} placeholder="Fait maison, Lait de coco" /></div>
        </div>
        <div className="field"><label>Description</label><textarea name="description" value={form.description} onChange={change} /></div>
        <div className="field"><label>Allergènes</label><input name="allergenes" value={form.allergenes} onChange={change} /></div>

        {/* Images */}
        <h3 className="form-section-title">Images</h3>
        <div className="img-grid">
          {form.images.map((src, i) => (
            <div className="img-thumb" key={src + i}>
              <img src={src} alt="" />
              {i === 0 && <span className="img-main">Principale</span>}
              <div className="img-thumb-actions">
                {i !== 0 && <button type="button" onClick={() => makeMainImage(i)} title="Définir principale">★</button>}
                <button type="button" onClick={() => removeImage(i)} title="Supprimer">✕</button>
              </div>
            </div>
          ))}
        </div>
        <input type="file" accept="image/*" multiple onChange={onFiles} disabled={uploading} />
        {uploading && <span className="form-hint">Upload en cours…</span>}

        {/* Catégories */}
        <h3 className="form-section-title">Catégories</h3>
        <div className="chk-list">
          {cats.map((c) => (
            <label className="chk" key={c._id}>
              <input type="checkbox" checked={form.categories.includes(c._id)} onChange={() => toggleCat(c._id)} />
              {c.parent ? `${c.parent.name} › ` : ''}{c.name}
            </label>
          ))}
          {cats.length === 0 && <span className="form-hint">Aucune catégorie. Créez-en d'abord.</span>}
        </div>
        <div className="field" style={{ maxWidth: 320, marginTop: '.8rem' }}>
          <label>Catégorie principale (arborescence)</label>
          <select value={form.category} onChange={(e) => set('category', e.target.value)}>
            <option value="">— Choisir —</option>
            {cats.filter((c) => form.categories.includes(c._id)).map((c) => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Accompagnements */}
        <h3 className="form-section-title">Accompagnements</h3>
        {form.sideDishes.map((s, i) => (
          <div className="repeat-row" key={i}>
            <input value={s} onChange={(e) => changeSide(i, e.target.value)} placeholder="Riz blanc, Achards…" />
            <button type="button" className="admin-btn danger" onClick={() => removeSide(i)}>✕</button>
          </div>
        ))}
        <button type="button" className="admin-btn" onClick={addSide}>+ Ajouter un accompagnement</button>

        {/* Pack / menu */}
        <h3 className="form-section-title">Menu / Pack</h3>
        <label className="chk"><input type="checkbox" checked={form.isPack} onChange={(e) => set('isPack', e.target.checked)} /> Ce produit est un menu (pack de plusieurs produits)</label>
        {form.isPack && (
          <div style={{ marginTop: '.8rem' }}>
            {form.packItems.map((it, i) => (
              <div className="repeat-row" key={i}>
                <select value={it.plat} onChange={(e) => changePackItem(i, 'plat', e.target.value)}>
                  <option value="">— Produit —</option>
                  {plats.filter((pp) => pp._id !== id).map((pp) => <option key={pp._id} value={pp._id}>{pp.name}</option>)}
                </select>
                <input type="number" min="1" value={it.qty} onChange={(e) => changePackItem(i, 'qty', e.target.value)} style={{ width: 80 }} />
                <button type="button" className="admin-btn danger" onClick={() => removePackItem(i)}>✕</button>
              </div>
            ))}
            <button type="button" className="admin-btn" onClick={addPackItem}>+ Ajouter un produit au menu</button>
          </div>
        )}

        <div style={{ marginTop: '2rem' }}>
          <button className="btn-primary">{editing ? 'Enregistrer' : 'Créer'}</button>
        </div>
      </form>
    </>
  );
}
