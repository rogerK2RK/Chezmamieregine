const express = require('express');
const router = express.Router();
const ContactMessage = require('../models/ContactMessage');
const { adminProtect } = require('../middleware/adminAuthMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

//
// 🔹 POST /api/public/contact  (formulaire front)
//
router.post('/contact', async (req, res) => {
  try {
    const { firstName, lastName, email, phone, message } = req.body || {};

    if (!firstName || !lastName || !email || !message) {
      return res
        .status(400)
        .json({ message: 'Tous les champs obligatoires ne sont pas remplis.' });
    }

    // simple sécurisation XSS côté back
    const clean = (v) =>
      String(v || '')
        .trim()
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

    const doc = await ContactMessage.create({
      firstName: clean(firstName),
      lastName:  clean(lastName),
      email:     clean(email),
      phone:     clean(phone),
      message:   clean(message),
    });

    return res.status(201).json({
      ok: true,
      id: doc._id,
      message: 'Message envoyé, merci pour votre contact.',
    });
  } catch (e) {
    console.error('[POST /api/public/contact] ERROR', e);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
});

//
//   GET /api/public/contacts  (lecture côté admin)
//   Protégé avec token + rôles admin
//
router.get(
  '/contacts',
  adminProtect,
  authorizeRoles('admin', 'owner', 'superAdmin'),
  async (req, res) => {
    try {
      const list = await ContactMessage.find()
        .sort({ createdAt: -1 });

      res.json(list);
    } catch (e) {
      console.error('[GET /api/public/contacts] ERROR', e);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  }
);

module.exports = router;
