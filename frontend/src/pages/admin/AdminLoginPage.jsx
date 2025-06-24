import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

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
    <form onSubmit={handleLogin}>
      <h2>Connexion Administrateur</h2>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Mot de passe"
        required
      />
      <button type="submit">Se connecter</button>
    </form>
  );
}
