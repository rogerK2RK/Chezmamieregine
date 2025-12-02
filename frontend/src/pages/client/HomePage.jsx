import { useEffect } from "react";
import Hero from '../../components/shared/Hero/Hero.jsx';
import Apropos from '../../components/shared/About/About.jsx';
import NosPlats from '../../components/shared/Nosplat/Nosplat.jsx';
import CommentCaMarche from '../../components/shared/CommentCaMarche/CommentCaMarche.jsx';
import Cta from '../../components/shared/CTA/cta.jsx';
import ContactForm from '../../components/shared/ContactForm/ContactForm.jsx';

export default function HomePage() {

  useEffect(() => {
    document.title = "Chez Mamie Régine – Plats malgaches faits maison";

    const metaDesc = document.querySelector("meta[name='description']");
    if (metaDesc) {
      metaDesc.setAttribute(
        "content",
        "Découvrez nos délicieux plats malgaches faits maison, livrés rapidement sur Lille."
      );
    }
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
