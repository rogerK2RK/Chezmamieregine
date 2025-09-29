const mongoose = require('mongoose');
const Plat = require('../models/Plat');

exports.getAllPlats = async (req, res) => {
  try {
    const plats = await Plat.find().sort({ createdAt: -1 });
    res.json(plats);
  } catch (err) {
    console.error('GET /plats ERROR', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.getPlatById = async (req, res) => {
  try {
    const plat = await Plat.findById(req.params.id);
    if (!plat) return res.status(404).json({ message: 'Plat introuvable' });
    res.json(plat);
  } catch (err) {
    console.error('GET /plats/:id ERROR', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.createPlat = async (req, res) => {
  try {
    const { ar, name, price, category, description, images, isAvailable } = req.body;

    if (!ar || !String(ar).trim()) return res.status(400).json({ message: 'Référence (AR) requise' });
    if (!name || !Number.isFinite(Number(price))) return res.status(400).json({ message: 'Nom/prix invalides' });

    const exists = await Plat.findOne({ ar: String(ar).trim() });
    if (exists) return res.status(400).json({ message: 'AR déjà utilisée' });

    let categoryId = null;
    if (category) {
      // accepte soit un ObjectId valide, soit une chaîne inutilisable -> on met null
      categoryId = mongoose.isValidObjectId(category) ? category : null;
    }

    const plat = await Plat.create({
      ar: String(ar).trim(),
      name: String(name).trim(),
      price: Number(price),
      category: categoryId,
      description: description || '',
      images: Array.isArray(images) ? images : [],   // le form envoie déjà un array (depuis split)
      isAvailable: !!isAvailable,
      createdBy: req.admin?._id || null              // 🔽 si adminProtect met req.admin
    });

    res.status(201).json(plat);
  } catch (err) {
    // gestion E11000 (doublon)
    if (err?.code === 11000) {
      const field = Object.keys(err.keyPattern || {})[0] || 'unique';
      return res.status(400).json({ message: `Conflit d’unicité sur ${field}` });
    }
    console.error('POST /plats ERROR', err);
    res.status(500).json({ message: 'Erreur serveur', details: err.message });
  }
};

exports.updatePlat = async (req, res) => {
  try {
    const patch = { ...req.body };
    if (patch.ar) {
      patch.ar = String(patch.ar).trim();
      const other = await Plat.findOne({ ar: patch.ar, _id: { $ne: req.params.id } });
      if (other) return res.status(400).json({ message: 'AR déjà utilisée par un autre plat' });
    }
    if ('price' in patch) patch.price = Number(patch.price);
    if ('category' in patch) {
      patch.category = mongoose.isValidObjectId(patch.category) ? patch.category : null;
    }

    const updated = await Plat.findByIdAndUpdate(req.params.id, patch, { new: true });
    if (!updated) return res.status(404).json({ message: 'Plat introuvable' });
    res.json(updated);
  } catch (err) {
    if (err?.code === 11000) {
      const field = Object.keys(err.keyPattern || {})[0] || 'unique';
      return res.status(400).json({ message: `Conflit d’unicité sur ${field}` });
    }
    console.error('PUT /plats/:id ERROR', err);
    res.status(500).json({ message: 'Erreur serveur', details: err.message });
  }
};

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
