import { useEffect, useMemo, useState } from 'react';
import api from '../../services/api';
import authHeaderClient from '../../../services/authHeaderClient';
import './style.css';

export default function AccountPage() {
  const headers = useMemo(() => ({ ...authHeaderClient() }), []);
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', sex: 'other' });
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [ok, setOk] = useState('');

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErr('');
        const { data } = await api.get('/me', { headers });
        setForm({
          firstName: data?.firstName || '',
          lastName:  data?.lastName  || '',
          email:     data?.email     || '',
          sex:       data?.sex       || 'other',
        });
      } catch (e) {
        setErr('Impossible de charger votre profil.');
      } finally {
        setLoading(false);
      }
    })();
  }, [headers]);

  const submit = async (e) => {
    e.preventDefault();
    try {
      setOk('');
      setErr('');
      const { data } = await api.put('/me', form, { headers });
      setForm({
        firstName: data?.firstName || '',
        lastName:  data?.lastName  || '',
        email:     data?.email     || '',
        sex:       data?.sex       || 'other',
      });
      setOk('Profil mis à jour.');
    } catch (e) {
      setErr(e?.response?.data?.message || 'Mise à jour impossible.');
    }
  };

  if (loading) return <div className="acc-container"><div className="acc-loading">Chargement…</div></div>;
  if (err && !ok)  return <div className="acc-container"><div className="acc-error">{err}</div></div>;

  return (
    <div className="acc-container">
      <h1>Mon compte</h1>

      {ok && <div className="acc-success">{ok}</div>}
      {err && <div className="acc-error">{err}</div>}

      <form onSubmit={submit} className="acc-form">
        <div>
          <label>Prénom</label>
          <input
            value={form.firstName}
            onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))}
            className="acc-input"
            required
          />
        </div>

        <div>
          <label>Nom</label>
          <input
            value={form.lastName}
            onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))}
            className="acc-input"
            required
          />
        </div>

        <div>
          <label>Email</label>
          <input
            type="email"
            value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            className="acc-input"
            required
          />
        </div>

        <div>
          <label>Sexe</label>
          <select
            value={form.sex}
            onChange={e => setForm(f => ({ ...f, sex: e.target.value }))}
            className="acc-input"
          >
            <option value="H">H</option>
            <option value="F">F</option>
            <option value="other">Autre</option>
          </select>
        </div>

        <div className="acc-actions">
          <button type="submit" className="acc-btn-primary">Enregistrer</button>
        </div>
      </form>
    </div>
  );
}
