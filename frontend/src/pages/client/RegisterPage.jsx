import React, { useEffect } from 'react';
import RegisterForm from '../../components/client/RegisterForm/RegisterForm.jsx';

export default function RegisterPage() {
  
  useEffect(() => {
    // META TITLE
    document.title = "Inscription – Chez Mamie Régine";

    // META DESCRIPTION
    let metaDesc = document.querySelector("meta[name='description']");
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.setAttribute("name", "description");
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute(
      "content",
      "Créez votre compte Chez Mamie Régine pour commander vos plats malgaches faits maison. Inscription simple et rapide."
    );
  }, []);

  return (
    <main>
      <RegisterForm />
    </main>
  );
}
