import React from 'react';
import './style.css';
import { WA_ORDER, TEL_LINK, PHONE_DISPLAY } from '../../../config/contact.js';
import plat from './images/steak.png';
import commande from './images/client.png';
import livraison from './images/livraison-de-colis.png';

const CommentCaMarche = () => {
  const steps = [
    {
      num: "01",
      title: "Choisis tes plats",
      subtitle: "Découvre nos recettes et sélectionne ce qui te fait envie.",
      icon: plat
    },
    {
      num: "02",
      title: "Commande par appel ou WhatsApp",
      subtitle: "Écris-nous ou appelle-nous, choisis la date et le mode de paiement.",
      icon: commande
    },
    {
      num: "03",
      title: "Reçois ta commande",
      subtitle: "Nous préparons avec soin et livrons à la date convenue.",
      icon: livraison
    }
  ];

  return (
    <div className="ccm-container">
      <div className="section-head" data-reveal>
        <span className="section-eyebrow">Simple &amp; rapide</span>
        <h2 className="section-title">Comment ça marche</h2>
      </div>

      <div className="ccm-grid">
        {steps.map((step, index) => (
          <div
            key={index}
            className="ccm-step"
            data-reveal
            style={{ '--reveal-delay': `${index * 0.12}s` }}
          >
            <span className="ccm-step-num" aria-hidden="true">{step.num}</span>
            <div className="ccm-icon-wrapper">
              <img src={step.icon} alt="" className="ccm-icon" />
            </div>

            <h3 className="ccm-step-title">{step.title}</h3>
            <p className="ccm-step-subtitle">{step.subtitle}</p>
          </div>
        ))}
      </div>

      <div className="ccm-cta" data-reveal>
        <a className="btn-primary" href={WA_ORDER} target="_blank" rel="noopener noreferrer">
          Commander sur WhatsApp
        </a>
        <a className="ccm-cta-phone" href={TEL_LINK}>ou {PHONE_DISPLAY}</a>
      </div>
    </div>
  );
};

export default CommentCaMarche;
