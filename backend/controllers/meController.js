// backend/controllers/meController.js
const Client = require('../models/Client');

// GET /api/me  -> renvoie le profil du client connecté
exports.getMe = async (req, res) => {
  try {
    if (!req.client) {
      return res.status(401).json({ message: 'Non autorisé.' });
    }

    const c = await Client.findById(req.client._id)
      .select('firstName lastName email sex clientId createdAt');

    if (!c) {
      return res.status(404).json({ message: 'Compte introuvable.' });
    }

    res.json(c);
  } catch (e) {
    console.error('GET /api/me ERROR:', e);
    res.status(500).json({ message: 'Impossible de récupérer le profil.' });
  }
};

// PUT /api/me  -> met à jour les champs autorisés
exports.updateMe = async (req, res) => {
  try {
    if (!req.client) {
      return res.status(401).json({ message: 'Non autorisé.' });
    }

    const patch = {};

    if (typeof req.body.firstName === 'string') {
      patch.firstName = req.body.firstName.trim();
    }
    if (typeof req.body.lastName === 'string') {
      patch.lastName = req.body.lastName.trim();
    }
    if (typeof req.body.sex === 'string') {
      patch.sex = req.body.sex;
    }
    if (typeof req.body.email === 'string') {
      patch.email = req.body.email.toLowerCase().trim();
    }

    const updated = await Client.findByIdAndUpdate(
      req.client._id,
      { $set: patch },
      { new: true }
    ).select('firstName lastName email sex clientId createdAt');

    if (!updated) {
      return res.status(404).json({ message: 'Compte introuvable.' });
    }

    res.json(updated);
  } catch (e) {
    console.error('PUT /api/me ERROR:', e);
    res.status(500).json({ message: 'Mise à jour impossible.' });
  }
};

// DELETE /api/me -> supprime le compte du client connecté
exports.deleteMe = async (req, res) => {
  try {
    if (!req.client) {
      return res.status(401).json({ message: 'Non autorisé.' });
    }

    const deleted = await Client.findByIdAndDelete(req.client._id);

    if (!deleted) {
      return res.status(404).json({ message: 'Compte introuvable.' });
    }

    return res.json({ message: 'Compte supprimé avec succès.' });
  } catch (e) {
    console.error('DELETE /api/me ERROR:', e);
    return res
      .status(500)
      .json({ message: 'Suppression du compte impossible.' });
  }
};
