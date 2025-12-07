import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../services/api';
import EyeToggle from '../../../components/shared/ui/EyeToggle';
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
      localStorage.getItem('adminRole') ||
      sessionStorage.getItem('adminRole');

    if (token && ['admin', 'owner', 'superAdmin'].includes(role)) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/admin/login', { email, password });

      const token = res?.data?.token;
      const role  = res?.data?.role  || res?.data?.user?.role;
      const name  = res?.data?.name  || res?.data?.user?.name;

      if (!token || !role) {
        alert("Réponse de login inattendue (token/role manquant).");
        return;
      }

      if (!['admin', 'owner', 'superAdmin'].includes(role)) {
        alert('Accès réservé aux administrateurs.');
        return;
      }

      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem('adminToken', token);
      storage.setItem('adminRole',  role);
      if (name) storage.setItem('adminName', name);

      navigate('/admin/dashboard');
    } catch (err) {
      console.log('ADMIN LOGIN ERROR:', err.response?.status, err.response?.data);
      alert('Erreur de connexion admin');
    }
  };

  return (
    <main className="login-box-all">
      <div className="particles"></div>

      <form
        onSubmit={handleLogin}
        className="login-container"
        aria-label="Formulaire de connexion administrateur"
      >
        <img
          className="logo-back-connexion"
          src={logoCmr}
          alt="Logo de Chez Mamie Régine"
        />

        {/* Email */}
        <div className="form-group">
          <label htmlFor="admin-email" className="form-label">
            Identifiant
          </label>
          <input
            className="form-input"
            id="admin-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            aria-label="Adresse email administrateur"
            required
          />
        </div>

        {/* Mot de passe + œil */}
        <div className="form-group password-field" style={{ position: 'relative' }}>
          <label htmlFor="admin-password" className="form-label">
            Mot de passe
          </label>

          <input
            className="form-input"
            id="admin-password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mot de passe"
            aria-label="Mot de passe administrateur"
            required
          />

          {/* Bouton accessible pour afficher / masquer le mot de passe */}
          <button
            type="button"
            className="password-toggle-button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
            aria-pressed={showPassword}
          >
            <EyeToggle open={showPassword} onToggle={() => {}} />
          </button>
        </div>

        <button
          type="submit"
          className="login-button"
          aria-label="Se connecter à l’espace administrateur"
        >
          SE CONNECTER
        </button>

        {/* Se souvenir de moi */}
        <div className="form-row-remember">
          <label className="remember-label" htmlFor="remember-me">
            <input
              id="remember-me"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              aria-label="Se souvenir de ma connexion administrateur sur cet appareil"
            />
            <span>Se souvenir de moi</span>
          </label>

          <Link className="link-back">
            Mot de passe oublié
          </Link>
        </div>
      </form>
    </main>
  );
}
