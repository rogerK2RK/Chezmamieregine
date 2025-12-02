import React, { useEffect } from 'react';
import LoginForm from '../../components/shared/LoginForm/LoginForm.jsx';

export default function LoginPage() {

  useEffect(() => {
    // ---- MÉTADONNÉES ----
    document.title = "Connexion | Chez Mamie Régine";

    // Meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        "content",
        "Connectez-vous à votre espace client Chez Mamie Régine pour suivre vos commandes et profiter d’une expérience personnalisée."
      );
    } else {
      const m = document.createElement('meta');
      m.name = "description";
      m.content =
        "Connectez-vous à votre espace client Chez Mamie Régine pour suivre vos commandes et profiter d’une expérience personnalisée.";
      document.head.appendChild(m);
    }

    // Meta robots
    const metaRobots = document.querySelector('meta[name="robots"]');
    if (metaRobots) {
      metaRobots.setAttribute("content", "index, follow");
    } else {
      const r = document.createElement('meta');
      r.name = "robots";
      r.content = "index, follow";
      document.head.appendChild(r);
    }
  }, []);

  return (
    <main>
      <LoginForm />
    </main>
  );
}
