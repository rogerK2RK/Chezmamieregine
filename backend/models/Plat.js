const mongoose = require('mongoose');
const { getNextId } = require('../utils/idGenerator');

// Schéma Mongoose pour les plats
const platSchema = new mongoose.Schema({
  platId: { type: String, unique: true, index: true },
  ar:     { type: String, required: true, unique: true, trim: true }, 
  name:   { type: String, required: true, trim: true }, 
  price:  { type: Number, required: true, min: 0 }, 

  category: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Category', 
    default: null 
  },

  description: { type: String, default: '' }, 
  images:      { type: [String], default: [] },
  isAvailable: { type: Boolean, default: true },
  createdBy:   { type: mongoose.Schema.Types.ObjectId, ref: 'AdminUser', default: null }
}, { timestamps: true });

// Génère un platId unique à la création du document
platSchema.pre('save', async function(next) {
  if (!this.isNew) return next();
  if (!this.platId) this.platId = await getNextId('PLT', 'plat');
  next();
});

// Exporte le modèle lié à la collection "plats"
module.exports = mongoose.model('Plat', platSchema);