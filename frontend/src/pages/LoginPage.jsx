import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api.js';
import { useClientAuth } from '../context/ClientAuthContext.jsx';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const { login } = useClientAuth();
  const navigate = useNavigate();

  useEffect(() => { document.title = 'Connexion — Chez Mamie Régine'; }, []);

  const submit = async (e) => {
    e.preventDefault(); setErr('');
    try {
      const { data } = await api.post('/auth/login', { email, password });
      login({ token: data.token, name: [data.firstName, data.lastName].filter(Boolean).join(' ') });
      navigate('/');
    } catch (e2) { setErr(e2?.response?.data?.message || 'Identifiants invalides.'); }
  };

  return (
    <main className="auth">
      <form className="form-card" onSubmit={submit}>
        <h1>Connexion</h1>
        <p className="sub">Heureux de vous revoir chez Mamie Régine</p>
        {err && <p className="alert err">{err}</p>}
        <div className="field"><label>Email</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
        <div className="field"><label>Mot de passe</label><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></div>
        <button className="btn-primary" style={{ width: '100%' }}>Se connecter</button>
        <p className="switch">Pas encore de compte ? <Link to="/inscription">Créer un compte</Link></p>
      </form>
    </main>
  );
}
