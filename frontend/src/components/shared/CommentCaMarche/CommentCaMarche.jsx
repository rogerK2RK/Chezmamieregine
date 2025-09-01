import React from 'react';
import './CommentCaMarche.css';
import plat from './images/steak.png';
import commande from './images/client.png';
import livraison from './images/livraison-de-colis.png';

const CommentCaMarche = () => {
  const steps = [
    {
      title: "1. Choisis tes plats",
      subtitle: "Découvre nos recettes et sélectionne ce qui te fait envie.",
      icon: plat
    },
    {
      title: "2. Commande par téléphone",
      subtitle: "Appelle-nous, choisis la date et ton mode de paiement.",
      icon: commande
    },
    {
      title: "3. Reçois ta commande",
      subtitle: "Nous préparons avec soin et livrons à la date convenue.",
      icon: livraison
    }
  ];

  return (
    <div className="ccm-container">
      <h2 className="ccm-title">Comment ça marche</h2>
      
      <div className="ccm-grid">
        {steps.map((step, index) => (
          <div key={index} className="ccm-step">
            <div className="ccm-icon-wrapper">
              <div className="ccm-icon-circle">
                <img src={step.icon} alt={step.title} className="ccm-icon" />
              </div>
            </div>

            <h3 className="ccm-step-title">{step.title}</h3>
            <p className="ccm-step-subtitle">{step.subtitle}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentCaMarche;
