import { useEffect } from "react";
import Hero from '../../components/shared/Hero/Hero.jsx';
import Apropos from '../../components/shared/About/About.jsx';
import NosPlats from '../../components/shared/Nosplat/Nosplat.jsx';
import CommentCaMarche from '../../components/shared/CommentCaMarche/CommentCaMarche.jsx';
import Cta from '../../components/shared/CTA/cta.jsx';
import ContactForm from '../../components/shared/ContactForm/ContactForm.jsx';

export default function HomePage() {

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
    <main>
      <Hero />
      <Apropos />
      <NosPlats />
      <CommentCaMarche />
      <Cta />
      <ContactForm />
    </main>
  );
}
