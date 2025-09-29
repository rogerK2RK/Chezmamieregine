import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';
import authHeaderAdmin from '../../services/authHeaderAdmin';

export default function AdminPlatForm() {
  const { id } = useParams(); // si présent = édition
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const headers = authHeaderAdmin();

  const [form, setForm] = useState({
    ar: '',
    name: '',
    price: '',
    category: '',
    description: '',
    isAvailable: true,
    imageUrls: ''
  });

  const [loading, setLoading] = useState(isEdit);

  // Charger le plat si édition
  useEffect(() => {
    if (!isEdit) return;
    (async () => {
      try {
        const { data } = await api.get(`/plats/${id}`, { headers });
        console.log('[PUT ok]', data);
        setForm({
          ar: data.ar || '',
          name: data.name || '',
          price: data.price || '',
          category: data.category || '',
          description: data.description || '',
          isAvailable: data.isAvailable ?? true,
          imageUrls: (data.images || []).join(', ')
        });
      } catch (e) {
        alert("Erreur lors du chargement du plat");
        navigate('/admin/plats');
      } finally {
        setLoading(false);
      }
    })();
  }, [id, isEdit, headers, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ar: form.ar.trim(),
      name: form.name.trim(),
      price: Number(form.price),
      category: form.category.trim(),
      description: form.description.trim(),
      isAvailable: !!form.isAvailable,
      images: form.imageUrls.split(',').map(s => s.trim()).filter(Boolean)
    };

    if (!payload.ar) { alert('AR requise'); return; }
    if (!payload.name || !Number.isFinite(payload.price)) {
      alert('Nom et prix valides requis'); return;
    }

    try {
      const headers = authHeaderAdmin();
      console.log('[PUT payload]', payload, headers);

      if (isEdit) {
        await api.put(`/plats/${id}`, payload, { headers });
      } else {
        await api.post('/plats', payload, { headers });
      }
      navigate('/admin/plats');
    } catch (e) {
      console.error('[SAVE plat] error', e);
      alert('Enregistrement impossible');
    }
  };

  if (loading) return <div>Chargement…</div>;

  return (
    <div className="admin-page">
      <h1>{isEdit ? 'Éditer le plat' : 'Nouveau plat'}</h1>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 14, maxWidth: 600 }}>
        <div>
          <label>Référence (AR) *</label>
          <input
            value={form.ar}
            onChange={e => setForm(f => ({ ...f, ar: e.target.value }))}
            style={input}
            required
          />
        </div>
        <div>
          <label>Nom *</label>
          <input
            value={form.name}
            onChange={e => {
              console.log('[change name]', e.target.value);
              setForm(f => ({ ...f, name: e.target.value }))
            }}
            style={input}
            required
          />
        </div>
        <div>
          <label>Prix (€)</label>
          <input
            type="number"
            step="0.01"
            value={form.price}
            onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
            style={input}
            required
          />
        </div>
        <div>
          <label>Catégorie</label>
          <input
            value={form.category}
            onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
            style={input}
          />
        </div>
        <div>
          <label>Description</label>
          <textarea
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            style={{ ...input, minHeight: 90 }}
          />
        </div>
        <div>
          <label>Images (URLs séparées par des virgules)</label>
          <input
            value={form.imageUrls}
            onChange={e => setForm(f => ({ ...f, imageUrls: e.target.value }))}
            style={input}
          />
        </div>
        <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input
            type="checkbox"
            checked={form.isAvailable}
            onChange={e => setForm(f => ({ ...f, isAvailable: e.target.checked }))}
          />
          Disponible à la commande
        </label>

        <div style={{ display: 'flex', gap: 10 }}>
          <button type="submit" style={btnPrimary}>{isEdit ? 'Enregistrer' : 'Créer'}</button>
          <button type="button" onClick={() => navigate('/admin/plats')} style={btnGhost}>Annuler</button>
        </div>
      </form>
    </div>
  );
}

const input = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: 8,
  border: '1px solid rgba(255,255,255,0.18)',
  background: 'rgba(255,255,255,0.06)',
  color: '#fff'
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
  padding: '10px 14px',
  borderRadius: 10,
  cursor: 'pointer'
};
