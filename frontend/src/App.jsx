import AppRouter from './routes/AppRouter';
import { ClientAuthProvider } from './context/ClientAuthContext';
import { AdminAuthProvider } from './context/AdminAuthContext'; // si tu l’utilises aussi

export default function App() {
  return (
    <ClientAuthProvider>
      <AdminAuthProvider>
        <AppRouter />
      </AdminAuthProvider>
    </ClientAuthProvider>
  );
}
