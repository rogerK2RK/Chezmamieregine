import { useEffect, useState } from 'react';
import apiAdmin from '../../services/apiAdmin.js';

export default function AdminContacts() {
  const [items, setItems] = useState([]);
  const load = async () => { try { const { data } = await apiAdmin.get('/admin/contacts'); setItems(data || []); } catch { setItems([]); } };
  useEffect(() => { load(); }, []);
  const remove = async (id) => { if (!window.confirm('Supprimer ?')) return; try { await apiAdmin.delete(`/admin/contacts/${id}`); load(); } catch { /* ignore */ } };

  return (
    <>
      <h1>Messages</h1>
      <table className="admin-table">
        <thead><tr><th>Nom</th><th>Contact</th><th>Message</th><th></th></tr></thead>
        <tbody>
          {items.map((c) => (
            <tr key={c._id}>
              <td>{c.firstName} {c.lastName}</td>
              <td>{c.email}<br />{c.phone}</td>
              <td>{c.message}</td>
              <td><button className="admin-btn danger" onClick={() => remove(c._id)}>Suppr.</button></td>
            </tr>
          ))}
          {items.length === 0 && <tr><td colSpan="4" style={{ color: 'var(--color-text-muted)' }}>Aucun message.</td></tr>}
        </tbody>
      </table>
    </>
  );
}
