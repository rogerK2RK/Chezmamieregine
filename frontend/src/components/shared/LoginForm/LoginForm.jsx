import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../services/api';
import { useClientAuth } from '../../../context/ClientAuthContext.jsx';
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

      // indispensable pour l’Authorization auto par l’intercepteur
      localStorage.setItem('clientToken', res.data.token);

      if (['admin', 'superAdmin'].includes(res.data.role)) {
        alert('Accès refusé : utilisez /admin/login pour les comptes administrateurs.');
        return;
      }

      const displayName = [res.data.firstName, res.data.lastName]
        .filter(Boolean)
        .join(' ');

      login({
        token: res.data.token,
        role: 'client',
        name: displayName || res.data.email || '',
      });

      navigate('/');
    } catch (err) {
      alert('Erreur de connexion');
    }
  };

  return (
    <div className="connexion-container-content">
      <form
        className="form-connexion"
        onSubmit={handleLogin}
        aria-label="Formulaire de connexion client"
      >
        <h1>Connexion</h1>

        {/* EMAIL */}
        <div className="form-group">
          <label htmlFor="login-email">Identifiant</label>
          <input
            id="login-email"
            aria-label="Entrer votre adresse email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
        </div>

        {/* MOT DE PASSE */}
        <div className="form-group">
          <label htmlFor="login-password">Mot de passe</label>
          <input
            id="login-password"
            aria-label="Entrer votre mot de passe"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mot de passe"
            required
          />
        </div>

        <button
          className="btn-primary"
          type="submit"
          aria-label="Se connecter à votre compte"
        >
          Se connecter
        </button>
      </form>
    </div>
  );
}
