import React from 'react';
import { Link } from 'react-router-dom';
import './style.css';
import ctaImage from './images/cta.png';

const Cta = () => {
  return (
    <div className="cta-container">
      <div className="box">
        <div className="cta-content">
          <p className="title">
            Lorem ipsom<br /> doloresd sit amet
          </p>
          <p className="subtitle">cuisinées avec amour</p>
          <Link to="/produits" className="btn-primary scrolled">Nous rejoindres</Link>
        </div>

        <div className="cta-image">
          <img src={ctaImage} alt="image de cuisinière" />
        </div>
      </div>
    </div>
  );
};

export default Cta;
