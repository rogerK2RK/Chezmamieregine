// src/layouts/ClientLayout.jsx
import { Outlet } from 'react-router-dom';
import Header from '../components/client/Header/Header.jsx';
import Footer from '../components/shared/Footer/Footer.jsx';
import useScrollReveal from '../hooks/useScrollReveal.js';

export default function ClientLayout() {
  // Garantit que les éléments [data-reveal] sont révélés sur TOUTES les pages
  // client (pas seulement la home), sinon ils resteraient invisibles (opacity:0).
  useScrollReveal();

  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
}
