const mongoose = require('mongoose');
const Comment = require('../models/Comment');
const { asyncHandler } = require('../utils/helpers');

// ---- Public : liste (non masqués) d'un plat + création ----
exports.listByPlat = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.platId)) return res.json([]);
  const comments = await Comment.find({ plat: req.params.platId, hidden: { $ne: true } })
    .sort('-createdAt')
    .lean();
  res.json(comments);
});

exports.create = asyncHandler(async (req, res) => {
  const { platId } = req.params;
  if (!mongoose.isValidObjectId(platId))
    return res.status(400).json({ message: 'Plat invalide.' });
  const author = String(req.body.author || '').trim();
  const text = String(req.body.text || '').trim();
  const rating = Math.min(5, Math.max(1, Number(req.body.rating) || 5));
  if (!author || !text) return res.status(400).json({ message: 'Nom et message requis.' });

  const c = await Comment.create({ plat: platId, author, text, rating });
  res.status(201).json(c);
});

// ---- Admin ----
exports.listAll = asyncHandler(async (_req, res) => {
  const comments = await Comment.find().populate('plat', 'name').sort('-createdAt').lean();
  res.json(comments);
});

exports.setHidden = (hidden) =>
  asyncHandler(async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id))
      return res.status(404).json({ message: 'Commentaire introuvable.' });
    const c = await Comment.findByIdAndUpdate(req.params.id, { hidden }, { new: true });
    if (!c) return res.status(404).json({ message: 'Commentaire introuvable.' });
    res.json(c);
  });

exports.remove = asyncHandler(async (req, res) => {
  await Comment.findByIdAndDelete(req.params.id);
  res.json({ message: 'Commentaire supprimé.' });
});
