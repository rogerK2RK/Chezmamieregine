import { Routes, Route } from 'react-router-dom';
import ClientLayout from '../layouts/ClientLayout.jsx';
import AdminLayout from '../layouts/AdminLayout.jsx';
import PrivateRoute from './PrivateRoute.jsx';

import HomePage from '../pages/HomePage.jsx';
import ProductsPage from '../pages/ProductsPage.jsx';
import ProductDetailPage from '../pages/ProductDetailPage.jsx';
import ContactPage from '../pages/ContactPage.jsx';
import LoginPage from '../pages/LoginPage.jsx';
import RegisterPage from '../pages/RegisterPage.jsx';
import AccountPage from '../pages/AccountPage.jsx';
import ErrorPage from '../pages/ErrorPage.jsx';

import AdminLogin from '../pages/admin/AdminLogin.jsx';
import AdminDashboard from '../pages/admin/AdminDashboard.jsx';
import AdminPlats from '../pages/admin/AdminPlats.jsx';
import AdminPlatForm from '../pages/admin/AdminPlatForm.jsx';
import AdminCategories from '../pages/admin/AdminCategories.jsx';
import AdminComments from '../pages/admin/AdminComments.jsx';
import AdminContacts from '../pages/admin/AdminContacts.jsx';

const ROLES = ['admin', 'owner', 'superAdmin'];

export default function AppRouter() {
  return (
    <Routes>
      {/* Public */}
      <Route element={<ClientLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/produits" element={<ProductsPage />} />
        <Route path="/produits/:slug" element={<ProductsPage />} />
        <Route path="/produit/:id" element={<ProductDetailPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/connexion" element={<LoginPage />} />
        <Route path="/inscription" element={<RegisterPage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="*" element={<ErrorPage />} />
      </Route>

      {/* Admin */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route element={<PrivateRoute roles={ROLES}><AdminLayout /></PrivateRoute>}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/plats" element={<AdminPlats />} />
        <Route path="/admin/plats/new" element={<AdminPlatForm />} />
        <Route path="/admin/plats/:id/edit" element={<AdminPlatForm />} />
        <Route path="/admin/categories" element={<AdminCategories />} />
        <Route path="/admin/comments" element={<AdminComments />} />
        <Route path="/admin/contacts" element={<AdminContacts />} />
      </Route>
    </Routes>
  );
}
