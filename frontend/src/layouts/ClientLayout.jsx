// src/layouts/ClientLayout.jsx
import { Outlet } from 'react-router-dom';
import Header from '../components/shared/Header/Header.jsx';
import Footer from '../components/shared/Footer/Footer.jsx';

export default function ClientLayout() {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
}
