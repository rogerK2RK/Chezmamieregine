import React from 'react';
import './CommentCaMarche.css';

const CommentCaMarche = () => {
  const steps = [
    {
      title: "Trouve",
      subtitle: "un restau dans ta ville",
      icon: "🍽️"
    },
    {
      title: "Choisis",
      subtitle: "ton ou tes plat",
      icon: "🍽️"
    },
    {
      title: "Contact",
      subtitle: "le restaurant concerné",
      icon: "🍽️"
    }
  ];

  return (
    <div className="ccm-container">
      <h1 className="ccm-title">Comment ça marche</h1>
      
      <div className="ccm-grid">
        {steps.map((step, index) => (
          <div key={index} className="ccm-step">
            <div className="ccm-icon-wrapper">
              <div className="ccm-icon-circle">
                <span className="ccm-icon">{step.icon}</span>
              </div>
            </div>

            <h3 className="ccm-step-title">{step.title}</h3>
            <p className="ccm-step-subtitle">{step.subtitle}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentCaMarche;
