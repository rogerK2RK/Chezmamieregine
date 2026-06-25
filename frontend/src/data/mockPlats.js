import ravitoto from '../assets/img/hero-ravitoto.jpg';
import haricot from '../assets/img/hero-haricot.jpg';
import tilapia from '../assets/img/hero-tilapia.jpg';
import crevette from '../assets/img/hero-crevette.jpg';
import about from '../assets/img/about.jpg';
import cta from '../assets/img/cta.png';
import nosPlats from '../assets/img/nos-plats.jpg';
import background from '../assets/img/background.jpg';

// Données de secours si l'API est indisponible (dev/local sans backend).
// Catégories bilingues FR — MG, avec image représentative + texte SEO (bloc en haut de page).
export const MOCK_CATEGORIES = [
  {
    _id: 'c-plats', name: 'Plats', nameMg: 'Sakafo', slug: 'plats', order: 1, image: ravitoto,
    description:
      "Les plats principaux de Mamie Régine, cuisine malgache faite maison : ravitoto au coco, romazava, viande de zébu, poissons et crevettes mijotés. Servis avec du riz parfumé. Idéal pour le déjeuner et le dîner, en livraison sur Lyon.",
  },
  {
    _id: 'c-tsaky', name: 'Encas salés', nameMg: 'Tsaky', slug: 'tsaky', order: 2, image: crevette,
    description:
      "Les encas salés malgaches (tsaky) à grignoter ou à partager : nems, sambosa, beignets de crevette, brochettes, achards et rougail. Parfaits pour l'apéritif, le goûter salé ou un buffet d'événement.",
  },
  {
    _id: 'c-mamy', name: 'Douceurs sucrées', nameMg: 'Ny Mamy', slug: 'ny-mamy', order: 3, image: about,
    description:
      "Les douceurs sucrées (ny mamy) de Madagascar, à savourer au petit-déjeuner ou au goûter : mofo gasy, mokary, koba et autres petits plaisirs faits maison.",
  },
  {
    _id: 'c-box', name: 'Box & formules', nameMg: 'Box', slug: 'box', order: 4, image: cta,
    description:
      "Nos box et formules à partager : Box Wings, Box Tsaky, Box mix et Big box. La solution gourmande et économique pour les soirées, les apéros et les petits événements.",
  },
  {
    _id: 'c-boissons', name: 'Boissons', nameMg: 'Zava-pisotro', slug: 'boissons', order: 5, image: background,
    description:
      "Les boissons de Madagascar : jus naturels faits maison, bière THB (Three Horses Beer) et rhum Dzama. De quoi accompagner tous vos repas et vos fêtes.",
  },
];

const cat = (slug) => {
  const c = MOCK_CATEGORIES.find((x) => x.slug === slug);
  return c ? { name: c.name, nameMg: c.nameMg, slug: c.slug } : null;
};

