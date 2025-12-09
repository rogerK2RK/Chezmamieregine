import { useEffect, useState } from 'react';
import apiAdmin from '../../../services/apiAdmin';
import authHeaderAdmin from '../../../services/authHeaderAdmin';
import AdminLayout from '../AdminDashboard/AdminLayout'; // ou le layout que tu utilises
import './style.css';

export default function AdminContactsPage() {
  const [messages, setMessages] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  const headers = authHeaderAdmin();

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErr('');
        const { data } = await apiAdmin.get('/contact-messages', { headers });
        setMessages(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error('[AdminContacts] GET /contact-messages', e?.response?.data || e);
        setErr("Impossible de charger les messages de contact.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const openMessage = async (msg) => {
    try {
      setSelected(null);
      const { data } = await apiAdmin.get(`/contact-messages/${msg._id}`, { headers });
      setSelected(data);
      // on met à jour l’état local pour passer isRead à true
      setMessages((list) =>
        list.map((m) => (m._id === msg._id ? { ...m, isRead: true } : m))
      );
    } catch (e) {
      console.error('[AdminContacts] GET /contact-messages/:id', e?.response?.data || e);
      setErr("Impossible de charger le détail du message.");
    }
  };

  return (
    <AdminLayout title="Messages de contact">
      <main className="acontacts-root">
        <section className="acontacts-list">
          <h2>Messages reçus</h2>

          {loading && <p>Chargement…</p>}
          {err && <p className="acontacts-error">{err}</p>}

          {!loading && messages.length === 0 && (
            <p className="acontacts-empty">Aucun message pour le moment.</p>
          )}

          <ul className="acontacts-ul">
            {messages.map((m) => (
              <li
                key={m._id}
                className={`acontacts-item ${m.isRead ? 'is-read' : 'is-unread'}`}
                onClick={() => openMessage(m)}
              >
                <div className="acontacts-item-header">
                  <span className="acontacts-name">
                    {m.firstName} {m.lastName}
                  </span>
                  <span className="acontacts-email">{m.email}</span>
                </div>
                <div className="acontacts-meta">
                  <span>{new Date(m.createdAt).toLocaleString('fr-FR')}</span>
                  {!m.isRead && <span className="acontacts-badge">Nouveau</span>}
                </div>
                <p className="acontacts-preview">
                  {m.message?.slice(0, 80)}{m.message?.length > 80 ? '…' : ''}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section className="acontacts-detail">
          {selected ? (
            <>
              <h2>Détail du message</h2>
              <div className="acontacts-detail-block">
                <p><strong>Nom :</strong> {selected.firstName} {selected.lastName}</p>
                <p><strong>Email :</strong> {selected.email}</p>
                <p><strong>Téléphone :</strong> {selected.phone}</p>
                <p>
                  <strong>Reçu le :</strong>{' '}
                  {new Date(selected.createdAt).toLocaleString('fr-FR')}
                </p>
                <hr />
                <p className="acontacts-message">{selected.message}</p>
              </div>
            </>
          ) : (
            <div className="acontacts-placeholder">
              Sélectionnez un message dans la liste pour voir le détail.
            </div>
          )}
        </section>
      </main>
    </AdminLayout>
  );
}
