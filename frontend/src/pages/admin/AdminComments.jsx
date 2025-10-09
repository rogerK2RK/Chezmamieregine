// frontend/src/pages/admin/AdminComments.jsx
import { useEffect, useMemo, useState } from 'react';
import apiAdmin from '../../services/apiAdmin';          // ✅ utilise l'API admin
import authHeaderAdmin from '../../services/authHeaderAdmin';

export default function AdminComments() {
  const headers = useMemo(() => ({ ...authHeaderAdmin() }), []);
  const [items, setItems] = useState([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);

  // modale réponse
  const [replyOpen, setReplyOpen] = useState(null); // _id du commentaire
  const [replyText, setReplyText] = useState('');

  const fetchComments = async () => {
    try {
      setLoading(true);
      // ✅ bon endpoint
      const { data } = await apiAdmin.get('/api/admin/comments', { headers });
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error('[GET /api/admin/comments] error', e?.response?.data || e);
      alert('Erreur lors du chargement des commentaires');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchComments(); /* eslint-disable-next-line */ }, []);

  const filtered = items.filter(c => {
    const s = q.toLowerCase().trim();
    if (!s) return true;
    const plat = (c.plat?.name || '').toLowerCase();
    const client = `${c.client?.firstName || ''} ${c.client?.lastName || ''}`.toLowerCase();
    return (
      (c.content || '').toLowerCase().includes(s) ||
      plat.includes(s) ||
      client.includes(s) ||
      String(c.rating || '').includes(s)
    );
  });

  const openReply = (c) => {
    setReplyOpen(c._id);
    setReplyText(c.adminReply || '');
  };

  const saveReply = async () => {
    if (!replyOpen) return;
    try {
      // ✅ bon endpoint
      const { data } = await apiAdmin.put(
        `/api/admin/comments/${replyOpen}/reply`,
        { reply: replyText },
        { headers }
      );
      setItems(prev => prev.map(c => c._id === replyOpen ? data : c));
      setReplyOpen(null);
      setReplyText('');
    } catch (e) {
      console.error('[PUT /api/admin/comments/:id/reply] error', e?.response?.data || e);
      alert('Réponse impossible');
    }
  };

  const toggleVisible = async (id) => {
    try {
      // ✅ bon endpoint
      const { data } = await apiAdmin.put(`/api/admin/comments/${id}/toggle-visible`, {}, { headers });
      setItems(prev => prev.map(c => c._id === id ? data : c));
    } catch (e) {
      console.error('[PUT /api/admin/comments/:id/toggle-visible] error', e?.response?.data || e);
      alert('Action impossible');
    }
  };

  const removeOne = async (id) => {
    if (!window.confirm('Supprimer ce commentaire ?')) return;
    try {
      // ✅ bon endpoint
      await apiAdmin.delete(`/api/admin/comments/${id}`, { headers });
      setItems(prev => prev.filter(c => c._id !== id));
    } catch (e) {
      console.error('[DELETE /api/admin/comments/:id] error', e?.response?.data || e);
      alert('Suppression impossible');
    }
  };

  return (
    <div className="admin-page">
      <h1 style={{ marginBottom: 16 }}>Commentaires</h1>

      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <input
          placeholder="Rechercher (plat, client, texte, note)…"
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
                <th style={cell}>Plat</th>
                <th style={cell}>Client</th>
                <th style={cell}>Note</th>
                <th style={cell}>Commentaire</th>
                <th style={cell}>Réponse</th>
                <th style={cell}>Visibilité</th>
                <th style={cell}>Créé le</th>
                <th style={cell}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c._id}>
                  <td style={cell}>
                    {c.plat ? `${c.plat.name} (${c.plat.ar || '-'})` : '-'}
                  </td>
                  <td style={cell}>
                    {c.client ? `${c.client.firstName || ''} ${c.client.lastName || ''}`.trim() : '-'}
                    <div style={{ fontSize: 12, opacity: .8 }}>{c.client?.email || ''}</div>
                  </td>
                  <td style={cell}>{c.rating ?? '-'}</td>
                  <td style={cell} title={c.content}>{c.content}</td>
                  <td style={cell}>{c.adminReply || <span style={{opacity:.6}}>-</span>}</td>
                  <td style={cell}>
                    <span style={c.isVisible ? badgeOk : badgeOff}>
                      {c.isVisible ? 'Visible' : 'Masqué'}
                    </span>
                  </td>
                  <td style={cell}>{new Date(c.createdAt).toLocaleString()}</td>
                  <td style={cell}>
                    <button style={btnGhost} onClick={() => openReply(c)}>Répondre</button>
                    <button style={btnGhost} onClick={() => toggleVisible(c._id)}>
                      {c.isVisible ? 'Masquer' : 'Afficher'}
                    </button>
                    <button style={btnDanger} onClick={() => removeOne(c._id)}>Supprimer</button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td style={cell} colSpan={8}>Aucun commentaire</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modale réponse */}
      {replyOpen && (
        <div style={backdrop} onClick={() => setReplyOpen(null)}>
          <div style={card} onClick={e => e.stopPropagation()}>
            <h3 style={{ marginTop: 0 }}>Répondre au commentaire</h3>
            <textarea
              value={replyText}
              onChange={e => setReplyText(e.target.value)}
              placeholder="Votre réponse…"
              style={{ ...input, minHeight: 120 }}
            />
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 10 }}>
              <button style={btnGhost} onClick={() => setReplyOpen(null)}>Annuler</button>
              <button style={btnPrimary} onClick={saveReply}>Envoyer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* styles */
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
  minWidth: 260
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
