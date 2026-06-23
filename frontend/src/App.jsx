import AppRouter from './routes/AppRouter.jsx';
import { ClientAuthProvider } from './context/ClientAuthContext.jsx';
import { AdminAuthProvider } from './context/AdminAuthContext.jsx';

export default function App() {
  return (
    <ClientAuthProvider>
      <AdminAuthProvider>
        <AppRouter />
      </AdminAuthProvider>
    </ClientAuthProvider>
  );
}
