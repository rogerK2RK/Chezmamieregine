import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../services/api';
import { useClientAuth } from '../../../context/ClientAuthContext.jsx';
import './style.css';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [feedback, setFeedback] = useState('');
  const [feedbackType, setFeedbackType] = useState(null); // "success" | "error" | null

  const { login } = useClientAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setFeedback('');
    setFeedbackType(null);

    try {
      const res = await api.post('/auth/login', { email, password });

      // indispensable pour l’Authorization auto par l’intercepteur
      localStorage.setItem('clientToken', res.data.token);

      if (['admin', 'superAdmin'].includes(res.data.role)) {
        setFeedbackType('error');
        setFeedback('Accès refusé : utilisez la connexion administrateur pour ce compte.');
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

      setFeedbackType('success');
      setFeedback('Connexion réussie, redirection en cours...');

      // petite redirection après un court délai pour laisser voir le message
      setTimeout(() => {
        navigate('/');
      }, 800);
    } catch (err) {
      console.error('[LOGIN ERROR]', err?.response?.data || err);
      const msg =
        err?.response?.data?.message ||
        'Erreur de connexion, vérifiez vos identifiants.';
      setFeedbackType('error');
      setFeedback(msg);
    }
  };

  return (
    <div className="connexion-container-content">
      {/* POPUP / BANDEAU DE FEEDBACK */}
      {feedback && (
        <div
          className={`feedback-banner ${
            feedbackType === 'error' ? 'feedback-error' : 'feedback-success'
          }`}
          role="status"
          aria-live="polite"
        >
          {feedback}
        </div>
      )}

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
