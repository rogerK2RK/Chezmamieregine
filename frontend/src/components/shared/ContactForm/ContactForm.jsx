import React from "react";
import "./ContactForm.css";

export default function ContactForm() {
  return (
    <div className="contact-container">
      <h2>Contactez-nous</h2>

      <div className="contact-container-content">
        {/* Bloc Formulaire */}
        <div className="form-section">
          <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
            <div className="form-row">
              <div className="form-group">
                <label>Nom</label>
                <input type="text" name="nom" placeholder="Votre nom" required />
              </div>

              <div className="form-group">
                <label>Prénom</label>
                <input type="text" name="prenom" placeholder="Votre prénom" required />
              </div>
            </div>

            <div className="form-group">
              <label>Email</label>
              <input type="email" name="email" placeholder="exemple@mail.com" required />
            </div>

            <div className="form-group">
              <label>Numéro</label>
              <input type="tel" name="phone" placeholder="06 12 34 56 78" required />
            </div>

            <div className="form-group">
              <label>Message</label>
              <textarea name="message" rows="6" placeholder="Votre message..." required />
            </div>

            <button 
            // type="submit" 
            className="btn-primary">Envoyer</button>
          </form>
        </div>

        {/* Bloc Carte (Lyon) */}
        <div className="map-section">
          <div className="map-wrapper">
            <iframe
              title="Carte de Lyon"
              className="map-frame"
              src={
                "https://www.openstreetmap.org/export/embed.html?bbox=4.793%2C45.65%2C4.95%2C45.80&layer=mapnik&marker=45.7640%2C4.8357"
              }
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <a
              href="https://www.openstreetmap.org/?mlat=45.7640&mlon=4.8357#map=12/45.7640/4.8357"
              target="_blank"
              rel="noreferrer"
              className="map-link"
            >
              Voir en plein écran
            </a>
          </div>
        </div>
      </div>
    
    </div>
  );
}