import { WA_ORDER } from '../config/contact.js';

const STEPS = [
  {
    n: '01', t: 'Choisis tes plats',
    d: 'Parcours notre carte de spécialités malgaches faites maison : plats mijotés, encas salés, douceurs et boissons. Ajoute au panier ce qui te fait envie, seul ou pour toute la famille.',
  },
  {
    n: '02', t: 'Commande par appel ou WhatsApp',
    d: 'Envoie ton panier en un message WhatsApp ou appelle-nous directement. On confirme ensemble les quantités, la date, l’adresse de livraison et le mode de paiement. Aucun paiement en ligne.',
  },
  {
    n: '03', t: 'Reçois ta commande',
    d: 'On cuisine tout maison, avec des produits frais, et on te livre à la date convenue sur Lyon et alentours. Il ne te reste plus qu’à te régaler comme à Madagascar.',
  },
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
      <div className="cta-stack">
        <a className="btn-primary" href={WA_ORDER} target="_blank" rel="noopener noreferrer">Commander sur WhatsApp</a>
      </div>
    </section>
  );
}
