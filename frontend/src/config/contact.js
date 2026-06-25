// Coordonnées — source unique pour tous les CTA (placeholders à remplacer).
export const PHONE_DISPLAY = '07 61 13 73 11';
export const PHONE_TEL = '+33761137311';
export const WHATSAPP_NUMBER = '33761137311';
export const EMAIL = 'contact@exemple.fr';
export const CITY = 'Chasse-sur-Rhône';

export const TEL_LINK = `tel:${PHONE_TEL}`;

export function whatsappLink(message) {
  const text = message ? `?text=${encodeURIComponent(message)}` : '';
  return `https://wa.me/${WHATSAPP_NUMBER}${text}`;
}

export const WA_ORDER = whatsappLink('Bonjour Chez Mamie Régine 👋, je souhaite passer une commande.');
export const WA_CATERING = whatsappLink('Bonjour Chez Mamie Régine 👋, je souhaite un devis traiteur pour un événement.');
