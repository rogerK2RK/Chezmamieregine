const mongoose = require('mongoose');

const slugify = (s) =>
  String(s || '')
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const CategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },          // nom FR (ex. « Plats »)
    nameMg: { type: String, trim: true, default: '' },           // nom malgache (ex. « Sakafo »)
    slug: { type: String, unique: true, index: true },
    description: { type: String, default: '' },                  // texte SEO / présentation de la catégorie
    image: { type: String, default: '' },                        // image représentative (bloc SEO)
    order: { type: Number, default: 0 },                         // ordre d'affichage
    parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null }, // arborescence
  },
  { timestamps: true }
);

CategorySchema.pre('save', function (next) {
  if (!this.slug) this.slug = slugify(this.name);
  next();
});

module.exports = mongoose.model('Category', CategorySchema, 'categories');
