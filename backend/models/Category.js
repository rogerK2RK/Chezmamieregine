const mongoose = require('mongoose');
const { getNextId } = require('../utils/idGenerator');

const categorySchema = new mongoose.Schema({
  categoryId:  { type: String, unique: true, index: true },
  name: { type: String, required: true, trim: true, unique: true },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  description: { type: String, default: '' },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

categorySchema.pre('save', async function(next) {
  if (!this.isNew || this.categoryId) return next();
  this.categoryId = await getNextId('CAT', 'category'); // CAT-000001
  next();
});

module.exports = mongoose.model('Category', categorySchema, 'categories');
