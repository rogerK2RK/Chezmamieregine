import React from 'react';
import { Link } from 'react-router-dom';
import './style.css';
import ctaImage from './images/cta.png';

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
            Des plats faits maison, préparés avec des produits frais et des
            épices choisies avec soin.
          </p>
          <Link to="/produits" className="btn-cta">Voir nos plats</Link>
        </div>

        <div className="cta-image" data-reveal="left">
          <img src={ctaImage} alt="Plat malgache fait maison" />
        </div>
      </div>
    </div>
  );
};

export default Cta;
