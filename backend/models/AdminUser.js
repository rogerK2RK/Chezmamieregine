const mongoose = require('mongoose');
const { getNextId } = require('../utils/idGenerator');

// Schéma Mongoose pour les administrateurs
const AdminUserSchema = new mongoose.Schema({
  adminId: { type: String }, // Identifiant personnalisé (ex: ADM0001)
  name:    { type: String, required: true, trim: true },
  email:   { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  password:{ type: String, required: true },
  role:    { type: String, enum: ['admin','owner','superAdmin'], default: 'admin', index: true }
}, { timestamps: true }); // Ajoute createdAt et updatedAt

// Index unique sur adminId (uniquement s’il existe)
AdminUserSchema.index(
  { adminId: 1 },
  { unique: true, partialFilterExpression: { adminId: { $type: 'string' } } }
);

// Hook avant sauvegarde : génère un adminId automatique si absent
AdminUserSchema.pre('save', async function(next) {
  if (!this.isNew) return next(); // Ignore les mises à jour
  if (!this.adminId) {
    this.adminId = await getNextId('ADM', 'admin');
  }
  next();
});

// Exporte le modèle lié à la collection "adminusers"
module.exports = mongoose.model('AdminUser', AdminUserSchema, 'adminusers');
