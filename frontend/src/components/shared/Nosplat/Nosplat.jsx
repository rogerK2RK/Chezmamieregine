import React from 'react';
import './NosPlats.css';

const NosPlats = () => {
  const plat = {
    nom: "Hena omby ritra",
    description: "Viande de bœuf, ail, gingembre, sel, poivre, Quelques fois des herbes aromatiques",
    prix: "13,50 €",
    image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200' viewBox='0 0 300 200'%3E%3Crect width='300' height='200' fill='%23D2B48C'/%3E%3Ccircle cx='80' cy='80' r='35' fill='%23CD853F'/%3E%3Ccircle cx='220' cy='80' r='35' fill='%238FBC8F'/%3E%3Ccircle cx='80' cy='140' r='25' fill='%23FF6347'/%3E%3Ccircle cx='150' cy='100' r='45' fill='%23F5DEB3'/%3E%3Ccircle cx='220' cy='140' r='25' fill='%23228B22'/%3E%3Ctext x='150' y='105' text-anchor='middle' fill='%23654321' font-size='12'%3ERiz et viande%3C/text%3E%3C/svg%3E"
  };

  return (
    <div className="nosplats-container">
      <div className="nosplats-wrapper">
        <h1 className="nosplats-title">Nos Plats</h1>

        <div className="nosplats-grid">
          {[1, 2, 3].map((index) => (
            <div key={index} className="nosplats-card">
              <div className="nosplats-image-container">
                <img 
                  src={plat.image}
                  alt={plat.nom}
                  className="nosplats-image"
                />
              </div>

              <h2 className="nosplats-name">{plat.nom}</h2>

              <p className="nosplats-description">{plat.description}</p>

              <p className="nosplats-price">{plat.prix}</p>

              <button className="nosplats-button">
                Ajouter au panier
              </button>
            </div>
          ))}
        </div>

        <div className="nosplats-footer">
          <button className="nosplats-button">
            Voir plus
          </button>
        </div>
      </div>
    </div>
  );
};

export default NosPlats;
