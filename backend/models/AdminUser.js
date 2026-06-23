const mongoose = require('mongoose');
const { getNextId } = require('../utils/idGenerator');

const AdminUserSchema = new mongoose.Schema(
  {
    adminId: { type: String },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'owner', 'superAdmin'], default: 'admin', index: true },
  },
  { timestamps: true }
);

AdminUserSchema.pre('save', async function (next) {
  if (this.isNew && !this.adminId) this.adminId = await getNextId('ADM', 'admin');
  next();
});

module.exports = mongoose.model('AdminUser', AdminUserSchema, 'adminusers');
