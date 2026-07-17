import { useEffect } from 'react';
import Lenis from 'lenis';
import Hero from '../components/Hero.jsx';
import Reassurance from '../components/Reassurance.jsx';
import About from '../components/About.jsx';
import NosPlats from '../components/NosPlats.jsx';
import CommentCaMarche from '../components/CommentCaMarche.jsx';
import Traiteur from '../components/Traiteur.jsx';
import CTA from '../components/CTA.jsx';
import ContactForm from '../components/ContactForm.jsx';

export default function HomePage() {
  useEffect(() => {
    document.title = 'Chez Mamie Régine — Plats malgaches faits maison · Livraison & traiteur';
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const lenis = new Lenis({ lerp: 0.12 });
    let id = requestAnimationFrame(function raf(t) { lenis.raf(t); id = requestAnimationFrame(raf); });
    return () => { lenis.destroy(); cancelAnimationFrame(id); };
  }, []);

  return (
    <main>
      <Hero />
      <Reassurance />
      <About />
      <NosPlats />
      <CommentCaMarche />
      <Traiteur />
      <CTA />
      <ContactForm />
    </main>
  );
}
