const ITEMS = [
  { t: 'Fait maison', d: 'Chaque plat préparé avec soin, chaque jour.',
    i: <path d="M3 11l9-7 9 7M5 10v9a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-9M9 21v-6h6v6" /> },
  { t: 'Produits frais', d: 'Sélectionnés localement pour plus de goût.',
    i: <path d="M11 20c-4 0-7-3-7-7 0-1 .2-2 .6-3 3 0 6 1 8 3M11 20c0-5 3-9 9-11 .3 4-1 11-9 11z" /> },
  { t: 'Livraison', d: 'À Chasse-sur-Rhône et alentours, au bon moment.',
    i: <><path d="M3 7h11v8H3zM14 10h4l3 3v2h-7z" /><circle cx="7" cy="18" r="1.6" /><circle cx="17.5" cy="18" r="1.6" /></> },
];

export default function Reassurance() {
  return (
    <section className="reassurance">
      <div className="reassurance-inner">
        {ITEMS.map((it) => (
          <div className="reassurance-item" key={it.t} data-reveal>
            <span className="ic" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{it.i}</svg>
            </span>
            <div><h3>{it.t}</h3><p>{it.d}</p></div>
          </div>
        ))}
      </div>
    </section>
  );
}
