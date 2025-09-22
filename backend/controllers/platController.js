const Plat = require('../models/Plat');

exports.getAllPlats = async (req, res) => {
  const plats = await Plat.find().sort({ createdAt: -1 });
  res.json(plats);
};

exports.createPlat = async (req, res) => {
  const plat = await Plat.create({ ...req.body, owner: req.user._id });
  res.status(201).json(plat);
};

exports.updatePlat = async (req, res) => {
  const plat = await Plat.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!plat) return res.status(404).json({ message: 'Plat introuvable' });
  res.json(plat);
};

exports.deletePlat = async (req, res) => {
  const plat = await Plat.findByIdAndDelete(req.params.id);
  if (!plat) return res.status(404).json({ message: 'Plat introuvable' });
  res.json({ message: 'Supprimé' });
};
