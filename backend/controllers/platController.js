const mongoose = require('mongoose');
const Plat = require('../models/Plat');

// Récupère tous les plats (admin)
exports.getAllPlats = async (req, res) => {
  try {
    const plats = await Plat.find()
      .sort({ createdAt: -1 }) // Trie du plus récent au plus ancien
      .populate('category', 'name slug'); // Ajoute les infos de catégorie
    res.json(plats);
  } catch (err) {
    console.error('GET /plats ERROR', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Récupère un plat par son ID (admin ou public)
exports.getPlatById = async (req, res) => {
  try {
    const plat = await Plat.findById(req.params.id).populate('category', 'name slug');
    if (!plat) return res.status(404).json({ message: 'Plat introuvable' });
    res.json(plat);
  } catch (err) {
    console.error('GET /plats/:id ERROR', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Crée un nouveau plat
exports.createPlat = async (req, res) => {
  try {
    const { ar, name, price, category, description, images, isAvailable } = req.body;

    // Vérifie la présence et validité des champs essentiels
    if (!ar || !String(ar).trim()) return res.status(400).json({ message: 'Référence (AR) requise' });
    if (!name || !Number.isFinite(Number(price))) return res.status(400).json({ message: 'Nom/prix invalides' });

    // Vérifie que la référence AR est unique
    const exists = await Plat.findOne({ ar: String(ar).trim() });
    if (exists) return res.status(400).json({ message: 'AR déjà utilisée' });

    // Vérifie la validité de la catégorie (optionnelle)
    let categoryId = null;
    if (category && mongoose.isValidObjectId(category)) categoryId = category;

    // Crée le plat
    const plat = await Plat.create({
      ar: String(ar).trim(),
      name: String(name).trim(),
      price: Number(price),
      category: categoryId,
      description: description || '',
      images: Array.isArray(images) ? images : [],
      isAvailable: !!isAvailable,
      createdBy: req.admin?._id || null
    });

    res.status(201).json(plat);
  } catch (err) {
    // Gestion d’erreur pour doublon unique
    if (err?.code === 11000) {
      const field = Object.keys(err.keyPattern || {})[0] || 'unique';
      return res.status(400).json({ message: `Conflit d’unicité sur ${field}` });
    }
    console.error('POST /plats ERROR', err);
    res.status(500).json({ message: 'Erreur serveur', details: err.message });
  }
};

// Met à jour un plat existant
exports.updatePlat = async (req, res) => {
  try {
    const allowed = ['ar','name','price','category','description','isAvailable','images'];
    const patch = {};
    for (const k of allowed) if (k in req.body) patch[k] = req.body[k];

    // Vérifie unicité de la référence AR
    if ('ar' in patch) {
      patch.ar = String(patch.ar).trim();
      const other = await Plat.findOne({ ar: patch.ar, _id: { $ne: req.params.id } });
      if (other) return res.status(409).json({ message: 'Référence (AR) déjà utilisée par un autre plat' });
    }

    // Nettoie et valide les champs modifiables
    if ('name' in patch) patch.name = String(patch.name).trim();
    if ('price' in patch) patch.price = Number(patch.price);
    if ('description' in patch) patch.description = String(patch.description || '');

    if ('category' in patch && !mongoose.isValidObjectId(patch.category)) delete patch.category;

    if ('images' in patch) {
      patch.images = Array.isArray(patch.images)
        ? patch.images.map(s => String(s).trim()).filter(Boolean)
        : [];
    }

    // Applique la mise à jour
    const updated = await Plat.findByIdAndUpdate(
      req.params.id,
      { $set: patch },
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ message: 'Plat introuvable' });
    res.json(updated);
  } catch (err) {
    if (err?.code === 11000) return res.status(409).json({ message: 'Conflit d’unicité' });
    console.error('PUT /plats/:id ERROR', err);
    res.status(500).json({ message: 'Erreur serveur', details: err.message });
  }
};

// Supprime un plat
exports.deletePlat = async (req, res) => {
  try {
    const del = await Plat.findByIdAndDelete(req.params.id);
    if (!del) return res.status(404).json({ message: 'Plat introuvable' });
    res.json({ ok: true });
  } catch (err) {
    console.error('DELETE /plats/:id ERROR', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Liste publique des plats disponibles (par catégorie optionnelle)
exports.listPublic = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = { isAvailable: true };
    if (category && mongoose.isValidObjectId(category)) filter.category = category;

    const plats = await Plat.find(filter)
      .sort({ createdAt: -1 })
      .populate('category', 'name slug');

    res.json(plats);
  } catch (e) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Liste publique complète (affichée côté front)
exports.getPublicPlats = async (req, res) => {
  try {
    const plats = await Plat.find({ isPublic: true, isActive: true })
      .select('name price images description category')
      .sort({ createdAt: -1 })
      .populate('category', 'name slug');

    res.json(plats);
  } catch (e) {
    console.error('GET /plats/public ERROR', e);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Récupère le détail public d’un plat par son ID
exports.getOnePublic = async (req, res) => {
  try {
    const plat = await Plat.findById(req.params.id)
      .populate('category', 'name slug');
    if (!plat) return res.status(404).json({ message: 'Plat introuvable' });
    res.json(plat);
  } catch (e) {
    console.error('getOnePublic error:', e);
    res.status(500).json({ message: 'Erreur serveur lors du chargement du plat' });
  }
};
