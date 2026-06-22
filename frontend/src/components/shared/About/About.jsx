import './style.css';
import { Link } from 'react-router-dom';
import imageapropos from "./images/Apropos.jpg";

export default function ImageTextSlider() {
  return (
    <section className="section-container-all">
      <div className="section-container">
        <div className="section-image" data-reveal="left">
          <img
            src={imageapropos}
            alt="Lola et Régine à la RNS 2025"
          />
        </div>

        {/* Texte */}
        <div className="section-text">
          <span className="section-eyebrow" data-reveal>Notre histoire</span>
          <h2 className="section-title" data-reveal style={{ '--reveal-delay': '0.08s' }}>
            Une cuisine malgache, faite maison avec le cœur
          </h2>

          <p data-reveal style={{ '--reveal-delay': '0.16s' }}>
            Chez Mamie Régine, tout commence dans la cuisine d'une grand-mère
            passionnée. Chaque plat est préparé maison, comme à Madagascar, pour
            vous faire voyager dès la première bouchée.
          </p>
          <p data-reveal style={{ '--reveal-delay': '0.24s' }}>
            Ravitoto, romazava, tilapia grillé… nos recettes traditionnelles sont
            mijotées avec des produits frais du marché et des épices choisies
            avec soin.
          </p>
          <p data-reveal style={{ '--reveal-delay': '0.32s' }}>
            Commandez en quelques clics et faites-vous livrer à Lyon, ou venez
            simplement partager un moment chaleureux autour de nos saveurs.
          </p>

          <Link to="/produits" className="btn-primary" data-reveal style={{ '--reveal-delay': '0.4s' }}>
            Découvrir le menu
          </Link>
        </div>
      </div>
    </section>
  );
}
