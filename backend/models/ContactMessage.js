// models/Contact.js
const mongoose = require('mongoose');

const NAME_REGEX  = /^[A-Za-zÀ-ÖØ-öø-ÿ' -]{2,60}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const contactSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
    match: [NAME_REGEX, 'Prénom invalide.'],
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    match: [NAME_REGEX, 'Nom invalide.'],
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    match: [EMAIL_REGEX, 'Email invalide.'],
  },
  phone: {
    type: String,
    trim: true,
  },
  message: {
    type: String,
    required: true,
    trim: true,
    minlength: 10,
    maxlength: 2000,
  },
}, { timestamps: true });

module.exports = mongoose.model('Contact', contactSchema);
