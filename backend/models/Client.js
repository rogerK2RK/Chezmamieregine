const mongoose = require('mongoose');
const { getNextId } = require('../utils/idGenerator');

// Regex de validation
const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ' -]{2,50}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Schéma Mongoose pour les clients
const clientSchema = new mongoose.Schema(
  {
    clientId:  { type: String, unique: true, index: true },

    lastName:  {
      type: String,
      required: [true, 'Le nom est obligatoire.'],
      trim: true,
      minlength: [2, 'Le nom doit contenir au moins 2 caractères.'],
      maxlength: [50, 'Le nom ne doit pas dépasser 50 caractères.'],
      match: [nameRegex, 'Le nom contient des caractères invalides.'],
    },

    firstName: {
      type: String,
      required: [true, 'Le prénom est obligatoire.'],
      trim: true,
      minlength: [2, 'Le prénom doit contenir au moins 2 caractères.'],
      maxlength: [50, 'Le prénom ne doit pas dépasser 50 caractères.'],
      match: [nameRegex, 'Le prénom contient des caractères invalides.'],
    },

    email: {
      type: String,
      required: [true, 'L’email est obligatoire.'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
      match: [emailRegex, 'Adresse email invalide.'],
    },

    sex: {
      type: String,
      enum: {
        values: ['H', 'F', 'other'],
        message: 'Le champ sexe doit être "H", "F" ou "other".',
      },
      required: [true, 'Le sexe est obligatoire.'],
    },

    password: {
      type: String,
      required: [true, 'Le mot de passe est obligatoire.'],
      // ⚠️ ATTENTION : ici c’est le mot de passe HASHÉ,
      // donc on ne met PAS de regex de complexité à ce niveau.
      // On validera la complexité AVANT le hash dans le contrôleur.
      minlength: [8, 'Le mot de passe doit contenir au moins 8 caractères.'],
    },
  },
  { timestamps: true }
);

// Génère automatiquement un clientId à la création
clientSchema.pre('save', async function (next) {
  if (!this.isNew || this.clientId) return next();
  this.clientId = await getNextId('CLI', 'client');
  next();
});

module.exports = mongoose.model('Client', clientSchema, 'clients');
