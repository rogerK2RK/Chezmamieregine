import React, { useState } from "react";
import api from "../../../services/api"; // 👈 même instance que pour /public/plats
import { WA_ORDER, TEL_LINK, PHONE_DISPLAY, EMAIL } from "../../../config/contact.js";
import "./style.css";

export default function ContactForm({ isPageContact = false }) {
  const TitleTag = isPageContact ? "h1" : "h2";

  const [form, setForm] = useState({
    lastName: "",
    firstName: "",
    email: "",
    phone: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState("");
  const [err, setErr] = useState("");
  const [mapActive, setMapActive] = useState(false); // interaction carte au clic

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setOk("");
    setErr("");
    setLoading(true);

    try {
      await api.post("/public/contact", {
        lastName: form.lastName,
        firstName: form.firstName,
        email: form.email,
        phone: form.phone,
        message: form.message,
      });

      setOk("Votre message a bien été envoyé. Nous vous répondrons rapidement.");
      setForm({
        lastName: "",
        firstName: "",
        email: "",
        phone: "",
        message: "",
      });
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        "Une erreur est survenue lors de l'envoi du message.";
      setErr(msg);
      console.error("[CONTACT ERROR]", error?.response?.data || error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-container">
      <div className="section-head" data-reveal>
        <span className="section-eyebrow">Une question ?</span>
        <TitleTag className="section-title">Contactez-nous</TitleTag>
        <p className="contact-intro">
          Pour commander, le plus rapide reste WhatsApp ou le téléphone.
          Pour tout le reste, écrivez-nous ci-dessous.
        </p>
      </div>

      <div className="contact-channels" data-reveal>
        <a className="contact-channel" href={WA_ORDER} target="_blank" rel="noopener noreferrer">
          <span className="contact-channel-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.945C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 018.413 3.488 11.82 11.82 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zM6.597 20.13c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.51 5.26l-.999 3.648 3.978-1.045zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.148-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" /></svg>
          </span>
          <span className="contact-channel-text">
            <strong>WhatsApp</strong>
            <span>Réponse rapide</span>
          </span>
        </a>

        <a className="contact-channel" href={TEL_LINK}>
          <span className="contact-channel-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
          </span>
          <span className="contact-channel-text">
            <strong>Téléphone</strong>
            <span>{PHONE_DISPLAY}</span>
          </span>
        </a>

        <a className="contact-channel" href={`mailto:${EMAIL}`}>
          <span className="contact-channel-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>
          </span>
          <span className="contact-channel-text">
            <strong>Email</strong>
            <span>Nous écrire</span>
          </span>
        </a>
      </div>

      <div className="contact-container-content">
        {/* Bloc Formulaire */}
        <div className="form-section" data-reveal="right">
          <form
            className="contact-form"
            onSubmit={handleSubmit}
            aria-label="Formulaire de contact"
          >
            {/* Messages globaux */}
            {ok && <p className="contact-success">{ok}</p>}
            {err && <p className="contact-error">{err}</p>}

            <div className="form-row">
              {/* NOM */}
              <div className="form-group">
                <label htmlFor="contact-lastname">Nom</label>
                <input
                  id="contact-lastname"
                  aria-label="Entrer votre nom"
                  type="text"
                  name="lastName"
                  placeholder="Votre nom"
                  value={form.lastName}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* PRÉNOM */}
              <div className="form-group">
                <label htmlFor="contact-firstname">Prénom</label>
                <input
                  id="contact-firstname"
                  aria-label="Entrer votre prénom"
                  type="text"
                  name="firstName"
                  placeholder="Votre prénom"
                  value={form.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* EMAIL */}
            <div className="form-group">
              <label htmlFor="contact-email">Email</label>
              <input
                id="contact-email"
                aria-label="Entrer votre adresse email"
                type="email"
                name="email"
                placeholder="exemple@mail.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* TÉLÉPHONE */}
            <div className="form-group">
              <label htmlFor="contact-phone">Numéro</label>
              <input
                id="contact-phone"
                aria-label="Entrer votre numéro de téléphone"
                type="tel"
                name="phone"
                placeholder="06 12 34 56 78"
                value={form.phone}
                onChange={handleChange}
                required
              />
            </div>

            {/* MESSAGE */}
            <div className="form-group">
              <label htmlFor="contact-message">Message</label>
              <textarea
                id="contact-message"
                aria-label="Entrer votre message"
                name="message"
                rows="6"
                placeholder="Votre message..."
                value={form.message}
                onChange={handleChange}
                required
              />
            </div>

            {/* BOUTON */}
            <button
              className="btn-primary"
              type="submit"
              aria-label="Envoyer le formulaire de contact"
              disabled={loading}
            >
              {loading ? "Envoi..." : "Envoyer"}
            </button>
          </form>
        </div>

        {/* Bloc Carte */}
        <div className="map-section" data-reveal="left">
          <div
            className="map-wrapper"
            onMouseLeave={() => setMapActive(false)}
          >
            <iframe
              title="Carte de Lyon"
              aria-label="Localisation de Lyon sur une carte interactive"
              className="map-frame"
              src="https://www.openstreetmap.org/export/embed.html?bbox=4.793%2C45.65%2C4.95%2C45.80&layer=mapnik&marker=45.7640%2C4.8357"
              style={{ border: 0, pointerEvents: mapActive ? "auto" : "none" }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />

            {!mapActive && (
              <button
                type="button"
                className="map-overlay"
                onClick={() => setMapActive(true)}
                aria-label="Activer l'interaction avec la carte"
              >
                <span>Cliquer pour interagir</span>
              </button>
            )}

            <a
              href="https://www.openstreetmap.org/?mlat=45.7640&mlon=4.8357#map=12/45.7640/4.8357"
              target="_blank"
              rel="noreferrer"
              className="map-link"
              aria-label="Ouvrir la carte de Lyon en plein écran"
            >
              Voir en plein écran
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
