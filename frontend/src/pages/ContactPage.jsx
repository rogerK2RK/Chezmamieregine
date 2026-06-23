import { useEffect } from 'react';
import ContactForm from '../components/ContactForm.jsx';

export default function ContactPage() {
  useEffect(() => { document.title = 'Contact — Chez Mamie Régine'; }, []);
  return <main style={{ paddingTop: '5rem' }}><ContactForm heading="h1" /></main>;
}
