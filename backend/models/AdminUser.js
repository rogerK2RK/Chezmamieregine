const mongoose = require('mongoose');
const { getNextId } = require('../utils/idGenerator');

const AdminUserSchema = new mongoose.Schema({
  adminId: { type: String, index: true }, // index simple ici; l’unique arrive plus bas via schema.index
  name:    { type: String, required: true, trim: true },
  email:   { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  password:{ type: String, required: true },
  role:    { type: String, enum: ['admin','owner','superAdmin'], default: 'admin', index: true }
}, { timestamps: true });

// ➜ unique “partiel” : unique seulement si adminId est une string existante
AdminUserSchema.index(
  { adminId: 1 },
  { unique: true, partialFilterExpression: { adminId: { $type: 'string' } } }
);

// ➜ génère un adminId si manquant
AdminUserSchema.pre('save', async function(next) {
  if (!this.isNew) return next();
  if (!this.adminId) {
    this.adminId = await getNextId('ADM', 'admin'); // ex: ADM-000001
  }
  next();
});

module.exports = mongoose.model('AdminUser', AdminUserSchema, 'adminusers');
