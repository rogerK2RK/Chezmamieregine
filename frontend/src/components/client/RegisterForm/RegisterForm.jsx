import { useState } from 'react';
import api from '../../../services/api';
import './style.css';

export default function RegisterForm() {
  const [firstName, setFirstName] = useState('');
  const [lastName,  setLastName]  = useState('');
  const [sex, setSex]             = useState(''); // 'H' | 'F' | 'other'
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', {
        firstName,
        lastName,
        sex,        // ⚠️ on envoie 'other' (pas 'A')
        email,
        password,
      });
      alert('Inscription réussie');
      // (optionnel) reset du formulaire :
      setFirstName(''); setLastName(''); setSex(''); setEmail(''); setPassword('');
      // (optionnel) redirection :
      // navigate('/connexion');
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
      <form className="register-form" onSubmit={handleRegister}>
        <h2>Inscription</h2>

        <div className="form-group">
          <label>Sexe</label>
          <select
            value={sex}
            onChange={(e) => setSex(e.target.value)}
            required
          >
            <option value="">-- Choisir --</option>
            <option value="H">Homme</option>
            <option value="F">Femme</option>
            <option value="other">Autre</option>{/* ← match backend */}
          </select>
        </div>

        <div className="form-group">
          <label>Prénom</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Prénom"
            required
          />
        </div>

        <div className="form-group">
          <label>Nom</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Nom"
            required
          />
        </div>

        <div className="form-group">
          <label>Email</label>
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

        <button className="btn-primary" type="submit">
          S'inscrire
        </button>
      </form>
    </div>
  );
}
