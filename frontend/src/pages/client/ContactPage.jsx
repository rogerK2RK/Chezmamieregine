import React from 'react';
import ContactForm from '../../components/shared/ContactForm/ContactForm.jsx';

export default function HomePage() {
  return <main>
    <ContactForm isPageContact={true}/>
  </main>;
}
