const mongoose = require('mongoose');
const Plat = require('../models/Plat');
const { asyncHandler } = require('../utils/helpers');

// ---- Public ----
exports.listPublic = asyncHandler(async (_req, res) => {
  const plats = await Plat.find({ isAvailable: { $ne: false } })
    .populate('category', 'name slug')
    .populate('categories', 'name slug')
    .sort('-createdAt')
    .lean();
  res.json(plats);
});

exports.getPublic = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id))
    return res.status(404).json({ message: 'Plat introuvable.' });
  const plat = await Plat.findById(req.params.id)
    .populate('category', 'name slug')
    .populate('categories', 'name slug')
    .populate('packItems.plat', 'name price images')
    .lean();
  if (!plat) return res.status(404).json({ message: 'Plat introuvable.' });
  res.json(plat);
});

// ---- Admin ----
exports.create = asyncHandler(async (req, res) => {
  const plat = await Plat.create(req.body);
  res.status(201).json(plat);
});

exports.update = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id))
    return res.status(404).json({ message: 'Plat introuvable.' });
  const plat = await Plat.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!plat) return res.status(404).json({ message: 'Plat introuvable.' });
  res.json(plat);
});

exports.remove = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id))
    return res.status(404).json({ message: 'Plat introuvable.' });
  await Plat.findByIdAndDelete(req.params.id);
  res.json({ message: 'Plat supprimé.' });
});
