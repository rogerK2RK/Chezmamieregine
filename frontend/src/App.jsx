import AppRouter from './routes/AppRouter.jsx';
import { ClientAuthProvider } from './context/ClientAuthContext.jsx';
import { AdminAuthProvider } from './context/AdminAuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';

export default function App() {
  return (
    <ClientAuthProvider>
      <AdminAuthProvider>
        <CartProvider>
          <AppRouter />
        </CartProvider>
      </AdminAuthProvider>
    </ClientAuthProvider>
  );
}
