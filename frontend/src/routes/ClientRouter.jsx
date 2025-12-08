import { Routes, Route } from 'react-router-dom';
import HomePage from '../pages/client/HomePage';
import LoginPage from '../pages/client/LoginPage';
import RegisterPage from '../pages/client/RegisterPage';
import ContactPage from '../pages/client/ContactPage';
import AccountPage from './pages/account/AccountPage';
import ErrorPage from '../pages/client/ErrorPage';

export default function ClientRouter() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/connexion" element={<LoginPage />} />
      <Route path="/inscription" element={<RegisterPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/account" element={<AccountPage />} />
      <Route path="/*" element={<ErrorPage />} />
    </Routes>
  );
}
