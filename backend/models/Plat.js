const mongoose = require('mongoose');
const { getNextId } = require('../utils/idGenerator');

const platSchema = new mongoose.Schema({
  platId: { type: String, unique: true, index: true },
  ar:     { type: String, required: true, unique: true, trim: true },
  name:   { type: String, required: true },
  price:  { type: Number, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
  description: String,
  images: { type: [String], default: [] },
  isAvailable: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminUser', default: null }
}, { timestamps: true });

platSchema.pre('save', async function(next) {
  if (!this.isNew) return next();
  if (!this.platId) this.platId = await getNextId('PLT', 'plat');
  next();
});

module.exports = mongoose.model('Plat', platSchema);
