const Comment = require('../models/Comment');
const mongoose = require('mongoose');

exports.listByPlat = async (req, res) => {
  const { platId } = req.params;
  if (!mongoose.isValidObjectId(platId)) return res.status(400).json({ message: 'platId invalide' });
  const comments = await Comment.find({ plat: platId, status: 'published' })
    .sort({ createdAt: -1 })
    .populate('client','firstName lastName');
  res.json(comments);
};

exports.create = async (req, res) => {
  const { plat, text, rating } = req.body;
  if (!mongoose.isValidObjectId(plat)) return res.status(400).json({ message: 'plat invalide' });
  if (!text || !text.trim()) return res.status(400).json({ message: 'Texte requis' });

  const doc = await Comment.create({
    plat,
    client: req.client._id,
    text: text.trim(),
    rating: Number(rating) || 5,
    status: 'published'
  });
  res.status(201).json(doc);
};

exports.removeOwn = async (req, res) => {
  const { id } = req.params;
  const c = await Comment.findOne({ _id: id, client: req.client._id });
  if (!c) return res.status(404).json({ message: 'Commentaire introuvable' });
  await c.deleteOne();
  res.json({ ok: true });
};
