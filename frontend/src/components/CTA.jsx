import { WA_ORDER } from '../config/contact.js';
import img from '../assets/img/cta.png';

export default function CTA() {
  return (
    <section className="cta">
      <div className="cta-box" data-reveal>
        <div className="cta-content">
          <span className="eyebrow" style={{ color: '#fff' }}>Sur commande</span>
          <h2>Envie d'un voyage culinaire&nbsp;?</h2>
          <p>Passez commande en un message : on prépare tout maison et on vous livre. Réponse rapide, 7j/7.</p>
          <div className="cta-stack cta-stack--start">
            <a className="btn-primary" href={WA_ORDER} target="_blank" rel="noopener noreferrer">Commander sur WhatsApp</a>
          </div>
        </div>
        <div className="cta-img"><img src={img} alt="Plat malgache" /></div>
      </div>
    </section>
  );
}
