const ITEMS = ['Ravitoto', 'Romazava', 'Henakisoa sy amalona', 'Tilapia grillé', 'Achards', 'Riz parfumé', 'Mofo gasy', 'Sambos'];

export default function Marquee() {
  const loop = [...ITEMS, ...ITEMS];
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__track">
        {loop.map((it, i) => (
          <span className="it" key={i}>{it}<span className="dot">✦</span></span>
        ))}
      </div>
    </div>
  );
}
