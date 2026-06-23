const mongoose = require('mongoose');

const SideSchema = new mongoose.Schema(
  { name: String, img: String },
  { _id: false }
);

// Élément d'un pack/menu : un plat + une quantité.
const PackItemSchema = new mongoose.Schema(
  {
    plat: { type: mongoose.Schema.Types.ObjectId, ref: 'Plat' },
    qty: { type: Number, default: 1, min: 1 },
  },
  { _id: false }
);

const PlatSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    nameAccent: { type: String, trim: true },     // mot mis en orange/italique (DA)
    description: { type: String, default: '' },
    price: { type: Number, default: 0 },
    images: [{ type: String }],                    // URLs d'images (1ère = principale)
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' }, // catégorie principale (arborescence)
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }], // catégories associées
    badges: [{ type: String }],
    sideDishes: [SideSchema],                       // accompagnements
    infos: [{ type: String }],
    allergenes: { type: String, default: '' },
    isAvailable: { type: Boolean, default: true },
    // Pack / menu (produit composé d'autres produits)
    isPack: { type: Boolean, default: false },
    packItems: [PackItemSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Plat', PlatSchema, 'plats');
