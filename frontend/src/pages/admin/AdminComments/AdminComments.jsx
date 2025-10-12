import { useEffect, useMemo, useState } from 'react';
import apiAdmin from '../../../services/apiAdmin';
import authHeaderAdmin from '../../../services/authHeaderAdmin';
import './style.css';

export default function AdminComments() {
  const headers = useMemo(() => ({ ...authHeaderAdmin() }), []);
  const [items, setItems] = useState([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);
  const [replyOpen, setReplyOpen] = useState(null);
  const [replyText, setReplyText] = useState('');

  const fetchComments = async () => {
    try {
      setLoading(true);
      const { data } = await apiAdmin.get('/admin/comments', { headers });
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error('[GET /admin/comments] error', e?.response?.data || e);
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
      const { data } = await apiAdmin.put(
        `/admin/comments/${replyOpen}/reply`,
        { reply: replyText },
        { headers }
      );
      setItems(prev => prev.map(c => c._id === replyOpen ? data : c));
      setReplyOpen(null);
      setReplyText('');
    } catch (e) {
      console.error('[PUT /admin/comments/:id/reply] error', e?.response?.data || e);
      alert('Réponse impossible');
    }
  };

  const toggleVisible = async (id) => {
    try {
      const { data } = await apiAdmin.put(`/admin/comments/${id}/toggle-visible`, {}, { headers });
      setItems(prev => prev.map(c => c._id === id ? data : c));
    } catch (e) {
      console.error('[PUT /admin/comments/:id/toggle-visible] error', e?.response?.data || e);
      alert('Action impossible');
    }
  };

  const removeOne = async (id) => {
    if (!window.confirm('Supprimer ce commentaire ?')) return;
    try {
      await apiAdmin.delete(`/admin/comments/${id}`, { headers });
      setItems(prev => prev.filter(c => c._id !== id));
    } catch (e) {
      console.error('[DELETE /admin/comments/:id] error', e?.response?.data || e);
      alert('Suppression impossible');
    }
  };

  return (
    <div className="admin-page">
      <h1>Commentaires</h1>

      <div className="filter-bar">
        <input
          className="input"
          placeholder="Rechercher (plat, client, texte, note)…"
          value={q}
          onChange={e => setQ(e.target.value)}
        />
      </div>

      {loading ? (
        <div>Chargement…</div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th className="cell">Plat</th>
                <th className="cell">Client</th>
                <th className="cell">Note</th>
                <th className="cell">Commentaire</th>
                <th className="cell">Réponse</th>
                <th className="cell">Visibilité</th>
                <th className="cell">Créé le</th>
                <th className="cell">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c._id}>
                  <td className="cell">
                    {c.plat ? `${c.plat.name} (${c.plat.ar || '-'})` : '-'}
                  </td>
                  <td className="cell">
                    {c.client ? `${c.client.firstName || ''} ${c.client.lastName || ''}`.trim() : '-'}
                    <div className="client-email">{c.client?.email || ''}</div>
                  </td>
                  <td className="cell">{c.rating ?? '-'}</td>
                  <td className="cell" title={c.content}>{c.content}</td>
                  <td className="cell">{c.adminReply || <span className="muted">-</span>}</td>
                  <td className="cell">
                    <span className={c.isVisible ? 'badge-ok' : 'badge-off'}>
                      {c.isVisible ? 'Visible' : 'Masqué'}
                    </span>
                  </td>
                  <td className="cell">{new Date(c.createdAt).toLocaleString()}</td>
                  <td className="cell">
                    <button className="btn-ghost" onClick={() => openReply(c)}>Répondre</button>
                    <button className="btn-ghost" onClick={() => toggleVisible(c._id)}>
                      {c.isVisible ? 'Masquer' : 'Afficher'}
                    </button>
                    <button className="btn-danger" onClick={() => removeOne(c._id)}>Supprimer</button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td className="cell" colSpan={8}>Aucun commentaire</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {replyOpen && (
        <div className="backdrop" onClick={() => setReplyOpen(null)}>
          <div className="card" onClick={e => e.stopPropagation()}>
            <h3>Répondre au commentaire</h3>
            <textarea
              className="input textarea"
              value={replyText}
              onChange={e => setReplyText(e.target.value)}
              placeholder="Votre réponse…"
            />
            <div className="actions">
              <button className="btn-ghost" onClick={() => setReplyOpen(null)}>Annuler</button>
              <button className="btn-primary-back" onClick={saveReply}>Envoyer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
