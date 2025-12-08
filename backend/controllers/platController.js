const mongoose = require('mongoose');
const Plat = require('../models/Plat');

// Récupère tous les plats (admin)
exports.getAllPlats = async (req, res) => {
  try {
    const plats = await Plat.find()
      .sort({ createdAt: -1 }) // Trie du plus récent au plus ancien
      .populate('category', 'name slug')      // ancienne catégorie principale
      .populate('categories', 'name slug');   // nouvelles catégories multiples
    res.json(plats);
  } catch (err) {
    console.error('GET /plats ERROR', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Récupère un plat par son ID (admin ou public)
exports.getPlatById = async (req, res) => {
  try {
    const plat = await Plat.findById(req.params.id)
      .populate('category', 'name slug')
      .populate('categories', 'name slug');

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
    const {
      ar,
      name,
      price,
      category,    // éventuel ancien champ (sélect simple)
      categories,  // nouveau champ (checkboxs, array)
      description,
      images,
      isAvailable,
    } = req.body;

    // Vérifie la présence et validité des champs essentiels
    if (!ar || !String(ar).trim()) {
      return res.status(400).json({ message: 'Référence (AR) requise' });
    }
    if (!name || !Number.isFinite(Number(price))) {
      return res.status(400).json({ message: 'Nom/prix invalides' });
    }

    // Vérifie que la référence AR est unique
    const exists = await Plat.findOne({ ar: String(ar).trim() });
    if (exists) {
      return res.status(400).json({ message: 'AR déjà utilisée' });
    }

    // 🔹 Normalisation des catégories
    let catIds = [];

    // Si le front envoie un tableau "categories"
    if (Array.isArray(categories) && categories.length) {
      catIds = categories
        .map((id) => (typeof id === 'string' ? id : String(id || '')))
        .filter((id) => mongoose.isValidObjectId(id));
    }
    // Sinon, si l’ancien champ "category" est utilisé
    else if (category && mongoose.isValidObjectId(category)) {
      catIds = [category];
    }

    const mainCategoryId = catIds[0] || null;

    // Crée le plat
    const plat = await Plat.create({
      ar: String(ar).trim(),
      name: String(name).trim(),
      price: Number(price),
      category: mainCategoryId, // pour compat + filtre simple
      categories: catIds,       // tableau complet
      description: description || '',
      images: Array.isArray(images)
        ? images.map((s) => String(s).trim()).filter(Boolean)
        : [],
      isAvailable: !!isAvailable,
      createdBy: req.admin?._id || null,
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
    const allowed = [
      'ar',
      'name',
      'price',
      'category',
      'categories',   // 🆕 on autorise la maj du tableau
      'description',
      'isAvailable',
      'images',
    ];

    const patch = {};
    for (const k of allowed) {
      if (k in req.body) patch[k] = req.body[k];
    }

    // Vérifie unicité de la référence AR
    if ('ar' in patch) {
      patch.ar = String(patch.ar).trim();
      const other = await Plat.findOne({
        ar: patch.ar,
        _id: { $ne: req.params.id },
      });
      if (other) {
        return res
          .status(409)
          .json({ message: 'Référence (AR) déjà utilisée par un autre plat' });
      }
    }

    // Nettoie et valide les champs modifiables
    if ('name' in patch) patch.name = String(patch.name).trim();
    if ('price' in patch) patch.price = Number(patch.price);
    if ('description' in patch) {
      patch.description = String(patch.description || '');
    }

    // 🔹 Gestion des catégories
    let catIds = null;

    // Cas 1 : le front envoie "categories" (préféré)
    if ('categories' in patch) {
      if (Array.isArray(patch.categories)) {
        catIds = patch.categories
          .map((id) => (typeof id === 'string' ? id : String(id || '')))
          .filter((id) => mongoose.isValidObjectId(id));
      } else if (patch.categories == null) {
        catIds = [];
      } else {
        // si une seule valeur
        const single = String(patch.categories || '');
        catIds = mongoose.isValidObjectId(single) ? [single] : [];
      }

      patch.categories = catIds;
      // on met à jour aussi "category" = première catégorie ou null
      patch.category = catIds[0] || null;
    }
    // Cas 2 : uniquement "category" (legacy)
    else if ('category' in patch) {
      if (!mongoose.isValidObjectId(patch.category)) {
        // catégorie invalide → on nettoie
        patch.category = null;
        patch.categories = [];
      } else {
        // on synchronise les deux
        patch.categories = [patch.category];
      }
    }

    // Images
    if ('images' in patch) {
      patch.images = Array.isArray(patch.images)
        ? patch.images.map((s) => String(s).trim()).filter(Boolean)
        : [];
    }

    // Applique la mise à jour
    const updated = await Plat.findByIdAndUpdate(
      req.params.id,
      { $set: patch },
      { new: true, runValidators: true }
    )
      .populate('category', 'name slug')
      .populate('categories', 'name slug');

    if (!updated) {
      return res.status(404).json({ message: 'Plat introuvable' });
    }
    res.json(updated);
  } catch (err) {
    if (err?.code === 11000) {
      return res.status(409).json({ message: 'Conflit d’unicité' });
    }
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

    // 🔹 si un filtre de catégorie est passé
    if (category && mongoose.isValidObjectId(category)) {
      // on accepte soit l’ancienne "category", soit le nouveau "categories"
      filter.$or = [
        { category },           // ancienne colonne
        { categories: category } // tableau
      ];
    }

    const plats = await Plat.find(filter)
      .sort({ createdAt: -1 })
      .populate('category', 'name slug')
      .populate('categories', 'name slug');

    res.json(plats);
  } catch (e) {
    console.error('GET /plats/listPublic ERROR', e);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Liste publique complète (affichée côté front)
exports.getPublicPlats = async (req, res) => {
  try {
    // ⚠️ Ton schéma Plat n’a pas isPublic / isActive.
    // Si tu ne les utilises pas, on retourne juste les plats disponibles.
    const plats = await Plat.find({ isAvailable: true })
      .select('name price images description category categories')
      .sort({ createdAt: -1 })
      .populate('category', 'name slug')
      .populate('categories', 'name slug');

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
      .populate('category', 'name slug')
      .populate('categories', 'name slug');

    if (!plat) return res.status(404).json({ message: 'Plat introuvable' });
    res.json(plat);
  } catch (e) {
    console.error('getOnePublic error:', e);
    res.status(500).json({ message: 'Erreur serveur lors du chargement du plat' });
  }
};
