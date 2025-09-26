const Client = require('../models/Client');

exports.getAllClients = async (req, res) => {
  const clients = await Client.find({})
    .select('-password')        // on ne renvoie pas les passwords
    .sort({ createdAt: -1 });
  res.json(clients);
};

exports.updateClient = async (req, res) => {
  const { id } = req.params;
  const allowed = ['name', 'phone', 'addresses', 'email']; // champs éditables
  const patch = {};
  for (const k of allowed) if (k in req.body) patch[k] = req.body[k];

  const updated = await Client.findByIdAndUpdate(id, patch, { new: true }).select('-password');
  if (!updated) return res.status(404).json({ message: 'Client introuvable' });
  res.json(updated);
};

exports.deleteClient = async (req, res) => {
  const { id } = req.params;
  const deleted = await Client.findByIdAndDelete(id);
  if (!deleted) return res.status(404).json({ message: 'Client introuvable' });
  res.json({ message: 'Client supprimé' });
};
