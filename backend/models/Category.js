const mongoose = require('mongoose');

const slugify = (s) =>
  String(s || '')
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const CategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, index: true },
    parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null }, // arborescence
  },
  { timestamps: true }
);

CategorySchema.pre('save', function (next) {
  if (!this.slug) this.slug = slugify(this.name);
  next();
});

module.exports = mongoose.model('Category', CategorySchema, 'categories');
