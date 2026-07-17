import { WA_CATERING, TEL_LINK, PHONE_DISPLAY } from '../config/contact.js';
import visuel from '../assets/img/cta.png';

const EV = [
  { t: 'Mariages', d: 'Un buffet malgache généreux pour le grand jour.', ic: 'favorite' },
  { t: 'Anniversaires', d: 'Petits comités ou grandes tablées, on s’adapte.', ic: 'cake' },
  { t: 'Baptêmes & familles', d: 'Des plats à partager pour réunir tout le monde.', ic: 'groups' },
  { t: 'Entreprises', d: 'Séminaires et repas d’équipe livrés clé en main.', ic: 'business_center' },
];

export default function Traiteur() {
  return (
    <section className="section traiteur" id="traiteur">
      <div className="traiteur-grid">
        <div className="traiteur-media" data-reveal="left">
          <img src={visuel} alt="Buffet traiteur malgache" />
          <span className="traiteur-badge">Devis gratuit</span>
        </div>
        <div>
          <span className="eyebrow" data-reveal>Traiteur &amp; événements</span>
          <h2 className="section-title" data-reveal style={{ '--reveal-delay': '.08s' }}>On régale vos grandes occasions</h2>
          <p className="lead" data-reveal style={{ '--reveal-delay': '.16s' }}>
            Du buffet intime au grand événement, on compose un menu malgache sur mesure,
            préparé maison et livré sur place.
          </p>
          <ul className="traiteur-list">
            {EV.map((e, i) => (
              <li className="traiteur-card" key={e.t} data-reveal style={{ '--reveal-delay': `${0.2 + i * 0.08}s` }}>
                <span className="material-symbols-outlined ic" aria-hidden="true">{e.ic}</span>
                <div><h3>{e.t}</h3><p>{e.d}</p></div>
              </li>
            ))}
          </ul>
          <div className="cta-stack cta-stack--start" data-reveal style={{ '--reveal-delay': '.5s' }}>
            <a className="btn-primary" href={WA_CATERING} target="_blank" rel="noopener noreferrer">Demander un devis</a>
            <span className="cta-or">ou</span>
            <a className="phone" href={TEL_LINK}>{PHONE_DISPLAY}</a>
          </div>
        </div>
      </div>
    </section>
  );
}
