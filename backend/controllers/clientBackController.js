// backend/controllers/clientBackController.js
const Client = require('../models/Client');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

// GET /api/admin/clients
exports.getAllClients = async (req, res) => {
  try {
    // ⬇️ on sélectionne explicitement clientId + firstName/lastName/email/sex/createdAt
    const clients = await Client.find({}, 'clientId firstName lastName email sex createdAt');
    res.json(clients);
  } catch (e) {
    console.error('getAllClients ERROR', e);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// PUT /api/admin/clients/:id
exports.updateClient = async (req, res) => {
  try {
    const patch = (({ lastName, firstName, email, sex }) => ({ lastName, firstName, email, sex }))(req.body);
    const updated = await Client.findByIdAndUpdate(req.params.id, patch, { new: true })
      .select('lastName firstName email sex createdAt');
    if (!updated) return res.status(404).json({ message: 'Client introuvable' });
    res.json(updated);
  } catch (e) {
    console.error('updateClient', e);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// POST /api/admin/clients/:id/reset-password
// Génère un mot de passe temporaire et le renvoie UNE FOIS (en clair)
exports.resetPassword = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) return res.status(404).json({ message: 'Client introuvable' });

    const temp = crypto.randomBytes(4).toString('hex'); // ex: "9f1a2b3c"
    const hashed = await bcrypt.hash(temp, 10);

    client.password = hashed;
    await client.save();

    res.json({ tempPassword: temp });
  } catch (e) {
    console.error('resetPassword', e);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// DELETE /api/admin/clients/:id
exports.deleteClient = async (req, res) => {
  try {
    const del = await Client.findByIdAndDelete(req.params.id);
    if (!del) return res.status(404).json({ message: 'Client introuvable' });
    res.json({ ok: true });
  } catch (e) {
    console.error('deleteClient', e);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
