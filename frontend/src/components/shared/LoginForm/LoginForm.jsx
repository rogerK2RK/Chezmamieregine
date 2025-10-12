import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../services/api';
import { useClientAuth } from '../../../context/ClientAuthContext.jsx'; // ⬅️ contexte client
import './style.css';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useClientAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { email, password });

      // 🚫 Empêche les comptes admin/superAdmin d’utiliser ce formulaire
      if (['admin', 'superAdmin'].includes(res.data.role)) {
        alert('Accès refusé : utilisez /admin/login pour les comptes administrateurs.');
        return;
      }

      // ✅ Session client (via contexte)
      login({
        token: res.data.token,
        role: 'client',           // on force client côté front
        name: res.data.name || ''
      });

      navigate('/'); // redirection vers l'accueil
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
            required
          />
        </div>

        <div className="form-group">
          <label>Mot de passe</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mot de passe"
            required
          />
        </div>

        <button className="btn-primary" type="submit">Se connecter</button>
      </form>
    </div>
  );
}
