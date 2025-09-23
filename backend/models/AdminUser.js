const mongoose = require('mongoose');

const adminUserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, unique: true, required: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['superAdmin', 'admin', 'owner'], default: 'admin' },
}, { timestamps: true });

module.exports = mongoose.model('AdminUser', adminUserSchema, 'adminusers');
