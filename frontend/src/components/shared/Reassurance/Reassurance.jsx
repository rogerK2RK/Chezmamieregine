import './style.css';

const ITEMS = [
  {
    title: 'Fait maison',
    desc: 'Chaque plat est préparé avec amour, chaque jour.',
    icon: (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 11l9-7 9 7" />
        <path d="M5 10v9a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-9" />
        <path d="M9 21v-6h6v6" />
      </svg>
    ),
  },
  {
    title: 'Ingrédients frais',
    desc: 'Sélectionnés localement pour plus de qualité.',
    icon: (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 20c-4 0-7-3-7-7 0-1 .2-2 .6-3 3 0 6 1 8 3" />
        <path d="M11 20c0-5 3-9 9-11 .3 4-1 11-9 11z" />
      </svg>
    ),
  },
  {
    title: 'Livraison',
    desc: 'Disponible à Lyon, rapidement et au bon moment.',
    icon: (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 7h11v8H3z" />
        <path d="M14 10h4l3 3v2h-7z" />
        <circle cx="7" cy="18" r="1.6" />
        <circle cx="17.5" cy="18" r="1.6" />
      </svg>
    ),
  },
];

export default function Reassurance() {
  return (
    <section className="reassurance" aria-label="Nos engagements">
      <div className="reassurance-inner">
        {ITEMS.map((it) => (
          <div className="reassurance-item" key={it.title} data-reveal>
            <span className="reassurance-icon" aria-hidden="true">{it.icon}</span>
            <div className="reassurance-text">
              <h3>{it.title}</h3>
              <p>{it.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