export const MOCK_PLATS = [
  // — Plats / Sakafo —
  { _id: 'hena-risy', name: 'Hena Risy', price: 13, images: [ravitoto], category: cat('plats'),
    description: 'Viande de zébu mijotée longuement, sauce riche et parfumée.',
    badges: ['Fait maison'], sideDishes: [{ name: 'Riz blanc' }] },
  { _id: 'ravitoto-coco', name: 'Ravitoto', nameAccent: 'au coco', price: 14, images: [ravitoto], category: cat('plats'),
    description: 'Feuilles de manioc pilées, viande de zébu fondante et lait de coco.',
    badges: ['Fait maison', 'Lait de coco'], sideDishes: [{ name: 'Riz blanc' }, { name: 'Achards' }] },
  { _id: 'voanjobory', name: 'Voanjobory vo Hena', price: 13, images: [haricot], category: cat('plats'),
    description: 'Pois de terre mijotés avec de la viande de zébu, plat réconfortant.',
    badges: ['Fait maison'], sideDishes: [{ name: 'Riz blanc' }] },
  { _id: 'crevette-coco', name: 'Crevettes', nameAccent: 'au coco', price: 16, images: [crevette], category: cat('plats'),
    description: 'Crevettes mijotées au lait de coco et épices douces.',
    badges: ['Fait maison', 'Lait de coco'], sideDishes: [{ name: 'Riz parfumé' }] },
  { _id: 'poisson-coco', name: 'Poisson', nameAccent: 'au coco', price: 15, images: [tilapia], category: cat('plats'),
    description: 'Poisson mijoté dans une sauce onctueuse au lait de coco.',
    badges: ['Fait maison', 'Lait de coco'], sideDishes: [{ name: 'Riz blanc' }] },
  { _id: 'fia-endasy', name: 'Fia Endasy', price: 14, images: [tilapia], category: cat('plats'),
    description: 'Poisson frit doré et croustillant, mariné aux épices.',
    badges: ['Fait maison', 'Grillé'], sideDishes: [{ name: 'Riz parfumé' }] },
  { _id: 'hena-boly', name: 'Hena Boly', price: 12, images: [haricot], category: cat('plats'),
    description: 'Boulettes de viande en sauce tomate, recette de Mamie.',
    badges: ['Fait maison'], sideDishes: [{ name: 'Riz blanc' }] },
  { _id: 'hena-vo-traka', name: 'Hena vo Traka', price: 13, images: [ravitoto], category: cat('plats'),
    description: 'Viande mijotée aux brèdes, tout en douceur.',
    badges: ['Fait maison'], sideDishes: [{ name: 'Riz blanc' }] },
  { _id: 'vary-anana', name: "Vary amin'ny anana", price: 9, images: [haricot], category: cat('plats'),
    description: 'Riz aux brèdes, le petit-déjeuner salé typique de Madagascar.',
    badges: ['Fait maison', 'Petit-déj'], sideDishes: [{ name: 'Kitoza (option)' }] },

  // — Encas salés / Tsaky —
  { _id: 'nems', name: 'Nems', price: 5, images: [crevette], category: cat('tsaky'),
    description: 'Nems croustillants (poulet, bœuf ou légumes) — P.B.L.', badges: ['Fait maison'] },
  { _id: 'sambosa', name: 'Sambosa', price: 5, images: [crevette], category: cat('tsaky'),
    description: 'Samoussas dorés et croustillants — B.P.L.', badges: ['Fait maison'] },
  { _id: 'beignet-crevette', name: 'Beignets de crevette', price: 6, images: [crevette], category: cat('tsaky'),
    description: 'Beignets de crevette légers et croustillants.', badges: ['Fait maison'] },
  { _id: 'brochettes', name: 'Brochettes', price: 6, images: [ravitoto], category: cat('tsaky'),
    description: 'Brochettes de zébu marinées et grillées.', badges: ['Fait maison', 'Grillé'] },
  { _id: 'achard-legumes', name: 'Achard de légumes', price: 4, images: [haricot], category: cat('tsaky'),
    description: 'Achards de légumes croquants aux épices.', badges: ['Fait maison'] },
  { _id: 'rougail', name: 'Rougail', price: 4, images: [haricot], category: cat('tsaky'),
    description: 'Rougail tomate frais et relevé.', badges: ['Fait maison'] },

  // — Douceurs / Ny Mamy —
  { _id: 'mofo-gasy', name: 'Mofo gasy', price: 4, images: [about], category: cat('ny-mamy'),
    description: 'Petits pains de riz sucrés, parfaits au petit-déjeuner.',
    badges: ['Fait maison', 'Petit-déj'] },
  { _id: 'mokary', name: 'Mokary', price: 4, images: [about], category: cat('ny-mamy'),
    description: 'Galettes de riz moelleuses, à déguster au goûter.',
    badges: ['Fait maison', 'Petit-déj'] },
  { _id: 'koba', name: 'Koba', price: 5, images: [about], category: cat('ny-mamy'),
    description: 'Gâteau traditionnel arachide, riz et banane.', badges: ['Fait maison'] },

  // — Box & formules —
  { _id: 'box-wings', name: 'Box Wings', price: 6, images: [cta], category: cat('box'),
    description: 'Ailes de poulet marinées. 4p 6€ · 6p 8,50€ · 9p 12€ · 20p 22€.',
    badges: ['À partager'], infos: ['Sans brochettes'] },
  { _id: 'box-tsaky', name: 'Box Tsaky', nameAccent: '1 choix', price: 5, images: [crevette], category: cat('box'),
    description: 'Au choix nems, sambosa ou petisse. 6p 5€ · 8p 6,50€ · 10p 7€.',
    badges: ['À partager'] },
  { _id: 'box-mix', name: 'Box Mix', price: 9.5, images: [nosPlats], category: cat('box'),
    description: 'Assortiment d’encas. 10p 9,50€ · 15p 13,50€ · 20p 17€.',
    badges: ['À partager'], infos: ['Sans brochettes'] },
  { _id: 'big-box', name: 'Big Box', price: 25, images: [cta], category: cat('box'),
    description: '30 pièces à partager — 25€.', badges: ['À partager'], infos: ['Sans brochettes'] },

  // — Boissons / Zava-pisotro —
  { _id: 'jus-maison', name: 'Jus naturel maison', price: 3, images: [about], category: cat('boissons'),
    description: 'Jus de fruits frais fait maison, selon arrivage.', badges: ['Fait maison'] },
  { _id: 'thb', name: 'Bière THB', price: 3, images: [background], category: cat('boissons'),
    description: 'Three Horses Beer, la bière emblématique de Madagascar.', badges: ['Madagascar'] },
  { _id: 'dzama', name: 'Rhum Dzama', price: 8, images: [background], category: cat('boissons'),
    description: 'Rhum Dzama Cuvée Noire, distillé à Madagascar. À consommer avec modération.',
    badges: ['Madagascar'] },
];

export const getMockPlatById = (id) => MOCK_PLATS.find((p) => p._id === id) || null;
export const getMockCategoryBySlug = (slug) => MOCK_CATEGORIES.find((c) => c.slug === slug) || null;
