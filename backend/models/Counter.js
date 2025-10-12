const mongoose = require('mongoose');

// Schéma utilisé pour générer des IDs incrémentés (via getNextId)
const CounterSchema = new mongoose.Schema({
  name:   { type: String, required: true, unique: true, index: true },
  seq:    { type: Number, default: 0 }, 
  prefix: { type: String, required: true },
}, { 
  collection: 'counters', 
  timestamps: true
});

// Exporte le modèle lié à la collection "counters"
module.exports = mongoose.model('Counter', CounterSchema);
