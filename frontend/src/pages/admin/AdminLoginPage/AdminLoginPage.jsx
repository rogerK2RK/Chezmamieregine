import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../services/api';
import EyeToggle from '../../../components/shared/ui/EyeToggle'; // 👁️ bouton toggle
import './style.css';
import { Link } from 'react-router-dom';
import logoCmr from '../../../assets/Logo CMR Blc.svg';


export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // 👁️
  const [rememberMe, setRememberMe] = useState(true); // ☑️
  const navigate = useNavigate();

  useEffect(() => {
    const token =
      localStorage.getItem('adminToken') ||
      sessionStorage.getItem('adminToken');
    const role =
      localStorage.getItem('adminRole') || sessionStorage.getItem('adminRole');

    if (token && ['admin', 'superAdmin'].includes(role)) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/admin/login', { email, password });
      localStorage.setItem('adminToken', res.data.token);
      localStorage.setItem('adminRole',  res.data.role);


      if (!['admin', 'superAdmin'].includes(res.data.role)) {
        alert('Accès réservé aux administrateurs.');
        return;
      }

      // Stockage selon "Se souvenir de moi"
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem('adminToken', res.data.token);
      storage.setItem('adminRole', res.data.role);
      storage.setItem('adminName', res.data.name);

      navigate('/admin/dashboard');
    } catch (err) {
      console.log('ADMIN LOGIN ERROR:', err.response?.status, err.response?.data);
      alert('Erreur de connexion admin');
    }
  };

  return (
    <div className="login-box-all">
      <div className="particles"></div>

      <form onSubmit={handleLogin} className="login-container">
        <img className='logo-back-connexion' src={logoCmr} alt="Logo de chez Mamie Regine" />
        {/* <h2 className="login-title">Se connecter</h2> */}

        {/* Email */}
        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Identifiant
          </label>
          <input
            className="form-input"
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
        </div>

        {/* Mot de passe + œil */}
        <div className="form-group password-field" style={{ position: 'relative' }}>
          <label htmlFor="password" className="form-label">
            Mot de passe
          </label>

          <input
            className="form-input"
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mot de passe"
            required
          />

          {/* 👁️ Icône SVG animé */}
          <EyeToggle open={showPassword} onToggle={() => setShowPassword((v) => !v)} />
        </div>

        <button type="submit" className="login-button">
          SE CONNECTER
        </button>

        {/* Se souvenir de moi */}
        <div className="form-row-remember">
          <label className="remember-label">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <span>Se souvenir de moi</span>
          </label>
          <Link className='link-back'>Mot de passe oublié</Link>
        </div>
      </form>
    </div>
  );
}
