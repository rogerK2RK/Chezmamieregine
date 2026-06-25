import { Outlet } from 'react-router-dom';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import CartDrawer from '../components/CartDrawer.jsx';
import useScrollReveal from '../hooks/useScrollReveal.js';

export default function ClientLayout() {
  useScrollReveal(); // révèle les [data-reveal] sur toutes les pages client
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
      <CartDrawer />
    </>
  );
}
