import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api.js';
import { useClientAuth } from '../context/ClientAuthContext.jsx';

export default function RegisterPage() {
  const [form, setForm] = useState({ firstName: '', lastName: '', sex: '', email: '', password: '' });
  const [err, setErr] = useState('');
  const { login } = useClientAuth();
  const navigate = useNavigate();

  useEffect(() => { document.title = 'Inscription — Chez Mamie Régine'; }, []);
  const change = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault(); setErr('');
    try {
      const { data } = await api.post('/auth/register', form);
      login({ token: data.token, name: [data.firstName, data.lastName].filter(Boolean).join(' ') });
      navigate('/');
    } catch (e2) { setErr(e2?.response?.data?.message || "Erreur lors de l'inscription."); }
  };

  return (
    <main className="auth">
      <form className="form-card" onSubmit={submit}>
        <h1>Inscription</h1>
        <p className="sub">Créez votre compte en quelques secondes</p>
        {err && <p className="alert err">{err}</p>}
        <div className="field"><label>Sexe</label>
          <select name="sex" value={form.sex} onChange={change} required>
            <option value="">— Choisir —</option><option value="H">Homme</option><option value="F">Femme</option><option value="other">Autre</option>
          </select>
        </div>
        <div className="form-row">
          <div className="field"><label>Prénom</label><input name="firstName" value={form.firstName} onChange={change} required /></div>
          <div className="field"><label>Nom</label><input name="lastName" value={form.lastName} onChange={change} required /></div>
        </div>
        <div className="field"><label>Email</label><input type="email" name="email" value={form.email} onChange={change} required /></div>
        <div className="field"><label>Mot de passe</label><input type="password" name="password" value={form.password} onChange={change} required /></div>
        <button className="btn-primary" style={{ width: '100%' }}>S'inscrire</button>
        <p className="switch">Déjà un compte ? <Link to="/connexion">Se connecter</Link></p>
      </form>
    </main>
  );
}
