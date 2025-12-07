import React from "react";
import "./style.css";

export default function ContactForm() {
  return (
    <div className="contact-container">
      <h2>Contactez-nous</h2>

      <div className="contact-container-content">

        {/* Bloc Formulaire */}
        <div className="form-section">
          <form
            className="contact-form"
            onSubmit={(e) => e.preventDefault()}
            aria-label="Formulaire de contact"
          >
            <div className="form-row">
              {/* NOM */}
              <div className="form-group">
                <label htmlFor="contact-lastname">Nom</label>
                <input
                  id="contact-lastname"
                  aria-label="Entrer votre nom"
                  type="text"
                  name="nom"
                  placeholder="Votre nom"
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
                  name="prenom"
                  placeholder="Votre prénom"
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
                required
              />
            </div>

            {/* BOUTON */}
            <button
              className="btn-primary"
              aria-label="Envoyer le formulaire de contact"
            >
              Envoyer
            </button>
          </form>
        </div>

        {/* Bloc Carte (Lyon) */}
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
