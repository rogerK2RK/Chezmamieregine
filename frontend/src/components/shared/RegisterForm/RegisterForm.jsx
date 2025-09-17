import { useState } from 'react';
import api from '../../../services/api';
import './RegisterForm.css';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/register', { name, email, password });
      alert('Inscription réussie');
    } catch (err) {
      alert('Erreur lors de l\'inscription');
    }
  };

  return (
    <div className="connexion-container-content ">
        <form className='register-form' onSubmit={handleRegister}>
          <h2>Inscription</h2>

          <div className="form-group">
            <label>Nom</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nom"
            />
          </div>
          <div className="form-group">
            <label>Email</label>
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
          <button className='btn-primary'  type="submit">S'inscrire</button>
        </form>
    </div>
  );
}
