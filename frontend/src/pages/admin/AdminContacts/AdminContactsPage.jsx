// src/pages/admin/AdminContacts/AdminContactsPage.jsx
import { useEffect, useState } from 'react';
import apiAdmin from '../../../services/apiAdmin';
import authHeaderAdmin from '../../../services/authHeaderAdmin';
import './style.css';

export default function AdminContactsPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError('');
        const headers = authHeaderAdmin();
        const { data } = await apiAdmin.get('/public/contacts', { headers });
        setMessages(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error('[AdminContacts] GET /public/contacts', e?.response?.data || e);
        setError('Impossible de charger les messages de contact.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="admin-page admin-contacts">
      <header className="admin-contacts-header">
        <h1>Messages de contact</h1>
      </header>

      {error && <div className="admin-alert admin-alert--error">{error}</div>}
      {loading && <div className="admin-contacts-loading">Chargement…</div>}

      {!loading && !error && (
        <div className="admin-contacts-layout">
          {/* Liste gauche */}
          <aside className="admin-contacts-list">
            {messages.length === 0 ? (
              <p className="admin-contacts-empty">Aucun message pour le moment.</p>
            ) : (
              <ul>
                {messages.map((m) => (
                  <li
                    key={m._id}
                    className={
                      'admin-contacts-item' +
                      (selected && selected._id === m._id ? ' is-active' : '')
                    }
                    onClick={() => setSelected(m)}
                  >
                    <div className="admin-contacts-name">
                      {m.lastName} {m.firstName}
                    </div>
                    <div className="admin-contacts-email">{m.email}</div>
                    <div className="admin-contacts-date">
                      {new Date(m.createdAt).toLocaleString('fr-FR')}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </aside>

          {/* Détail droite */}
          <section className="admin-contacts-detail">
            {selected ? (
              <>
                <h2>Détail du message</h2>
                <p><strong>Nom :</strong> {selected.lastName}</p>
                <p><strong>Prénom :</strong> {selected.firstName}</p>
                <p><strong>Email :</strong> {selected.email}</p>
                {selected.phone && (
                  <p><strong>Téléphone :</strong> {selected.phone}</p>
                )}
                <p><strong>Message :</strong></p>
                <p className="admin-contacts-message">{selected.message}</p>
              </>
            ) : (
              <p className="admin-contacts-placeholder">
                Sélectionnez un message dans la liste pour voir le détail.
              </p>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
