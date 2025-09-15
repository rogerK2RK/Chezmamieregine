import { Routes, Route } from 'react-router-dom';
import HomePage from '../pages/client/HomePage';
import LoginPage from '../pages/client/LoginPage';
import RegisterPage from '../pages/client/RegisterPage';
import ContactPage from '../pages/client/ContactPage';
// import PrivateRoute from './PrivateRoute'; ← à ajouter si tu sécurises des pages client
// import { ROLES } from '../utils/roles';   ← utile plus tard si rôle client est vérifié

// Ce routeur gère les routes accessibles aux visiteurs ou clients
export default function ClientRouter() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/connexion" element={<LoginPage />} />
      <Route path="/inscription" element={<RegisterPage />} />
      <Route path="/contact" element={<ContactPage />} />

      {/* Exemple pour plus tard : page réservée aux clients */}
      {/*
      <Route
        path="/mon-compte"
        element={
          <PrivateRoute allowedRoles={[ROLES.CLIENT]}>
            <CompteClient />
          </PrivateRoute>
        }
      />
      */}
    </Routes>
  );
}
