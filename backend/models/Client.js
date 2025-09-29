const mongoose = require('mongoose');
const { getNextId } = require('../utils/idGenerator');

const clientSchema = new mongoose.Schema({
  clientId: { type: String, unique: true, index: true }, 
  name: { type: String, required: true, trim: true },
  email: { type: String, unique: true, required: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  phone: String,
  addresses: [{
    label: String,
    line1: String, line2: String, city: String, zip: String, country: String
  }],
  // autres champs client si besoin
}, { timestamps: true });

clientSchema.pre('save', async function(next) {
  if (!this.isNew || this.clientId) return next();
  this.clientId = await getNextId('CLI', 'client'); // CLI-000001
  next();
});

module.exports = mongoose.model('Client', clientSchema, 'clients');
