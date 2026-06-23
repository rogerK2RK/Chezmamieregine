import { useEffect, useState } from 'react';
import apiAdmin from '../../services/apiAdmin.js';

export default function AdminComments() {
  const [items, setItems] = useState([]);
  const load = async () => { try { const { data } = await apiAdmin.get('/admin/comments'); setItems(data || []); } catch { setItems([]); } };
  useEffect(() => { load(); }, []);

  const toggle = async (c) => {
    try { await apiAdmin.patch(`/admin/comments/${c._id}/${c.hidden ? 'unhide' : 'hide'}`); load(); } catch { /* ignore */ }
  };
  const remove = async (id) => { if (!window.confirm('Supprimer ?')) return; try { await apiAdmin.delete(`/admin/comments/${id}`); load(); } catch { /* ignore */ } };

  return (
    <>
      <h1>Avis</h1>
      <table className="admin-table">
        <thead><tr><th>Plat</th><th>Auteur</th><th>Note</th><th>Message</th><th></th></tr></thead>
        <tbody>
          {items.map((c) => (
            <tr key={c._id} style={{ opacity: c.hidden ? .5 : 1 }}>
              <td>{c.plat?.name || '—'}</td><td>{c.author}</td><td>{c.rating}/5</td><td>{c.text}</td>
              <td><div className="admin-actions">
                <button className="admin-btn" onClick={() => toggle(c)}>{c.hidden ? 'Afficher' : 'Masquer'}</button>
                <button className="admin-btn danger" onClick={() => remove(c._id)}>Suppr.</button>
              </div></td>
            </tr>
          ))}
          {items.length === 0 && <tr><td colSpan="5" style={{ color: 'var(--color-text-muted)' }}>Aucun avis.</td></tr>}
        </tbody>
      </table>
    </>
  );
}
