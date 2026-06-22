import React from 'react';
import './style.css';
import ctaImage from './images/cta.png';
import { WA_ORDER, TEL_LINK, PHONE_DISPLAY } from '../../../config/contact.js';

const Cta = () => {
  return (
    <div className="cta-container">
      <div className="box">
        <div className="cta-content" data-reveal="right">
          <span className="cta-eyebrow">Sur commande</span>
          <p className="title">
            Envie d'un voyage culinaire à Madagascar ?
          </p>
          <p className="subtitle">
            Passez commande en un message : on prépare tout maison et on vous
            livre. Réponse rapide, du lundi au dimanche.
          </p>
          <div className="cta-actions">
            <a className="btn-cta" href={WA_ORDER} target="_blank" rel="noopener noreferrer">
              Commander sur WhatsApp
            </a>
            <a className="cta-phone" href={TEL_LINK}>ou {PHONE_DISPLAY}</a>
          </div>
        </div>

        <div className="cta-image" data-reveal="left">
          <img src={ctaImage} alt="Plat malgache fait maison" />
        </div>
      </div>
    </div>
  );
};

export default Cta;
