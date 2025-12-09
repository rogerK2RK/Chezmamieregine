// src/pages/admin/AdminContacts/AdminContactsPage.jsx
import { useEffect, useMemo, useState, useCallback } from 'react';
import apiAdmin from '../../../services/apiAdmin';
import authHeaderAdmin from '../../../services/authHeaderAdmin';
import './style.css';

export default function AdminContactsPage() {
  const headers = useMemo(() => ({ ...authHeaderAdmin() }), []);
  const [items, setItems] = useState([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState('');

  const [selected, setSelected] = useState(null);

  // --------- Fetch messages ----------
  const fetchContacts = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const { data } = await apiAdmin.get('/public/contacts', { headers });
      const arr = Array.isArray(data) ? data : [];
      setItems(arr);
    } catch (e) {
      console.error('[AdminContacts] GET /public/contacts', e?.response?.data || e);
      setError('Impossible de charger les messages de contact.');
    } finally {
      setLoading(false);
    }
  }, [headers]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  // --------- Filtre recherche ----------
  const filtered = items.filter((m) => {
    const s = q.toLowerCase().trim();
    if (!s) return true;

    const fullName = `${m.lastName || ''} ${m.firstName || ''}`.toLowerCase();
    const email = (m.email || '').toLowerCase();
    const phone = (m.phone || '').toLowerCase();
    const message = (m.message || '').toLowerCase();

    return (
      fullName.includes(s) ||
      email.includes(s) ||
      phone.includes(s) ||
      message.includes(s)
    );
  });

  const formatDate = (d) =>
    d ? new Date(d).toLocaleString('fr-FR') : '—';

  const preview = (txt) =>
    (txt || '').length > 80 ? `${txt.slice(0, 77)}…` : (txt || '');

  // --------- UI ----------
  return (
    <main className="admin-page admin-contacts">
      <h1>Messages de contact</h1>

      {/* Barre de filtre + actions */}
      <div className="filter-bar">
        <input
          className="input"
          placeholder="Rechercher (nom, email, téléphone, message)…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <button
          className="btn-ghost"
          onClick={fetchContacts}
          disabled={loading}
        >
          Rafraîchir
        </button>
      </div>

      {error && (
        <div className="admin-alert admin-alert--error">
          {error}
        </div>
      )}

      {loading ? (
        <div>Chargement…</div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th className="cell">Nom</th>
                <th className="cell">Email</th>
                <th className="cell">Téléphone</th>
                <th className="cell">Reçu le</th>
                <th className="cell">Message</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((m) => (
                <tr
                  key={m._id}
                  className="row-clickable"
                  onClick={() => setSelected(m)}
                >
                  <td className="cell">
                    {m.lastName} {m.firstName}
                  </td>
                  <td className="cell">
                    {m.email}
                    <div className="client-email">{m.email}</div>
                  </td>
                  <td className="cell">{m.phone || <span className="muted">—</span>}</td>
                  <td className="cell">{formatDate(m.createdAt)}</td>
                  <td className="cell" title={m.message}>
                    {preview(m.message)}
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td className="cell" colSpan={5}>
                    Aucun message de contact.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal détail */}
      {selected && (
        <div className="backdrop" onClick={() => setSelected(null)}>
          <div
            className="card"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Message de {selected.firstName} {selected.lastName}</h3>
            <p className="muted">
              Reçu le {formatDate(selected.createdAt)}
            </p>

            <p><strong>Email :</strong> {selected.email}</p>
            {selected.phone && (
              <p><strong>Téléphone :</strong> {selected.phone}</p>
            )}

            <p><strong>Message :</strong></p>
            <p className="admin-contacts-message">
              {selected.message}
            </p>

            <div className="actions">
              <button
                className="btn-ghost"
                onClick={() => setSelected(null)}
              >
                Fermer
              </button>

              {selected.email && (
                <a
                  href={`mailto:${selected.email}?subject=Réponse à votre message`}
                  className="btn-primary-back"
                >
                  Répondre par email
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
