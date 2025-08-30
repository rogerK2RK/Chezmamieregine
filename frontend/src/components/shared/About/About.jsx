import './About.css';
import imageapropos from "./images/Apropos.png";

export default function ImageTextSlider() {

  return (
    <div className="section-container">
      <div className="section-image">
        <img
          src={imageapropos}
          alt="Illustration"
        />
      </div>

      {/* Texte droite */}
      <div className="section-text">
        <h2>À Propos</h2>
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
        <button className="btn-primary">Découvrir le menu</button>
      </div>
    </div>
  );
}
