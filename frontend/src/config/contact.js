// Coordonnées de contact — source unique pour tous les CTA (appel / WhatsApp).
// ⚠️ À confirmer/ajuster par le client si le numéro WhatsApp diffère du tél.

export const PHONE_DISPLAY = '06 68 34 77 55';
export const PHONE_TEL = '+33668347755';            // lien tel:
export const WHATSAPP_NUMBER = '33668347755';       // format international sans +

export const EMAIL = 'contact@chezmamieregine.fr';

export const CITY = 'Lyon';

// Construit un lien WhatsApp avec message pré-rempli.
export function whatsappLink(message) {
  const text = message ? `?text=${encodeURIComponent(message)}` : '';
  return `https://wa.me/${WHATSAPP_NUMBER}${text}`;
}

export const WA_ORDER = whatsappLink(
  'Bonjour Chez Mamie Régine 👋, je souhaite passer une commande.'
);

export const WA_CATERING = whatsappLink(
  'Bonjour Chez Mamie Régine 👋, je souhaite un devis traiteur pour un événement.'
);

export const TEL_LINK = `tel:${PHONE_TEL}`;
