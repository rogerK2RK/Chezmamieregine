import { useEffect, useState } from 'react';
import api from '../../services/api';
import './style.css';

export default function CommentSection({ platId }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  // form
  const [text, setText] = useState('');
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);

  // connecté si clientToken présent (réactif via l’événement 'storage')
  const [isLogged, setIsLogged] = useState(
    !!(localStorage.getItem('clientToken') || sessionStorage.getItem('clientToken'))
  );
  useEffect(() => {
    const onStorage = () =>
      setIsLogged(!!(localStorage.getItem('clientToken') || sessionStorage.getItem('clientToken')));
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // util: (re)charger les commentaires du plat (public)
  const load = async () => {
    try {
      setLoading(true);
      setErr('');
      const { data } = await api.get(`/comments/plat/${platId}`);
      setItems(Array.isArray(data) ? data : []);
    } catch (_e) {
      setErr('Impossible de charger les commentaires.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let stop = false;
    (async () => {
      try {
        setLoading(true);
        setErr('');
        const { data } = await api.get(`/comments/plat/${platId}`);
        if (!stop) setItems(Array.isArray(data) ? data : []);
      } catch (_e) {
        if (!stop) setErr('Impossible de charger les commentaires.');
      } finally {
        if (!stop) setLoading(false);
      }
    })();
    return () => {
      stop = true;
    };
  }, [platId]);

  const submit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    // 🔑 lire le token au moment du submit
    const t =
      localStorage.getItem('clientToken') || sessionStorage.getItem('clientToken');

    if (!t) {
      setErr('Veuillez vous connecter pour commenter.');
      return;
    }

    try {
      setSubmitting(true);
      setErr('');

      // POST /api/comments (protégé)
      const { data } = await api.post(
        '/comments',
        { platId, text: text.trim(), rating: Number(rating) || 5 },
        { headers: { Authorization: `Bearer ${t}` } }
      );

      // ajout optimiste en tête (staffReply vide au départ)
      setItems((prev) => [
        {
          ...data,
          staffReply: data?.staffReply || '',
          createdAt: data?.createdAt || new Date().toISOString(),
        },
        ...prev,
      ]);

      setText('');
      setRating(5);

      // (optionnel mais conseillé) — refetch pour aligner avec le back (populate, tri, etc.)
      load();
    } catch (e) {
      const msg =
        e?.response?.status === 401
          ? 'Veuillez vous connecter pour commenter.'
          : e?.response?.data?.message || 'Commentaire impossible.';
      setErr(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // helpers d’affichage
  const fmtDate = (d) => {
    try {
      return new Date(d || Date.now()).toLocaleString();
    } catch {
      return '';
    }
  };
  const stars = (n) => '★'.repeat(Math.max(1, Math.min(5, Number(n) || 5)));

  return (
    <section className="cmt-section">
      <h3 className="cmt-title">Avis & commentaires</h3>

      {loading ? (
        <div className="cmt-loading">Chargement…</div>
      ) : (
        <>
          {/* Formulaire (uniquement si connecté) */}
          {isLogged ? (
            <form className="cmt-form" onSubmit={submit}>
              <div className="cmt-row">
                <label className="cmt-label">Note</label>
                <select
                  className="cmt-input"
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                >
                  <option value={5}>5</option>
                  <option value={4}>4</option>
                  <option value={3}>3</option>
                  <option value={2}>2</option>
                  <option value={1}>1</option>
                </select>
              </div>

              <div className="cmt-row">
                <label className="cmt-label">Votre commentaire</label>
                <textarea
                  className="cmt-input cmt-textarea"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Partagez votre avis…"
                  rows={4}
                  required
                />
              </div>

              {err && <div className="cmt-error">{err}</div>}

              <div className="cmt-actions">
                <button className="cmt-btn" disabled={submitting}>
                  {submitting ? 'Envoi…' : 'Publier'}
                </button>
              </div>
            </form>
          ) : (
            <div className="cmt-login-hint">
              Connectez-vous pour ajouter un commentaire.
            </div>
          )}

          {/* Liste */}
          <ul className="cmt-list">
            {items.map((c) => {
              const reply = c.staffReply || c.adminReply || ''; // compat
              const replyAt = c.staffReplyAt;
              const replyBy =
                typeof c.staffReplyBy === 'object' && c.staffReplyBy !== null
                  ? `${c.staffReplyBy.firstName || ''} ${c.staffReplyBy.lastName || ''}`.trim() ||
                    c.staffReplyBy.email ||
                    ''
                  : '';

              return (
                <li key={c._id} className="cmt-item">
                  <div className="cmt-head">
                    <strong className="cmt-author">
                      {c.authorName || 'Client'}
                    </strong>
                    <span className="cmt-rating">{stars(c.rating)}</span>
                  </div>

                  <p className="cmt-text">{c.text}</p>

                  <div className="cmt-meta">{fmtDate(c.createdAt)}</div>

                  {/* Réponse de l’équipe si disponible */}
                  {!!reply && (
                    <div className="cmt-reply">
                      <div className="cmt-reply-head">
                        Réponse de l’équipe
                        {replyBy ? ` — ${replyBy}` : ''}
                        {replyAt ? ` · ${fmtDate(replyAt)}` : ''}
                      </div>
                      <p className="cmt-reply-text">{reply}</p>
                    </div>
                  )}
                </li>
              );
            })}
            {items.length === 0 && (
              <li className="cmt-empty">Aucun commentaire pour l’instant.</li>
            )}
          </ul>
        </>
      )}
    </section>
  );
}