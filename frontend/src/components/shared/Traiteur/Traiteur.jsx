import './style.css';
import { WA_CATERING, TEL_LINK, PHONE_DISPLAY } from '../../../config/contact.js';
import visuel from '../CTA/images/cta.png';

const EVENTS = [
  {
    title: 'Mariages',
    desc: 'Un buffet malgache généreux pour le plus beau jour.',
    icon: (
      <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 21s-7-4.35-7-10a4 4 0 0 1 7-2.65A4 4 0 0 1 19 11c0 5.65-7 10-7 10z" />
      </svg>
    ),
  },
  {
    title: 'Anniversaires',
    desc: 'Petits comités ou grandes tablées, on s’adapte.',
    icon: (
      <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 21h16v-7H4z" />
        <path d="M4 14a3 3 0 0 0 4 0 3 3 0 0 0 4 0 3 3 0 0 0 4 0 3 3 0 0 0 4 0" />
        <path d="M12 7v3M8 8v2M16 8v2" />
        <circle cx="12" cy="5" r="1" />
      </svg>
    ),
  },
  {
    title: 'Baptêmes & familles',
    desc: 'Des plats à partager pour réunir tout le monde.',
    icon: (
      <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="8" r="3" />
        <circle cx="17" cy="9" r="2.2" />
        <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
        <path d="M15.5 20c0-2.4 1.4-4.4 3.5-5" />
      </svg>
    ),
  },
  {
    title: 'Entreprises',
    desc: 'Séminaires, pots et repas d’équipe livrés clé en main.',
    icon: (
      <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21h18" />
        <path d="M5 21V7l8-4v18" />
        <path d="M19 21V11l-6-3" />
        <path d="M9 9h.01M9 12h.01M9 15h.01" />
      </svg>
    ),
  },
];

export default function Traiteur() {
  return (
    <section className="traiteur" id="traiteur">
      <div className="traiteur-inner">
        <div className="traiteur-media" data-reveal="left">
          <img src={visuel} alt="Buffet traiteur malgache" />
          <div className="traiteur-badge">Devis gratuit</div>
        </div>

        <div className="traiteur-content">
          <span className="section-eyebrow" data-reveal>Traiteur &amp; événements</span>
          <h2 className="section-title" data-reveal style={{ '--reveal-delay': '0.08s' }}>
            On régale vos grandes occasions
          </h2>
          <p className="traiteur-lead" data-reveal style={{ '--reveal-delay': '0.16s' }}>
            Du buffet intime au grand événement, Chez Mamie Régine compose un
            menu malgache sur mesure, préparé maison et livré sur place.
          </p>

          <ul className="traiteur-grid">
            {EVENTS.map((ev, i) => (
              <li
                className="traiteur-card"
                key={ev.title}
                data-reveal
                style={{ '--reveal-delay': `${0.24 + i * 0.08}s` }}
              >
                <span className="traiteur-icon" aria-hidden="true">{ev.icon}</span>
                <div>
                  <h3>{ev.title}</h3>
                  <p>{ev.desc}</p>
                </div>
              </li>
            ))}
          </ul>

          <div className="traiteur-actions" data-reveal style={{ '--reveal-delay': '0.5s' }}>
            <a className="btn-primary" href={WA_CATERING} target="_blank" rel="noopener noreferrer">
              Demander un devis
            </a>
            <a className="traiteur-phone" href={TEL_LINK}>ou {PHONE_DISPLAY}</a>
          </div>
        </div>
      </div>
    </section>
  );
}
