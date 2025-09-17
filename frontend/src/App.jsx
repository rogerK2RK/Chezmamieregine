import { BrowserRouter } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

import Header from './components/shared/Header/Header';
import Footer from './components/shared/Footer/Footer';
import AppRouter from './routes/AppRouter';

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin')

  return (
    <>
    {!isAdminRoute && <Header />}
      {/* <Header /> */}
      <AppRouter />
      {!isAdminRoute && <Footer />}
      {/* <Footer /> */}
    </>
  );
}

export default App;
