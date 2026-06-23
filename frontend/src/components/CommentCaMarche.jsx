import { WA_ORDER, TEL_LINK, PHONE_DISPLAY } from '../config/contact.js';

const STEPS = [
  { n: '01', t: 'Choisis tes plats', d: 'Découvre nos recettes et sélectionne ce qui te fait envie.' },
  { n: '02', t: 'Commande appel / WhatsApp', d: 'Écris-nous ou appelle-nous, choisis la date et le paiement.' },
  { n: '03', t: 'Reçois ta commande', d: 'On prépare avec soin et on livre à la date convenue.' },
];

export default function CommentCaMarche() {
  return (
    <section className="section" style={{ background: 'var(--color-surface)' }}>
      <div className="section-head">
        <span className="eyebrow" data-reveal>Simple &amp; rapide</span>
        <h2 className="section-title" data-reveal style={{ '--reveal-delay': '.08s' }}>Comment ça marche</h2>
      </div>
      <div className="steps">
        {STEPS.map((s, i) => (
          <div className="step" key={s.n} data-reveal style={{ '--reveal-delay': `${i * 0.1}s` }}>
            <span className="num">{s.n}</span>
            <h3>{s.t}</h3>
            <p>{s.d}</p>
          </div>
        ))}
      </div>
      <div className="steps-cta">
        <a className="btn-primary" href={WA_ORDER} target="_blank" rel="noopener noreferrer">Commander sur WhatsApp</a>
        <a className="phone" href={TEL_LINK}>ou {PHONE_DISPLAY}</a>
      </div>
    </section>
  );
}
