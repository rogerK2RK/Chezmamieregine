// frontend/src/pages/LoginPage/LoginPage.jsx (ou équivalent)
import React, { useEffect } from 'react';
import LoginForm from '../../components/shared/LoginForm/LoginForm.jsx';

export default function LoginPage() {
  useEffect(() => {
    console.log('LoginPage useEffect META'); // 🔍 pour vérifier que ça se déclenche

    // Title
    document.title = 'Connexion | Chez Mamie Régine';

    // Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute(
      'content',
      "Connectez-vous à votre espace client Chez Mamie Régine pour suivre vos commandes et gérer votre compte."
    );

    // (optionnel) robots
    let metaRobots = document.querySelector('meta[name="robots"]');
    if (!metaRobots) {
      metaRobots = document.createElement('meta');
      metaRobots.name = 'robots';
      document.head.appendChild(metaRobots);
    }
    metaRobots.setAttribute('content', 'noindex, nofollow');
  }, []);

  return (
    <main>
      <LoginForm />
    </main>
  );
}
