import { Link } from 'react-router-dom';
import about from '../assets/img/about.jpg';

export default function About() {
  return (
    <section className="section">
      <div className="about-grid">
        <div className="about-media" data-reveal="left">
          <img src={about} alt="Chez Mamie Régine" />
        </div>
        <div className="about-text">
          <span className="eyebrow" data-reveal>Notre histoire</span>
          <h2 className="section-title" data-reveal style={{ '--reveal-delay': '.08s' }}>
            Une cuisine <span className="accent-serif">faite avec le cœur</span>
          </h2>
          <p data-reveal style={{ '--reveal-delay': '.16s' }}>
            Tout commence dans la cuisine d'une grand-mère passionnée. Chaque plat est
            préparé maison, comme à Madagascar, pour vous faire voyager dès la première bouchée.
          </p>
          <p data-reveal style={{ '--reveal-delay': '.24s' }}>
            Ravitoto, romazava, tilapia grillé… des recettes traditionnelles mijotées avec
            des produits frais et des épices choisies avec soin.
          </p>
          <div data-reveal style={{ '--reveal-delay': '.32s' }}>
            <Link to="/categories" className="btn-primary">Découvrir le menu</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
