// backend/controllers/categoryController.js
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

// GET /api/categories (?public=1 pour ne renvoyer que les visibles)
exports.list = async (req, res) => {
  try {
    const publicOnly = String(req.query.public || '').trim() === '1';
    const filter = publicOnly ? { isActive: true } : {};
    const categories = await Category.find(filter).sort({ createdAt: -1 });
    res.json(categories);
  } catch (e) {
    console.error('GET /categories error', e);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// POST /api/categories
exports.create = async (req, res) => {
  try {
    const { name, description = '', isActive = true } = req.body;
    if (!name?.trim()) return res.status(400).json({ message: 'Nom requis' });

    const cleanName = name.trim();
    const slug = toSlug(cleanName);

    const exists = await Category.findOne({
      $or: [{ name: cleanName }, { slug }]
    });
    if (exists) return res.status(400).json({ message: 'Catégorie déjà existante' });

    const cat = await Category.create({
      name: cleanName,
      description,
      slug,
      isActive: !!isActive
    });
    res.status(201).json(cat);
  } catch (e) {
    console.error('POST /categories error', e);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// PUT /api/categories/:id
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const patch = {};

    if (typeof req.body.name === 'string' && req.body.name.trim()) {
      const newName = req.body.name.trim();
      patch.name = newName;
      patch.slug = toSlug(newName);

      // vérifier doublon (autre doc)
      const duplicate = await Category.findOne({
        _id: { $ne: id },
        $or: [{ name: newName }, { slug: patch.slug }]
      });
      if (duplicate) {
        return res.status(400).json({ message: 'Nom/slug déjà utilisé par une autre catégorie' });
      }
    }

    if (typeof req.body.description === 'string') patch.description = req.body.description;
    if (typeof req.body.isActive === 'boolean') patch.isActive = !!req.body.isActive;

    const updated = await Category.findByIdAndUpdate(id, patch, { new: true });
    if (!updated) return res.status(404).json({ message: 'Catégorie introuvable' });
    res.json(updated);
  } catch (e) {
    console.error('PUT /categories/:id error', e);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// DELETE /api/categories/:id
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;

    // Empêcher la suppression si des plats y sont encore liés
    const hasPlats = await Plat.exists({ category: id });
    if (hasPlats) {
      return res.status(400).json({ message: 'Catégorie utilisée par des plats. Détachez-les d’abord.' });
    }

    const deleted = await Category.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Catégorie introuvable' });
    res.json({ message: 'Catégorie supprimée' });
  } catch (e) {
    console.error('DELETE /categories/:id error', e);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// POST /api/categories/:id/assign-plats
exports.assignPlats = async (req, res) => {
  try {
    const { id } = req.params;            // id catégorie
    const { platIds = [] } = req.body;    // liste d'ids de plats
    await Plat.updateMany(
      { _id: { $in: platIds } },
      { $set: { category: id } }
    );
    res.json({ ok: true });
  } catch (e) {
    console.error('POST assign-plats error', e);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// POST /api/categories/unassign-plats
exports.unassignPlats = async (req, res) => {
  try {
    const { platIds = [] } = req.body;
    await Plat.updateMany(
      { _id: { $in: platIds } },
      { $set: { category: null } }
    );
    res.json({ ok: true });
  } catch (e) {
    console.error('POST unassign-plats error', e);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// GET /api/categories/:id/plats
// Si tu veux que ce soit “public-friendly”, on ne renvoie que les plats disponibles :
exports.listPlatsOfCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const onlyAvailable = String(req.query.public || '').trim() === '1';
    const filter = { category: id };
    if (onlyAvailable) filter.isAvailable = true;

    const plats = await Plat.find(filter).sort({ createdAt: -1 });
    res.json(plats);
  } catch (e) {
    console.error('GET /categories/:id/plats error', e);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.listPublic = async (_req, res) => {
  const categories = await Category.find({ isActive: true }).sort({ createdAt: -1 });
  res.json(categories);
};
