import { useEffect, useMemo, useState, useCallback } from 'react';
import apiAdmin from '../../../services/apiAdmin';
import authHeaderAdmin from '../../../services/authHeaderAdmin';
import './style.css';

export default function AdminComments() {
  const headers = useMemo(() => ({ ...authHeaderAdmin() }), []);
  const [items, setItems] = useState([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);

  // modal réponse staff
  const [replyOpen, setReplyOpen] = useState(null); // comment _id
  const [replyText, setReplyText] = useState('');

  // ---------------------------
  // Fetch list (supporte {items,...} ou tableau)
  // ---------------------------
  const fetchComments = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await apiAdmin.get('/admin/comments', { headers });
      const arr = Array.isArray(data) ? data : Array.isArray(data?.items) ? data.items : [];
      setItems(arr);
    } catch (e) {
      console.error('[GET /admin/comments] error', e?.response?.data || e);
      alert('Erreur lors du chargement des commentaires');
    } finally {
      setLoading(false);
    }
  }, [headers]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  // ---------------------------
  // Helpers d'affichage
  // ---------------------------
  const displayPlat = (c) =>
    c.plat ? `${c.plat.name || c.plat.nom || '—'}${c.plat.ar ? ` (${c.plat.ar})` : ''}` : '—';

  const displayClient = (c) => {
    const a = c.authorClient || c.client || {};
    const full = `${a.firstName || ''} ${a.lastName || ''}`.trim();
    return full || a.email || 'Client';
  };

  const displayEmail = (c) => (c.authorClient?.email || c.client?.email || '');

  const displayText = (c) => c.text || c.content || '';

  const isVisible = (c) => (c.isHidden === true ? false : c.isVisible === false ? false : true);

  const displayReply = (c) => c.staffReply || c.adminReply || '';

  // ---------------------------
  // Recherche
  // ---------------------------
  const filtered = items.filter((c) => {
    const s = q.toLowerCase().trim();
    if (!s) return true;
    const plat = (c.plat?.name || c.plat?.nom || '').toLowerCase();
    const client = displayClient(c).toLowerCase();
    const text = displayText(c).toLowerCase();
    const rating = String(c.rating ?? '').toLowerCase();
    const reply = displayReply(c).toLowerCase();
    return plat.includes(s) || client.includes(s) || text.includes(s) || reply.includes(s) || rating.includes(s);
  });

  // ---------------------------
  // Actions avec fallback (PATCH -> PUT) + payloads tolérants
  // ---------------------------

  // Réponse staff
  const saveReply = async () => {
    if (!replyOpen) return;
    try {
      // 1) essayer PATCH /reply { reply }
      try {
        const { data } = await apiAdmin.patch(
          `/admin/comments/${replyOpen}/reply`,
          { reply: replyText }, // payload v1
          { headers }
        );
        setItems((prev) => prev.map((c) => (c._id === replyOpen ? data : c)));
      } catch (e1) {
        const sc = e1?.response?.status;
        // 2) si 404/405, retomber sur PUT /reply { reply } ou { staffReply }
        if (sc === 404 || sc === 405) {
          try {
            const { data } = await apiAdmin.put(
              `/admin/comments/${replyOpen}/reply`,
              { reply: replyText, staffReply: replyText }, // payload v2 tolérant
              { headers }
            );
            setItems((prev) => prev.map((c) => (c._id === replyOpen ? data : c)));
          } catch (e2) {
            console.error('[PUT /admin/comments/:id/reply] error', e2?.response?.data || e2);
            throw e2;
          }
        } else {
          console.error('[PATCH /admin/comments/:id/reply] error', e1?.response?.data || e1);
          throw e1;
        }
      }
      setReplyOpen(null);
      setReplyText('');
    } catch (e) {
      alert("Impossible d'enregistrer la réponse");
    }
  };

  // Masquer/Afficher
  const toggleVisible = async (c) => {
    const id = c._id;
    try {
      if (isVisible(c)) {
        // MASQUER
        try {
          // 1) PATCH /hide
          const { data } = await apiAdmin.patch(`/admin/comments/${id}/hide`, {}, { headers });
          setItems((prev) => prev.map((x) => (x._id === id ? data : x)));
        } catch (e1) {
          const sc = e1?.response?.status;
          if (sc === 404 || sc === 405) {
            // 2) fallback: PUT /toggle-visible (back legacy)
            try {
              const { data } = await apiAdmin.put(`/admin/comments/${id}/toggle-visible`, {}, { headers });
              setItems((prev) => prev.map((x) => (x._id === id ? data : x)));
            } catch (e2) {
              console.error('[PUT /admin/comments/:id/toggle-visible] error', e2?.response?.data || e2);
              throw e2;
            }
          } else {
            console.error('[PATCH /admin/comments/:id/hide] error', e1?.response?.data || e1);
            throw e1;
          }
        }
      } else {
        // AFFICHER
        try {
          // 1) PATCH /unhide
          const { data } = await apiAdmin.patch(`/admin/comments/${id}/unhide`, {}, { headers });
          setItems((prev) => prev.map((x) => (x._id === id ? data : x)));
        } catch (e1) {
          const sc = e1?.response?.status;
          if (sc === 404 || sc === 405) {
            // 2) fallback: PUT /toggle-visible
            try {
              const { data } = await apiAdmin.put(`/admin/comments/${id}/toggle-visible`, {}, { headers });
              setItems((prev) => prev.map((x) => (x._id === id ? data : x)));
            } catch (e2) {
              console.error('[PUT /admin/comments/:id/toggle-visible] error', e2?.response?.data || e2);
              throw e2;
            }
          } else {
            console.error('[PATCH /admin/comments/:id/unhide] error', e1?.response?.data || e1);
            throw e1;
          }
        }
      }
    } catch (_e) {
      alert('Action de visibilité impossible');
    }
  };

  // Supprimer
  const removeOne = async (id) => {
    if (!window.confirm('Supprimer ce commentaire ?')) return;
    try {
      await apiAdmin.delete(`/admin/comments/${id}`, { headers });
      setItems((prev) => prev.filter((c) => c._id !== id));
    } catch (e) {
      console.error('[DELETE /admin/comments/:id] error', e?.response?.data || e);
      alert('Suppression impossible');
    }
  };

  // ---------------------------
  // UI
  // ---------------------------
  return (
    <main className="admin-page">
      <h1>Commentaires</h1>

      <div className="filter-bar">
        <input
          className="input"
          placeholder="Rechercher (plat, client, texte, note, réponse)…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <button className="btn-ghost" onClick={fetchComments} disabled={loading}>
          Rafraîchir
        </button>
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
                <th className="cell">Réponse staff</th>
                <th className="cell">Visibilité</th>
                <th className="cell">Créé le</th>
                <th className="cell">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c._id}>
                  <td className="cell">{displayPlat(c)}</td>

                  <td className="cell">
                    {displayClient(c)}
                    <div className="client-email">{displayEmail(c)}</div>
                  </td>

                  <td className="cell">{c.rating ?? '-'}</td>

                  <td className="cell" title={displayText(c)}>{displayText(c)}</td>

                  <td className="cell">{displayReply(c) || <span className="muted">—</span>}</td>

                  <td className="cell">
                    <span className={isVisible(c) ? 'badge-ok' : 'badge-off'}>
                      {isVisible(c) ? 'Visible' : 'Masqué'}
                    </span>
                  </td>

                  <td className="cell">{c.createdAt ? new Date(c.createdAt).toLocaleString() : '—'}</td>

                  <td className="cell">
                    <button className="btn-ghost" onClick={() => { setReplyOpen(c._id); setReplyText(displayReply(c)); }}>
                      Répondre
                    </button>
                    <button className="btn-ghost" onClick={() => toggleVisible(c)}>
                      {isVisible(c) ? 'Masquer' : 'Afficher'}
                    </button>
                    <button className="btn-danger" onClick={() => removeOne(c._id)}>
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td className="cell" colSpan={8}>Aucun commentaire</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {replyOpen && (
        <div className="backdrop" onClick={() => setReplyOpen(null)}>
          <div className="card" onClick={(e) => e.stopPropagation()}>
            <h3>Répondre au commentaire</h3>
            <textarea
              className="input textarea"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Votre réponse…"
            />
            <div className="actions">
              <button className="btn-ghost" onClick={() => setReplyOpen(null)}>Annuler</button>
              <button className="btn-primary-back" onClick={saveReply}>Envoyer</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
