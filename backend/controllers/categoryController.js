const Category = require('../models/Category');
const Plat = require('../models/Plat');

// utils
const toSlug = (str) =>
  (str || '')
    .toString()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

exports.list = async (req, res) => {
  const categories = await Category.find().sort({ createdAt: -1 });
  res.json(categories);
};

exports.create = async (req, res) => {
  const { name, description = '' } = req.body;
  if (!name?.trim()) return res.status(400).json({ message: 'Nom requis' });

  const slug = toSlug(name.trim());
  const exists = await Category.findOne({ $or: [{ name: name.trim() }, { slug }] });
  if (exists) return res.status(400).json({ message: 'Catégorie déjà existante' });

  const cat = await Category.create({ name: name.trim(), description, slug });
  res.status(201).json(cat);
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const patch = {};
  if (req.body.name) {
    patch.name = req.body.name.trim();
    patch.slug = toSlug(req.body.name.trim());
  }
  if (typeof req.body.description === 'string') patch.description = req.body.description;
  if (typeof req.body.isActive === 'boolean') patch.isActive = req.body.isActive;

  const updated = await Category.findByIdAndUpdate(id, patch, { new: true });
  if (!updated) return res.status(404).json({ message: 'Catégorie introuvable' });
  res.json(updated);
};

exports.remove = async (req, res) => {
  const { id } = req.params;

  // Sécurité: empêcher la suppression si des plats y sont encore liés (optionnel)
  const hasPlats = await Plat.exists({ category: id });
  if (hasPlats) {
    return res.status(400).json({ message: 'Catégorie utilisée par des plats. Détachez-les d’abord.' });
  }

  const deleted = await Category.findByIdAndDelete(id);
  if (!deleted) return res.status(404).json({ message: 'Catégorie introuvable' });
  res.json({ message: 'Catégorie supprimée' });
};

// Lier plusieurs plats à une catégorie
exports.assignPlats = async (req, res) => {
  const { id } = req.params;            // id catégorie
  const { platIds = [] } = req.body;    // liste d'ids de plats
  await Plat.updateMany(
    { _id: { $in: platIds } },
    { $set: { category: id } }
  );
  res.json({ ok: true });
};

// Retirer plusieurs plats de la catégorie
exports.unassignPlats = async (req, res) => {
  const { platIds = [] } = req.body;
  await Plat.updateMany(
    { _id: { $in: platIds } },
    { $set: { category: null } }
  );
  res.json({ ok: true });
};

// Lister les plats d’une catégorie
exports.listPlatsOfCategory = async (req, res) => {
  const { id } = req.params;
  const plats = await Plat.find({ category: id }).sort({ createdAt: -1 });
  res.json(plats);
};
