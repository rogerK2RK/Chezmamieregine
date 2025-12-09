const ContactMessage = require('../models/ContactMessage');

exports.createContact = async (req, res) => {
  try {
    const { lastName, firstName, email, phone, message } = req.body || {};

    if (!lastName || !firstName || !email || !phone || !message) {
      return res.status(400).json({ message: 'Tous les champs sont requis.' });
    }

    // petite vérif email basique
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(String(email).toLowerCase())) {
      return res.status(400).json({ message: "Adresse email invalide." });
    }

    // tu peux faire une petite vérif de phone si tu veux :
    // const phoneClean = String(phone).replace(/\s+/g, '');
    // etc.

    await ContactMessage.create({
      lastName:  String(lastName).trim(),
      firstName: String(firstName).trim(),
      email:     String(email).toLowerCase().trim(),
      phone:     String(phone).trim(),
      message:   String(message).trim(),
    });

    return res.status(201).json({ ok: true, message: 'Message envoyé.' });
  } catch (e) {
    console.error('POST /public/contact ERROR:', e);
    return res.status(500).json({ message: "Erreur serveur lors de l'envoi du message." });
  }
};
