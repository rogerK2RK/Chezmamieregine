import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import apiAdmin from '../../../services/apiAdmin';
import authHeaderAdmin from '../../../services/authHeaderAdmin';
import AdminImageUploader from '../../../components/admin/AdminImageUploader';
import './style.css';

export default function AdminPlatForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  // Headers
  const headers = useMemo(() => ({ ...authHeaderAdmin() }), []);

  // Guards (évite doubles appels en dev/StrictMode)
  const didFetchCategories = useRef(false);
  const didFetchPlat = useRef(false);

  // Form principal (sans images)
  const [form, setForm] = useState({
    ar: '',
    name: '',
    price: '',
    category: '',
    description: '',
    isAvailable: true,
  });

  // Images stockées comme tableau d’URL(s)
  const [images, setImages] = useState([]);

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(isEdit);

  // 1) Charger les catégories (une seule fois)
  useEffect(() => {
    if (didFetchCategories.current) return;
    didFetchCategories.current = true;

    (async () => {
      try {
        const { data } = await apiAdmin.get('/categories', { headers });
        setCategories(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error('[GET /categories]', e?.response?.status, e?.response?.data || e);
        setCategories([]);
      }
    })();
  }, [headers]);

  // 2) Charger le plat si édition (une seule fois)
  useEffect(() => {
    if (!isEdit || didFetchPlat.current) return;
    didFetchPlat.current = true;

    (async () => {
      try {
        const { data } = await apiAdmin.get(`/plats/${id}`, { headers });
        setForm({
          ar: data?.ar || '',
          name: data?.name || '',
          price: data?.price ?? '', // on reconvertira en nombre au submit
          category:
            typeof data?.category === 'string'
              ? data.category
              : (data?.category?._id || ''),
          description: data?.description || '',
          isAvailable: data?.isAvailable ?? true,
        });
        setImages(Array.isArray(data?.images) ? data.images : []);
      } catch (e) {
        console.error('[GET /plats/:id]', e?.response?.status, e?.response?.data || e);
        alert('Erreur lors du chargement du plat');
        navigate('/admin/plats', { replace: true });
      } finally {
        setLoading(false);
      }
    })();
  }, [isEdit, id, headers, navigate]);

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const priceNum = parseFloat(String(form.price).replace(',', '.'));
    const payload = {
      ar: String(form.ar || '').trim(),
      name: String(form.name || '').trim(),
      price: Number.isFinite(priceNum) ? priceNum : NaN,
      ...(form.category ? { category: form.category } : {}),
      description: String(form.description || '').trim(),
      isAvailable: !!form.isAvailable,
      images: Array.isArray(images)
        ? images.map((s) => String(s).trim()).filter(Boolean)
        : [],
    };

    if (!payload.ar) { alert('Référence (AR) requise'); return; }
    if (!payload.name) { alert('Nom requis'); return; }
    if (!Number.isFinite(payload.price)) { alert('Prix invalide'); return; }
    if (payload.price < 0) { alert('Le prix doit être positif'); return; }

    try {
      if (isEdit) {
        await apiAdmin.put(`/plats/${id}`, payload, { headers });
      } else {
        await apiAdmin.post('/plats', payload, { headers });
      }
      navigate('/admin/plats');
    } catch (e2) {
      const msg =
        e2?.response?.data?.message ||
        e2?.response?.data?.details ||
        'Enregistrement impossible';
      alert(msg);
      console.error('[SAVE plat]', e2?.response?.status, e2?.response?.data || e2);
    }
  };

  if (loading) return <div>Chargement…</div>;

  return (
    <div className="admin-page">
      <h1>{isEdit ? 'Éditer le plat' : 'Nouveau plat'}</h1>

      <form onSubmit={handleSubmit} className="form-grid">
        <div>
          <label>Référence (AR) *</label>
          <input
            className="input"
            value={form.ar}
            onChange={e => setForm(f => ({ ...f, ar: e.target.value }))}
            required
          />
        </div>

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
          <label>Prix (€) *</label>
          <input
            className="input"
            type="number"
            inputMode="decimal"
            step="0.01"
            min="0"
            value={String(form.price ?? '')}
            onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
            required
          />
        </div>

        <div>
          <label>Catégorie</label>
          <select
            className="input"
            value={form.category}
            onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
          >
            <option value="">— Aucune —</option>
            {categories.map(c => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label>Description</label>
          <textarea
            className="input textarea"
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
          />
        </div>

        <div>
          <label>Images</label>
          {/* Drag & Drop + import — renvoie une liste d’URLs */}
          <AdminImageUploader value={images} onChange={setImages} />
        </div>

        <label className="inline-check">
          <input
            type="checkbox"
            checked={!!form.isAvailable}
            onChange={e => setForm(f => ({ ...f, isAvailable: e.target.checked }))}
          />
          Disponible à la commande
        </label>

        <div className="row-actions">
          <button type="submit" className="btn-primary-back">
            {isEdit ? 'Enregistrer' : 'Créer'}
          </button>
          <button type="button" onClick={() => navigate('/admin/plats')} className="btn-ghost">
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
}
