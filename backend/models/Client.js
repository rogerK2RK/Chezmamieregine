const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
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

module.exports = mongoose.model('Client', clientSchema, 'clients');
