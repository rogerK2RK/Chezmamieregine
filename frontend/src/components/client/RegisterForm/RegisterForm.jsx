import { useState } from 'react';
import api from '../../../services/api';
import './style.css';

export default function RegisterForm() {
  const [firstName, setFirstName] = useState('');
  const [lastName,  setLastName]  = useState('');
  const [sex, setSex]             = useState('');
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', {
        firstName,
        lastName,
        sex,
        email,
        password,
      });
      alert('Inscription réussie');
      setFirstName(''); 
      setLastName(''); 
      setSex(''); 
      setEmail(''); 
      setPassword('');
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Erreur lors de l'inscription";
      console.error('[REGISTER ERROR]', err?.response?.data || err);
      alert(msg);
    }
  };

  return (
    <div className="connexion-container-content">
      <form 
        className="register-form" 
        onSubmit={handleRegister}
        aria-label="Formulaire d'inscription"
      >
        <h1>Inscription</h1>

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
        </div>

        <button 
          className="btn-primary" 
          type="submit"
          aria-label="Valider l'inscription"
        >
          S'inscrire
        </button>
      </form>
    </div>
  );
}
