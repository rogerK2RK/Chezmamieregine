import './style.css';
import { Link } from 'react-router-dom';
import imageapropos from "./images/Apropos.png";

export default function ImageTextSlider() {
  return (
    <div className="section-container-all">
      <h2>À Propos</h2>
      <div className="section-container">
        <div className="section-image">
          <img
            src={imageapropos}
            alt="Lola et Régine à la RNS 2025"
          />
        </div>

        {/* Texte droite */}
        <div className="section-text">
          
          <p>
            Découvrez nos plats faits maison, préparés avec passion et livrés
            directement chez vous. Une cuisine authentique, inspirée des saveurs
            malgaches, pour partager des moments uniques.
          </p>
          <p>
            Découvrez nos plats faits maison, préparés avec passion et livrés
            directement chez vous. Une cuisine authentique, inspirée des saveurs
            malgaches, pour partager des moments uniques.
          </p>
          <p>
            Découvrez nos plats faits maison, préparés avec passion et livrés
            directement chez vous. Une cuisine authentique, inspirée des saveurs
            malgaches, pour partager des moments uniques.
          </p>
          <Link to="/produits" className="btn-primary">Découvrir le menu</Link>
        </div>
      </div>
    </div>
  );
}
