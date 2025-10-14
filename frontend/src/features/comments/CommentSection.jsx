import { useEffect, useMemo, useState } from 'react';
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

  // connecté si clientToken présent (l’intercepteur mettra l’Authorization)
  const isLogged = useMemo(() => {
    return !!(
      localStorage.getItem('clientToken') ||
      sessionStorage.getItem('clientToken')
    );
  }, []);

  // charge les commentaires du plat
  useEffect(() => {
    let stop = false;
    (async () => {
      try {
        setLoading(true);
        setErr('');
        const { data } = await api.get(`/comments/plat/${platId}`);
        if (!stop) setItems(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!stop) setErr('Impossible de charger les commentaires.');
      } finally {
        if (!stop) setLoading(false);
      }
    })();
    return () => { stop = true; };
  }, [platId]);

  const submit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    try {
      setSubmitting(true);
      setErr('');

      // POST /api/comments  (body: { platId, text, rating })
      const { data } = await api.post('/comments', {
        platId,
        text: text.trim(),
        rating: Number(rating) || 5,
      });

      // ajout optimiste en tête
      setItems(prev => [data, ...prev]);
      setText('');
      setRating(5);
    } catch (e) {
      const msg = e?.response?.status === 401
        ? 'Veuillez vous connecter pour commenter.'
        : (e?.response?.data?.message || 'Commentaire impossible.');
      setErr(msg);
    } finally {
      setSubmitting(false);
    }
  };

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
            {items.map((c) => (
              <li key={c._id} className="cmt-item">
                <div className="cmt-head">
                  <strong className="cmt-author">{c.authorName || 'Client'}</strong>
                  <span className="cmt-rating">{'★'.repeat(c.rating || 5)}</span>
                </div>
                <p className="cmt-text">{c.text}</p>
                <div className="cmt-meta">
                  {new Date(c.createdAt || Date.now()).toLocaleString()}
                </div>
              </li>
            ))}
            {items.length === 0 && (
              <li className="cmt-empty">Aucun commentaire pour l’instant.</li>
            )}
          </ul>
        </>
      )}
    </section>
  );
}
