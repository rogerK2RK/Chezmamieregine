const mongoose = require('mongoose');
const { getNextId } = require('../utils/idGenerator');

const ClientSchema = new mongoose.Schema(
  {
    clientId: { type: String },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    sex: { type: String, enum: ['H', 'F', 'other'], default: 'other' },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

ClientSchema.pre('save', async function (next) {
  if (this.isNew && !this.clientId) this.clientId = await getNextId('CLI', 'client');
  next();
});

module.exports = mongoose.model('Client', ClientSchema, 'clients');
