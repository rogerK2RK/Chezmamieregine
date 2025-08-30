import React from 'react';
import Hero from '../../components/shared/Hero/Hero.jsx';  
import Apropos from '../../components/shared/About/About.jsx';   
import NosPlats from '../../components/shared/Nosplat/Nosplat.jsx';
import CommentCaMarche from '../../components/shared/CommentCaMarche/CommentCaMarche.jsx';

export default function HomePage() {
  return <>
    <Hero />
    <Apropos />
    <NosPlats />
    <CommentCaMarche /> 
  </>;
}
