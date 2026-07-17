import { useState } from 'react';
import api from '../services/api.js';
import { WA_ORDER, TEL_LINK, PHONE_DISPLAY, EMAIL, CITY } from '../config/contact.js';

const empty = { firstName: '', lastName: '', email: '', phone: '', message: '' };

export default function ContactForm({ heading = 'h2' }) {
  const H = heading;
  const [form, setForm] = useState(empty);
  const [ok, setOk] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const change = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  const submit = async (e) => {
    e.preventDefault(); setOk(''); setErr(''); setLoading(true);
    try {
      await api.post('/public/contact', form);
      setOk('Message envoyé. Nous vous répondrons rapidement.');
      setForm(empty);
    } catch (e2) {
      setErr(e2?.response?.data?.message || "Erreur lors de l'envoi.");
    } finally { setLoading(false); }
  };

  return (
    <section className="section">
      <div className="section-head">
        <span className="eyebrow" data-reveal>Une question ?</span>
        <H className="section-title" data-reveal style={{ '--reveal-delay': '.08s' }}>Contactez-nous</H>
        <p data-reveal style={{ '--reveal-delay': '.12s', color: 'var(--color-text-muted)' }}>
          Pour commander, le plus rapide reste WhatsApp ou le téléphone.
        </p>
      </div>

      <div className="contact-channels" data-reveal>
        <a className="channel" href={WA_ORDER} target="_blank" rel="noopener noreferrer">
          <span className="material-symbols-outlined ic" aria-hidden="true">chat</span><span><strong>WhatsApp</strong><span>Réponse rapide</span></span>
        </a>
        <a className="channel" href={TEL_LINK}>
          <span className="material-symbols-outlined ic" aria-hidden="true">call</span><span><strong>Téléphone</strong><span>{PHONE_DISPLAY}</span></span>
        </a>
        <a className="channel" href={`mailto:${EMAIL}`}>
          <span className="material-symbols-outlined ic" aria-hidden="true">mail</span><span><strong>Email</strong><span>Nous écrire</span></span>
        </a>
      </div>

      <div className="contact-grid">
        <form className="form-card" onSubmit={submit} data-reveal="right">
          {ok && <p className="alert ok">{ok}</p>}
          {err && <p className="alert err">{err}</p>}
          <div className="form-row">
            <div className="field"><label>Nom</label><input name="lastName" value={form.lastName} onChange={change} placeholder="Votre nom" required /></div>
            <div className="field"><label>Prénom</label><input name="firstName" value={form.firstName} onChange={change} placeholder="Votre prénom" required /></div>
          </div>
          <div className="field"><label>Email</label><input type="email" name="email" value={form.email} onChange={change} placeholder="vous@email.com" required /></div>
          <div className="field"><label>Téléphone</label><input name="phone" value={form.phone} onChange={change} placeholder="07 61 13 73 11" /></div>
          <div className="field"><label>Message</label><textarea name="message" value={form.message} onChange={change} placeholder="Dites-nous tout : plats souhaités, date, nombre de personnes…" required /></div>
          <button className="btn-primary" disabled={loading} style={{ width: '100%' }}>{loading ? 'Envoi…' : 'Envoyer'}</button>
        </form>

        <div className="map-wrap" data-reveal="left">
          <iframe
            title={`Carte — ${CITY}`}
            src={`https://maps.google.com/maps?q=${encodeURIComponent(CITY)}&z=12&output=embed`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  );
}
