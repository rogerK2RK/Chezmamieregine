import './style.css';

const ITEMS = [
  'Ravitoto', 'Romazava', 'Henakisoa sy amalona', 'Tilapia grillé',
  'Achards', 'Riz parfumé', 'Mofo gasy', 'Koba', 'Sambos',
];

export default function Marquee() {
  // On duplique la liste pour un défilement infini sans couture.
  const loop = [...ITEMS, ...ITEMS];

  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__track">
        {loop.map((item, i) => (
          <span className="marquee__item" key={i}>
            {item}
            <span className="marquee__dot">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
