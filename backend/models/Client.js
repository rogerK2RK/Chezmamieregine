const mongoose = require('mongoose');
const { getNextId } = require('../utils/idGenerator');

// Schéma Mongoose pour les clients
const clientSchema = new mongoose.Schema({
  clientId:  { type: String, unique: true, index: true },
  lastName:  { type: String, required: true, trim: true },
  firstName: { type: String, required: true, trim: true },
  email:     { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  sex:       { type: String, enum: ['H', 'F', 'other'], required: true },
  password:  { type: String, required: true } // Mot de passe hashé
}, { timestamps: true });

// Génère automatiquement un clientId à la création
clientSchema.pre('save', async function(next) {
  if (!this.isNew || this.clientId) return next();
  this.clientId = await getNextId('CLI', 'client');
  next();
});

// Exporte le modèle lié à la collection "clients"
module.exports = mongoose.model('Client', clientSchema, 'clients');
