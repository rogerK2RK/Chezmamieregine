const mongoose = require('mongoose');
const Category = require('../models/Category');
const { asyncHandler } = require('../utils/helpers');

exports.listPublic = asyncHandler(async (_req, res) => {
  const cats = await Category.find().populate('parent', 'name slug').sort('order name').lean();
  res.json(cats);
});

exports.create = asyncHandler(async (req, res) => {
  const name = String(req.body.name || '').trim();
  if (!name) return res.status(400).json({ message: 'Nom requis.' });
  const cat = await Category.create({
    name,
    nameMg: String(req.body.nameMg || '').trim(),
    description: String(req.body.description || '').trim(),
    image: String(req.body.image || '').trim(),
    order: Number(req.body.order) || 0,
    parent: req.body.parent || null,
  });
  res.status(201).json(cat);
});

exports.update = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id))
    return res.status(404).json({ message: 'Catégorie introuvable.' });
  const cat = await Category.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      nameMg: req.body.nameMg,
      slug: req.body.slug,
      description: req.body.description,
      image: req.body.image,
      order: Number(req.body.order) || 0,
      parent: req.body.parent || null,
    },
    { new: true, runValidators: true }
  );
  if (!cat) return res.status(404).json({ message: 'Catégorie introuvable.' });
  res.json(cat);
});

exports.remove = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id))
    return res.status(404).json({ message: 'Catégorie introuvable.' });
  await Category.findByIdAndDelete(req.params.id);
  res.json({ message: 'Catégorie supprimée.' });
});
