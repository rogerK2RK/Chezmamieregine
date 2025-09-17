import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './style.css'
import api from '../../../services/api';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { email, password });

      if (!['admin', 'superAdmin'].includes(res.data.role)) {
        return alert("Accès réservé aux administrateurs.");
      }

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      localStorage.setItem('name', res.data.name);

      navigate('/admin'); // Redirige vers le dashboard
    } catch (err) {
      alert('Erreur de connexion admin');
    }
  };

  return (
    <div class="login-box-all">
      <div class="particles"></div>
      <form onSubmit={handleLogin} class="login-container">
        <h2 class="login-title">Connexion Administrateur</h2>

        <div class="form-group">
          <input
            type="email"
            id="email" 
            name="email" 
            class="form-input" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
        </div>
        
        <div class="form-group">
          <label for="password" class="form-label">Mot de passe</label>
          <input
            type="password"
            id="password" 
            name="password" 
            class="form-input" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mot de passe"
            required
          />
        </div>

        <button type="submit" class="login-button">Se connecter</button>
      </form>
    </div>
    
  );
}
