import React from 'react';
import { Helmet } from 'react-helmet-async';

import Hero from '../../components/shared/Hero/Hero.jsx';  
import Apropos from '../../components/shared/About/About.jsx';   
import NosPlats from '../../components/shared/Nosplat/Nosplat.jsx';
import CommentCaMarche from '../../components/shared/CommentCaMarche/CommentCaMarche.jsx';
import Cta from '../../components/shared/CTA/cta.jsx';
import ContactForm from '../../components/shared/ContactForm/ContactForm.jsx';

export default function HomePage() {
  const baseUrl = "https://chezmamieregine.vercel.app";
  const title = "Chez Mamie Régine — Cuisine malagasy, saveurs traditionnelles";
  const description =
    "Découvrez nos plats malagasy faits maison : ravitoto, romazava, brochettes, sambos… Livraison ou retrait, le goût authentique de Madagascar à portée de main.";
  const image = `${baseUrl}/og-default.jpg`; // à remplacer si tu as une vraie image OG

  return (
    <main>
      <Helmet>
        {/* Title & description */}
        <title>{title}</title>
        <meta name="description" content={description} />

        {/* Canonical */}
        <link rel="canonical" href={baseUrl} />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={baseUrl} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={image} />
        <meta property="og:site_name" content="Chez Mamie Régine" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={image} />
      </Helmet>

      <Hero />
      <Apropos />
      <NosPlats />
      <CommentCaMarche />
      <Cta />
      <ContactForm />
    </main>
  );
}
