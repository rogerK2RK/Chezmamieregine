import { useEffect } from "react";
import Lenis from 'lenis';
import Snap from 'lenis/snap';
import './HomePage.css';
import Hero from '../../components/shared/Hero/Hero.jsx';
import Apropos from '../../components/shared/About/About.jsx';
import NosPlats from '../../components/shared/Nosplat/Nosplat.jsx';
import CommentCaMarche from '../../components/shared/CommentCaMarche/CommentCaMarche.jsx';
import Cta from '../../components/shared/CTA/cta.jsx';
import ContactForm from '../../components/shared/ContactForm/ContactForm.jsx';
import Reassurance from '../../components/shared/Reassurance/Reassurance.jsx';
import Traiteur from '../../components/shared/Traiteur/Traiteur.jsx';

export default function HomePage() {
  // Smooth scroll (Lenis) + calage par sections (snap), uniquement sur l'accueil.
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return undefined;

    const lenis = new Lenis({ lerp: 0.12, smoothWheel: true, wheelMultiplier: 1 });

    let rafId = requestAnimationFrame(function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    });

    // Calage doux : ne se déclenche qu'à proximité d'un bloc et après l'arrêt
    // du scroll (debounce), pour ne pas "tirer" pendant le défilement.
    const snap = new Snap(lenis, {
      type: 'proximity',
      duration: 0.8,
      distanceThreshold: '22%',
      debounce: 300,
    });
    const sections = document.querySelectorAll(
      '.home-page .hero-carousel, .home-sheet > *'
    );
    sections.forEach((el) => snap.addElement(el, { align: ['start'] }));

    return () => {
      snap.destroy();
      lenis.destroy();
      cancelAnimationFrame(rafId);
    };
  }, []);

  useEffect(() => {
    // -------- TITLE --------
    document.title = "Chez Mamie Régine – Plats malgaches faits maison";

    // -------- DESCRIPTION --------
    let metaDesc = document.querySelector("meta[name='description']");

    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.setAttribute("name", "description");
      document.head.appendChild(metaDesc);
    }

    metaDesc.setAttribute(
      "content",
      "Découvrez nos délicieux plats malgaches faits maison, livrés rapidement sur Lyon."
    );

    // -------- OG TAGS (SEO réseaux sociaux) --------
    const ogTitle = document.querySelector("meta[property='og:title']") || document.createElement("meta");
    ogTitle.setAttribute("property", "og:title");
    ogTitle.setAttribute("content", "Chez Mamie Régine – Plats malgaches");
    document.head.appendChild(ogTitle);

    const ogDesc = document.querySelector("meta[property='og:description']") || document.createElement("meta");
    ogDesc.setAttribute("property", "og:description");
    ogDesc.setAttribute("content", "Plats malgaches traditionnels & faits maison, livraison à Lyon.");
    document.head.appendChild(ogDesc);

    const ogImage = document.querySelector("meta[property='og:image']") || document.createElement("meta");
    ogImage.setAttribute("property", "og:image");
    ogImage.setAttribute("content", "https://chezmamieregine.vercel.app/Logo.jpg");
    document.head.appendChild(ogImage);

  }, []);

  return (
    <main className="home-page">
      <Hero />
      <Reassurance />
      {/* Le contenu remonte par-dessus le Hero figé (sticky stacking) */}
      <div className="home-sheet">
        <Apropos />
        <NosPlats />
        <CommentCaMarche />
        <Traiteur />
        <Cta />
        <ContactForm />
      </div>
    </main>
  );
}
