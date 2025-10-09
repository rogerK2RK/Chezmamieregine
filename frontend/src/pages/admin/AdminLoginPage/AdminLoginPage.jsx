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
      localStorage.getItem('adminRole') ||
      sessionStorage.getItem('adminRole');

    // autoriser admin, owner, superAdmin (ton middleware accepte ces 3 rôles)
    if (token && ['admin', 'owner', 'superAdmin'].includes(role)) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // 🔐 Appel login
      const res = await api.post('/admin/login', { email, password });

      // Selon ton controller, le payload peut être:
      // { token, role, name } OU { token, user: { role, name } }
      const token = res?.data?.token;
      const role  = res?.data?.role  || res?.data?.user?.role;
      const name  = res?.data?.name  || res?.data?.user?.name;

      if (!token || !role) {
        alert("Réponse de login inattendue (token/role manquant).");
        return;
      }

      // Vérif rôle autorisé pour la BO
      if (!['admin', 'owner', 'superAdmin'].includes(role)) {
        alert('Accès réservé aux administrateurs.');
        return;
      }

      // 🗄️ Stockage selon "Se souvenir de moi"
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem('adminToken', token);
      storage.setItem('adminRole',  role);
      if (name) storage.setItem('adminName', name);

      // (Optionnel) garder une copie en localStorage "persistante" si tu le souhaites
      // localStorage.setItem('adminToken', token);
      // localStorage.setItem('adminRole',  role);
      // if (name) localStorage.setItem('adminName', name);

      // ✅ Redirection BO
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
