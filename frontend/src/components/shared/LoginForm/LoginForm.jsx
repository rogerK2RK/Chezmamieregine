import { useState } from 'react';
import api from '../../../services/api';
import './LoginForm.css';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { email, password });

      // 🚫 Bloque les rôles admin ici
    if (['admin', 'superAdmin'].includes(res.data.role)) {
      alert('Accès refusé : utilisez /admin/login pour les comptes administrateurs');
      return;
    }

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      localStorage.setItem('name', res.data.name);
      alert('Connexion réussie');
    } catch (err) {
      alert('Erreur de connexion');
    }
  };

  return (
    <div className="connexion-container-content">
      <form className="form-connexion" onSubmit={handleLogin}>
          <h2>Connexion</h2>

          <div className="form-group">
            <label>Identifiant</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
            />
          </div>

          <div className="form-group">
            <label>Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mot de passe"
            />
          </div>
            
        <button className='btn-primary' type="submit">Se connecter</button>
      </form>
    </div>
    
  );
}
