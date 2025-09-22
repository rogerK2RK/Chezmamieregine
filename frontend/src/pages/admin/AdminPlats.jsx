import { useEffect, useMemo, useState } from 'react';
import api from '../../services/api';
import authHeaderAdmin from '../../services/authHeaderAdmin';

export default function AdminPlats() {
  const [plats, setPlats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null); // null = création, sinon plat à éditer
  const [form, setForm] = useState({
    name: '',
    price: '',
    category: '',
    description: '',
    isAvailable: true,
    imageUrls: '' // champ texte séparé par virgules
  });

  const headers = useMemo(() => ({ ...authHeaderAdmin() }), []);

  const fetchPlats = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/plats', { headers }); // attend que /api/plats GET (admin/owner) renvoie la liste
      setPlats(data || []);
    } catch (e) {
      console.error(e);
      alert('Erreur lors du chargement des plats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({
      name: '',
      price: '',
      category: '',
      description: '',
      isAvailable: true,
      imageUrls: ''
    });
    setModalOpen(true);
  };

  const openEdit = (plat) => {
    setEditing(plat);
    setForm({
      name: plat.name || '',
      price: plat.price || '',
      category: plat.category || '',
      description: plat.description || '',
      isAvailable: plat.isAvailable ?? true,
      imageUrls: (plat.images || []).join(', ')
    });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ce plat ?')) return;
    try {
      await api.delete(`/plats/${id}`, { headers });
      setPlats((prev) => prev.filter((p) => p._id !== id));
    } catch (e) {
      console.error(e);
      alert('Suppression impossible');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: form.name.trim(),
      price: Number(form.price),
      category: form.category.trim(),
      description: form.description.trim(),
      isAvailable: !!form.isAvailable,
      images: form.imageUrls
        .split(',')
        .map(s => s.trim())
        .filter(Boolean)
    };

    if (!payload.name || !Number.isFinite(payload.price)) {
      alert('Nom et prix valides requis');
      return;
    }

    try {
      if (editing) {
        const { data } = await api.put(`/plats/${editing._id}`, payload, { headers });
        setPlats(prev => prev.map(p => (p._id === editing._id ? data : p)));
      } else {
        const { data } = await api.post('/plats', payload, { headers });
        setPlats(prev => [data, ...prev]);
      }
      setModalOpen(false);
      setEditing(null);
    } catch (e) {
      console.error(e);
      alert('Enregistrement impossible');
    }
  };

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return plats;
    return plats.filter(p =>
      (p.name || '').toLowerCase().includes(s) ||
      (p.category || '').toLowerCase().includes(s) ||
      String(p.price || '').includes(s)
    );
  }, [plats, q]);

  return (
    <div className="admin-page">
      <h1 style={{ marginBottom: 16 }}>Plats</h1>

      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <input
          placeholder="Rechercher (nom, catégorie, prix)"
          value={q}
          onChange={e => setQ(e.target.value)}
          style={{
            flex: 1,
            padding: '10px 12px',
            borderRadius: 8,
            border: '1px solid rgba(255,255,255,0.18)',
            background: 'rgba(255,255,255,0.06)',
            color: '#fff'
          }}
        />
        <button onClick={openCreate} style={btnPrimary}>+ Nouveau plat</button>
      </div>

      {loading ? (
        <div>Chargement…</div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thTd}>Image</th>
                <th style={thTd}>Nom</th>
                <th style={thTd}>Catégorie</th>
                <th style={thTd}>Prix (€)</th>
                <th style={thTd}>Statut</th>
                <th style={thTd}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(plat => (
                <tr key={plat._id}>
                  <td style={thTd}>
                    {Array.isArray(plat.images) && plat.images[0] ? (
                      <img
                        src={plat.images[0]}
                        alt={plat.name}
                        style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 8 }}
                      />
                    ) : (
                      <div style={thumbPlaceholder}>🍽️</div>
                    )}
                  </td>
                  <td style={thTd}>{plat.name}</td>
                  <td style={thTd}>{plat.category || '-'}</td>
                  <td style={thTd}>{Number(plat.price).toFixed(2)}</td>
                  <td style={thTd}>
                    <span style={plat.isAvailable ? badgeOk : badgeOff}>
                      {plat.isAvailable ? 'Disponible' : 'Indisponible'}
                    </span>
                  </td>
                  <td style={thTd}>
                    <button style={btnGhost} onClick={() => openEdit(plat)}>Éditer</button>
                    <button style={btnDanger} onClick={() => handleDelete(plat._id)}>Supprimer</button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td style={thTd} colSpan={6}>Aucun plat trouvé</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modale créer/éditer */}
      {modalOpen && (
        <div style={modalBackdrop} onClick={() => setModalOpen(false)}>
          <div style={modalCard} onClick={e => e.stopPropagation()}>
            <h3 style={{ marginTop: 0 }}>{editing ? 'Éditer le plat' : 'Nouveau plat'}</h3>
            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12 }}>
              <div>
                <label>Nom</label>
                <input
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
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
                  placeholder="Ex: Malgache, Entrée, Plat, Dessert…"
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
                  placeholder="https://..., https://..."
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

              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 8 }}>
                <button type="button" onClick={() => setModalOpen(false)} style={btnGhost}>Annuler</button>
                <button type="submit" style={btnPrimary}>
                  {editing ? 'Enregistrer' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: 12,
  overflow: 'hidden'
};
const thTd = {
  padding: '12px 10px',
  borderBottom: '1px solid rgba(255,255,255,0.08)',
  textAlign: 'left'
};
const thumbPlaceholder = {
  width: 56,
  height: 56,
  borderRadius: 8,
  display: 'grid',
  placeItems: 'center',
  background: 'rgba(255,255,255,0.06)'
};
const badgeOk = {
  display: 'inline-block',
  padding: '2px 8px',
  borderRadius: 999,
  fontSize: 12,
  background: 'rgba(34,197,94,.18)',
  color: '#86efac',
  border: '1px solid rgba(34,197,94,.35)'
};
const badgeOff = {
  display: 'inline-block',
  padding: '2px 8px',
  borderRadius: 999,
  fontSize: 12,
  background: 'rgba(239,68,68,.18)',
  color: '#fecaca',
  border: '1px solid rgba(239,68,68,.35)'
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
const btnDanger = {
  background: 'rgba(239,68,68,0.14)',
  color: '#fecaca',
  border: '1px solid rgba(239,68,68,0.35)',
  padding: '8px 12px',
  borderRadius: 10,
  cursor: 'pointer',
  marginLeft: 8
};
const input = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: 8,
  border: '1px solid rgba(255,255,255,0.18)',
  background: 'rgba(255,255,255,0.06)',
  color: '#fff'
};
const modalBackdrop = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.55)',
  display: 'grid',
  placeItems: 'center',
  zIndex: 40
};
const modalCard = {
  width: 'min(720px, 92vw)',
  background: 'rgba(13,15,18, 0.98)',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: 14,
  padding: 18,
  color: '#e5e7eb'
};