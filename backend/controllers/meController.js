const Client = require('../models/Client');

// GET /api/me  -> renvoie le profil du client connecté
exports.getMe = async (req, res) => {
  const c = await Client.findById(req.client._id).select('firstName lastName email sex clientId createdAt');
  res.json(c);
};

// PUT /api/me  -> met à jour les champs autorisés
exports.updateMe = async (req, res) => {
  const patch = {};
  if (typeof req.body.firstName === 'string') patch.firstName = req.body.firstName.trim();
  if (typeof req.body.lastName  === 'string') patch.lastName  = req.body.lastName.trim();
  if (typeof req.body.sex       === 'string') patch.sex       = req.body.sex;

  // (optionnel) mise à jour email si besoin et unique
  if (typeof req.body.email === 'string') patch.email = req.body.email.toLowerCase().trim();

  const updated = await Client.findByIdAndUpdate(req.client._id, { $set: patch }, { new: true })
    .select('firstName lastName email sex clientId createdAt');

  res.json(updated);
};
