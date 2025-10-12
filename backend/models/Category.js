const mongoose = require('mongoose');
const { getNextId } = require('../utils/idGenerator');

// Schéma Mongoose pour les catégories de plats
const categorySchema = new mongoose.Schema({
  categoryId:  { type: String, unique: true, index: true },
  name:        { type: String, required: true, trim: true, unique: true },
  slug:        { type: String, required: true, unique: true, lowercase: true, trim: true },
  description: { type: String, default: '' },
  isPublic:    { type: Boolean, default: false }, 
  isActive:    { type: Boolean, default: true } 
}, { timestamps: true });

// Génère automatiquement un categoryId si absent à la création
categorySchema.pre('save', async function(next) {
  if (!this.isNew || this.categoryId) return next();
  this.categoryId = await getNextId('CAT', 'category');
  next();
});

// Exporte le modèle lié à la collection "categories"
module.exports = mongoose.model('Category', categorySchema, 'categories');
