import React, { useState } from "react";
import api from "../../../services/api"; // 👈 même instance que pour /public/plats
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
      <TitleTag>Contactez-nous</TitleTag>

      <div className="contact-container-content">
        {/* Bloc Formulaire */}
        <div className="form-section">
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
        <div className="map-section">
          <div className="map-wrapper">
            <iframe
              title="Carte de Lyon"
              aria-label="Localisation de Lyon sur une carte interactive"
              className="map-frame"
              src="https://www.openstreetmap.org/export/embed.html?bbox=4.793%2C45.65%2C4.95%2C45.80&layer=mapnik&marker=45.7640%2C4.8357"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />

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
