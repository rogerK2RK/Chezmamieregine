const Contact = require('../models/Contact');
const { asyncHandler, emailRegex } = require('../utils/helpers');

// ---- Public : envoi d'un message ----
exports.create = asyncHandler(async (req, res) => {
  const firstName = String(req.body.firstName || '').trim();
  const lastName = String(req.body.lastName || '').trim();
  const email = String(req.body.email || '').trim().toLowerCase();
  const phone = String(req.body.phone || '').trim();
  const message = String(req.body.message || '').trim();

  if (!message) return res.status(400).json({ message: 'Message requis.' });
  if (email && !emailRegex.test(email))
    return res.status(400).json({ message: 'Email invalide.' });

  await Contact.create({ firstName, lastName, email, phone, message });
  res.status(201).json({ message: 'Message envoyé. Nous vous répondrons rapidement.' });
});

// ---- Admin ----
exports.list = asyncHandler(async (_req, res) => {
  const items = await Contact.find().sort('-createdAt').lean();
  res.json(items);
});

exports.remove = asyncHandler(async (req, res) => {
  await Contact.findByIdAndDelete(req.params.id);
  res.json({ message: 'Message supprimé.' });
});
