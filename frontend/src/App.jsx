import AppRouter from './routes/AppRouter';
import { ClientAuthProvider } from './context/ClientAuthContext';
import { AdminAuthProvider } from './context/AdminAuthContext';

export default function App() {
  return (
    <ClientAuthProvider>
      <AdminAuthProvider>
        <AppRouter />
      </AdminAuthProvider>
    </ClientAuthProvider>
  );
}
