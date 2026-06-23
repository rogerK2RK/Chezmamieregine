import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiAdmin from '../../services/apiAdmin.js';
import { useAdminAuth } from '../../context/AdminAuthContext.jsx';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const { login } = useAdminAuth();
  const navigate = useNavigate();

  useEffect(() => { document.title = 'Admin — Connexion'; }, []);

  const submit = async (e) => {
    e.preventDefault(); setErr('');
    try {
      const { data } = await apiAdmin.post('/admin/login', { email, password });
      login(data);
      navigate('/admin');
    } catch (e2) { setErr(e2?.response?.data?.message || 'Identifiants invalides.'); }
  };

  return (
    <main className="auth">
      <form className="form-card" onSubmit={submit}>
        <h1>Admin</h1>
        <p className="sub">Espace d'administration</p>
        {err && <p className="alert err">{err}</p>}
        <div className="field"><label>Email</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
        <div className="field"><label>Mot de passe</label><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></div>
        <button className="btn-primary" style={{ width: '100%' }}>Se connecter</button>
      </form>
    </main>
  );
}
