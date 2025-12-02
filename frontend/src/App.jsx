// src/App.jsx
import AppRouter from './routes/AppRouter';
import { ClientAuthProvider } from './context/ClientAuthContext';
import { AdminAuthProvider } from './context/AdminAuthContext';
import { Helmet } from 'react-helmet-async';

function AppLayout({ children }) {
  const siteUrl = 'https://chezmamieregine.vercel.app';

  return (
    <>
      <Helmet>
        <title>Chez Mamie Régine — Cuisine malagasy faite maison</title>
        <meta
          name="description"
          content="Commandez des plats malagasy faits maison, préparés avec amour, en livraison ou à emporter."
        />
        <link rel="canonical" href={siteUrl} />

        {/* Open Graph / réseaux */}
        <meta property="og:site_name" content="Chez Mamie Régine" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Chez Mamie Régine — Cuisine malagasy faite maison" />
        <meta
          property="og:description"
          content="Spécialités malagasy, plats mijotés, street-food et desserts maison."
        />
        <meta property="og:image" content={`${siteUrl}/og-default.jpg`} />

        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      {children}
    </>
  );
}

export default function App() {
  return (
    <ClientAuthProvider>
      <AdminAuthProvider>
        <AppLayout>
          <AppRouter />
        </AppLayout>
      </AdminAuthProvider>
    </ClientAuthProvider>
  );
}
