const mongoose = require('mongoose');

// Compteur atomique pour générer des identifiants séquentiels (ADM-000001, CLI-000001…)
const CounterSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // clé du compteur (ex. "admin")
  seq: { type: Number, default: 0 },
});

module.exports = mongoose.model('Counter', CounterSchema);
