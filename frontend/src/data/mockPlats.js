/* =========================================================
   Données de démonstration (fallback local)
   Utilisées quand l'API/back n'est pas disponible, pour pouvoir
   afficher la carte et les fiches plats en local sans backend.
   Les images réutilisent celles déjà présentes dans le projet.
   ========================================================= */
import imgRavitoto from '../components/shared/Hero/images/hero-ravitoto.jpg';
import imgHaricot from '../components/shared/Hero/images/hero-haricot.jpg';
import imgTilapia from '../components/shared/Hero/images/hero-tilapia.jpg';
import imgCrevette from '../components/shared/Hero/images/hero-crevette.jpg';
import imgMamie from '../components/shared/About/images/Apropos.jpg';

export const MAMIE_PHOTO = imgMamie;

// Accompagnements communs (réutilise des images existantes comme vignettes)
const SIDES = {
  riz: { name: 'Riz blanc', img: imgHaricot },
  achards: { name: 'Achards', img: imgCrevette },
  rougail: { name: 'Rougail tomate', img: imgTilapia },
  piment: { name: 'Piment frais', img: imgRavitoto },
};

const INFOS = [
  'Plat préparé chaque jour',
  'Ingrédients frais et locaux',
  'Sans conservateurs',
  'Recette traditionnelle',
  'Convient à toute la famille',
];

export const MOCK_PLATS = [
  {
    _id: 'ravitoto-coco',
    name: 'Ravitoto au coco',
    nameMain: 'Ravitoto',
    nameAccent: 'au coco',
    price: 18,
    category: { name: 'Viandes', slug: 'viandes' },
    images: [imgRavitoto],
    badges: ['Fait maison', 'Lait de coco', 'Spécialité malgache'],
    description:
      'Feuilles de manioc longuement mijotées dans un lait de coco onctueux, accompagnées de viande tendre (zébu ou porc) et servies avec du riz blanc parfumé.',
    sideDishes: [SIDES.riz, SIDES.achards, SIDES.rougail, SIDES.piment],
    infos: INFOS,
    allergenes: 'Contient du lait de coco.',
    isAvailable: true,
  },
  {
    _id: 'romazava',
    name: 'Romazava',
    nameMain: 'Romazava',
    nameAccent: '',
    price: 17,
    category: { name: 'Soupes', slug: 'soupes' },
    images: [imgTilapia],
    badges: ['Fait maison', 'Épices douces', 'Traditionnel'],
    description:
      'Soupe traditionnelle à base de brèdes, de viande de zébu et de légumes frais, parfumée aux herbes malgaches.',
    sideDishes: [SIDES.riz, SIDES.piment],
    infos: INFOS,
    allergenes: 'Peut contenir du céleri.',
    isAvailable: true,
  },
  {
    _id: 'poulet-coco',
    name: 'Poulet au coco',
    nameMain: 'Poulet',
    nameAccent: 'au coco',
    price: 18,
    category: { name: 'Viandes', slug: 'viandes' },
    images: [imgHaricot],
    badges: ['Fait maison', 'Lait de coco', 'Gourmand'],
    description:
      'Poulet mijoté lentement dans un lait de coco parfumé aux épices malgaches, servi avec du riz blanc.',
    sideDishes: [SIDES.riz, SIDES.rougail, SIDES.piment],
    infos: INFOS,
    allergenes: 'Contient du lait de coco.',
    isAvailable: true,
  },
  {
    _id: 'crevettes-coco',
    name: 'Crevettes coco',
    nameMain: 'Crevettes',
    nameAccent: 'coco',
    price: 20,
    category: { name: 'Crevettes', slug: 'crevettes' },
    images: [imgCrevette],
    badges: ['Fait maison', 'Lait de coco', 'Mer'],
    description:
      'Crevettes fraîches saisies puis nappées d’une sauce coco délicatement épicée, servies avec du riz parfumé.',
    sideDishes: [SIDES.riz, SIDES.achards, SIDES.piment],
    infos: INFOS,
    allergenes: 'Crustacés. Contient du lait de coco.',
    isAvailable: true,
  },
  {
    _id: 'mofo-gasy',
    name: 'Mofo gasy',
    nameMain: 'Mofo gasy',
    nameAccent: '',
    price: 6,
    category: { name: 'Desserts', slug: 'desserts' },
    images: [imgHaricot],
    badges: ['Fait maison', 'Sucré'],
    description:
      'Petits pains de riz moelleux légèrement sucrés, une douceur traditionnelle malgache à déguster à toute heure.',
    sideDishes: [],
    infos: INFOS,
    allergenes: 'Contient gluten.',
    isAvailable: true,
  },
  {
    _id: 'jus-corossol',
    name: 'Jus de corossol',
    nameMain: 'Jus de corossol',
    nameAccent: '',
    price: 4,
    category: { name: 'Boissons', slug: 'boissons' },
    images: [imgCrevette],
    badges: ['Frais', 'Sans conservateur'],
    description:
      'Jus de corossol frais et onctueux, naturellement parfumé, sans conservateur ni colorant.',
    sideDishes: [],
    infos: INFOS,
    allergenes: 'Aucun allergène majeur.',
    isAvailable: true,
  },
];

export const MOCK_CATEGORIES = [
  { _id: 'cat-ravitoto', name: 'Ravitoto', slug: 'ravitoto' },
  { _id: 'cat-romazava', name: 'Romazava', slug: 'romazava' },
  { _id: 'cat-viandes', name: 'Viandes', slug: 'viandes' },
  { _id: 'cat-poissons', name: 'Poissons', slug: 'poissons' },
  { _id: 'cat-crevettes', name: 'Crevettes', slug: 'crevettes' },
  { _id: 'cat-soupes', name: 'Soupes', slug: 'soupes' },
  { _id: 'cat-desserts', name: 'Desserts', slug: 'desserts' },
  { _id: 'cat-boissons', name: 'Boissons', slug: 'boissons' },
];

export function getMockPlatById(id) {
  return MOCK_PLATS.find((p) => p._id === id) || null;
}
