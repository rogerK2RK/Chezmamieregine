import ClientRouter from './ClientRouter';
import AdminRouter from './AdminRouter';

export default function AppRouter() {
  return (
    <>
      <ClientRouter />
      <AdminRouter />
    </>
  );
}
