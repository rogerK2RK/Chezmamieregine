// routes/publicContactRoutes.js
const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

// Regex
const NAME_REGEX  = /^[A-Za-zÀ-ÖØ-öø-ÿ' -]{2,60}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^(\+?\d{1,3}[\s.-]?)?0?[1-9](?:[\s.-]?\d{2}){4}$/;

// POST /api/public/contact
router.post('/contact', async (req, res) => {
  try {
    const { firstName, lastName, email, phone, message } = req.body || {};
    const errors = {};

    // NOM
    if (!lastName || !NAME_REGEX.test(String(lastName).trim())) {
      errors.lastName = 'Nom invalide (2 à 60 caractères, lettres uniquement).';
    }

    // PRÉNOM
    if (!firstName || !NAME_REGEX.test(String(firstName).trim())) {
      errors.firstName = 'Prénom invalide (2 à 60 caractères, lettres uniquement).';
    }

    // EMAIL
    if (!email || !EMAIL_REGEX.test(String(email).trim().toLowerCase())) {
      errors.email = "Email invalide.";
    }

    // TÉLÉPHONE (optionnel mais si présent → regex)
    if (phone && !PHONE_REGEX.test(String(phone).replace(/\s+/g, ''))) {
      errors.phone = 'Numéro de téléphone invalide.';
    }

    // MESSAGE
    const msg = String(message || '').trim();
    if (!msg || msg.length < 10) {
      errors.message = 'Le message doit contenir au moins 10 caractères.';
    }
    if (msg.length > 2000) {
      errors.message = 'Le message est trop long (2000 caractères max).';
    }

    // S’il y a des erreurs → 400 + détails
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        message: 'Données invalides.',
        errors,
      });
    }

    // Enregistrement en base si tout est OK
    const doc = await Contact.create({
      firstName: String(firstName).trim(),
      lastName:  String(lastName).trim(),
      email:     String(email).trim().toLowerCase(),
      phone:     phone ? String(phone).trim() : '',
      message:   msg,
    });

    return res.status(201).json({
      ok: true,
      message: 'Message enregistré.',
      contactId: doc._id,
    });
  } catch (e) {
    console.error('[POST /api/public/contact] ERROR', e);
    return res.status(500).json({ message: 'Erreur serveur.' });
  }
});

module.exports = router;
