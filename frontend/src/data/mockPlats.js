import ravitoto from '../assets/img/hero-ravitoto.jpg';
import haricot from '../assets/img/hero-haricot.jpg';
import tilapia from '../assets/img/hero-tilapia.jpg';
import crevette from '../assets/img/hero-crevette.jpg';

// Données de secours si l'API est indisponible (dev/local sans backend).
export const MOCK_CATEGORIES = [
  { _id: 'c1', name: 'Ravitoto', slug: 'ravitoto' },
  { _id: 'c2', name: 'Romazava', slug: 'romazava' },
  { _id: 'c3', name: 'Poissons', slug: 'poissons' },
  { _id: 'c4', name: 'Accueil', slug: 'home' },
];

export const MOCK_PLATS = [
  { _id: 'ravitoto-coco', name: 'Ravitoto', nameAccent: 'au coco', price: 14, images: [ravitoto],
    description: 'Feuilles de manioc pilées, viande de zébu fondante et lait de coco.',
    badges: ['Fait maison', 'Lait de coco'], category: { name: 'Ravitoto', slug: 'ravitoto' },
    categories: [{ name: 'Accueil', slug: 'home' }],
    sideDishes: [{ name: 'Riz blanc' }, { name: 'Achards' }],
    infos: ['Préparé chaque jour', 'Ingrédients frais', 'Recette traditionnelle'], allergenes: '' },
  { _id: 'romazava', name: 'Romazava', price: 13, images: [haricot],
    description: 'Le bouillon national malgache aux brèdes et morceaux de viande.',
    badges: ['Fait maison'], category: { name: 'Romazava', slug: 'romazava' },
    categories: [{ name: 'Accueil', slug: 'home' }], sideDishes: [{ name: 'Riz blanc' }],
    infos: ['Préparé chaque jour', 'Ingrédients frais'] },
  { _id: 'tilapia', name: 'Tilapia', nameAccent: 'grillé', price: 15, images: [tilapia],
    description: 'Tilapia grillé mariné aux épices, accompagné de riz parfumé.',
    badges: ['Fait maison', 'Grillé'], category: { name: 'Poissons', slug: 'poissons' },
    categories: [{ name: 'Accueil', slug: 'home' }], sideDishes: [{ name: 'Riz parfumé' }],
    infos: ['Poisson frais', 'Mariné maison'] },
  { _id: 'crevettes', name: 'Crevettes', nameAccent: 'coco', price: 16, images: [crevette],
    description: 'Crevettes mijotées au lait de coco et épices douces.',
    badges: ['Fait maison', 'Lait de coco'], category: { name: 'Poissons', slug: 'poissons' },
    categories: [{ name: 'Accueil', slug: 'home' }], sideDishes: [{ name: 'Riz blanc' }],
    infos: ['Produits du marché'] },
];

export const getMockPlatById = (id) => MOCK_PLATS.find((p) => p._id === id) || null;
