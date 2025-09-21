import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../services/api';
import './style.css';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // 🔎 lire localStorage OU sessionStorage
    const token = localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken');
    const role  = localStorage.getItem('adminRole')  || sessionStorage.getItem('adminRole');
    if (token && ['admin','superAdmin'].includes(role)) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/admin/login', { email, password });
      if (!['admin','superAdmin'].includes(res.data.role)) {
        alert('Accès réservé aux administrateurs.');
        return;
      }

      // ✅ SIMPLE: stocker toujours en localStorage (évite les confusions)
      localStorage.setItem('adminToken', res.data.token);
      localStorage.setItem('adminRole',  res.data.role);
      localStorage.setItem('adminName',  res.data.name);

      // (si tu tiens à "Se souvenir de moi", on remettra sessionStorage plus tard)

      navigate('/admin/dashboard');
    } catch (err) {
      alert('Erreur de connexion admin');
    }
  };

  return (
    <div className="login-box-all">
      <div className="particles"></div>
      <form onSubmit={handleLogin} className="login-container">
        <h2 className="login-title">Connexion Administrateur</h2>

        <div className="form-group">
          <label htmlFor="email" className="form-label">Identifiant</label>
          <input className="form-input" id="email" type="email" value={email}
                 onChange={e => setEmail(e.target.value)} placeholder="Email" required />
        </div>

        <div className="form-group" style={{ position:'relative' }}>
          <label htmlFor="password" className="form-label">Mot de passe</label>
          <input className="form-input" id="password" type="password" value={password}
                 onChange={e => setPassword(e.target.value)} placeholder="Mot de passe" required />
        </div>

        <button type="submit" className="login-button">Se connecter</button>
      </form>
    </div>
  );
}
