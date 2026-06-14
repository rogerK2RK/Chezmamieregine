import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../services/api';
import './style.css';

export default function RegisterForm() {
  const [firstName, setFirstName] = useState('');
  const [lastName,  setLastName]  = useState('');
  const [sex, setSex]             = useState('');
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');

  // 🆕 Gestion des erreurs par champ
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    sex: '',
    email: '',
    password: '',
    global: ''
  });

  // 🆕 Popup succès
  const [successMessage, setSuccessMessage] = useState('');

  const resetErrors = () =>
    setErrors({ firstName: '', lastName: '', sex: '', email: '', password: '', global: '' });

  const handleRegister = async (e) => {
    e.preventDefault();
    resetErrors();
    setSuccessMessage('');

    try {
      await api.post('/auth/register', {
        firstName,
        lastName,
        sex,
        email,
        password,
      });

      setSuccessMessage('Votre compte a bien été créé !');

      // reset des champs
      setFirstName('');
      setLastName('');
      setSex('');
      setEmail('');
      setPassword('');

    } catch (err) {
      const msg = err?.response?.data?.message || "Erreur lors de l'inscription";

      console.error('[REGISTER ERROR]', msg);

      const lowerMsg = msg.toLowerCase();

      if (lowerMsg.includes('prénom') || lowerMsg.includes('first')) {
        return setErrors((prev) => ({ ...prev, firstName: msg }));
      }
      if (lowerMsg.includes('nom') || lowerMsg.includes('last')) {
        return setErrors((prev) => ({ ...prev, lastName: msg }));
      }
      if (lowerMsg.includes('sexe')) {
        return setErrors((prev) => ({ ...prev, sex: msg }));
      }
      if (lowerMsg.includes('email')) {
        return setErrors((prev) => ({ ...prev, email: msg }));
      }
      if (lowerMsg.includes('mot de passe') || lowerMsg.includes('password')) {
        return setErrors((prev) => ({ ...prev, password: msg }));
      }

      setErrors((prev) => ({ ...prev, global: msg }));
    }
  };

  return (
    <div className="connexion-container-content">
      {/* POPUP SUCCÈS EN ABSOLUTE */}
      {successMessage && (
        <div className="register-success-popup" role="status" aria-live="polite">
          <div className="register-success-box">
            <p>{successMessage}</p>
            <button
              type="button"
              className="btn-primary btn-close-popup"
              onClick={() => setSuccessMessage('')}
            >
              Fermer
            </button>
          </div>
        </div>
      )}

      <form 
        className="register-form" 
        onSubmit={handleRegister}
        aria-label="Formulaire d'inscription"
      >
        <h1>Inscription</h1>

        {/* ERREUR GLOBALE */}
        {errors.global && (
          <p className="error-text global-error">{errors.global}</p>
        )}

        {/* SEXE */}
        <div className="form-group">
          <label htmlFor="sex">Sexe</label>
          <select
            id="sex"
            aria-label="Sélection du sexe"
            value={sex}
            onChange={(e) => setSex(e.target.value)}
            required
          >
            <option value="">-- Choisir --</option>
            <option value="H">Homme</option>
            <option value="F">Femme</option>
            <option value="other">Autre</option>
          </select>
          {errors.sex && <p className="error-text">{errors.sex}</p>}
        </div>

        {/* PRÉNOM */}
        <div className="form-group">
          <label htmlFor="firstName">Prénom</label>
          <input
            id="firstName"
            aria-label="Entrer votre prénom"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Prénom"
            required
          />
          {errors.firstName && <p className="error-text">{errors.firstName}</p>}
        </div>

        {/* NOM */}
        <div className="form-group">
          <label htmlFor="lastName">Nom</label>
          <input
            id="lastName"
            aria-label="Entrer votre nom"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Nom"
            required
          />
          {errors.lastName && <p className="error-text">{errors.lastName}</p>}
        </div>

        {/* EMAIL */}
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            aria-label="Entrer votre adresse email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
          {errors.email && <p className="error-text">{errors.email}</p>}
        </div>

        {/* MOT DE PASSE */}
        <div className="form-group">
          <label htmlFor="password">Mot de passe</label>
          <input
            id="password"
            aria-label="Entrer votre mot de passe"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mot de passe"
            required
          />
          {errors.password && <p className="error-text">{errors.password}</p>}
        </div>

        <button 
          className="btn-primary" 
          type="submit"
          aria-label="Valider l'inscription"
        >
          S'inscrire
        </button>

        <p className="form-switch">
          Déjà un compte ? <Link to="/connexion">Se connecter</Link>
        </p>
      </form>
    </div>
  );
}
