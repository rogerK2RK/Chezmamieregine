const Category = require('../models/Category');
const Plat = require('../models/Plat');

// Fonction utilitaire : transforme une chaîne en slug lisible pour les URL
const toSlug = (str) =>
  (str || '')
    .toString()
    // Supprime les accents
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') 
    .toLowerCase()
    // Remplace les caractères spéciaux par des tirets
    .replace(/[^a-z0-9]+/g, '-')
    // Retire les tirets de début/fin
    .replace(/(^-|-$)/g, '');

// Contrôleur : liste toutes les catégories (publiques ou non)
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

// Contrôleur : création d’une nouvelle catégorie
exports.create = async (req, res) => {
  try {
    const { name, description = '', isActive = true } = req.body;
    if (!name?.trim()) return res.status(400).json({ message: 'Nom requis' });

    const cleanName = name.trim();
    const slug = toSlug(cleanName);

    // Vérifie si le nom ou le slug existe déjà
    const exists = await Category.findOne({
      $or: [{ name: cleanName }, { slug }]
    });
    if (exists) return res.status(400).json({ message: 'Catégorie déjà existante' });

    // Crée la catégorie
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

// Contrôleur : mise à jour d’une catégorie
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const patch = {};

    // Met à jour le nom et le slug si fournis
    if (typeof req.body.name === 'string' && req.body.name.trim()) {
      const newName = req.body.name.trim();
      patch.name = newName;
      patch.slug = toSlug(newName);

      // Vérifie doublon sur un autre document
      const duplicate = await Category.findOne({
        _id: { $ne: id },
        $or: [{ name: newName }, { slug: patch.slug }]
      });
      if (duplicate) {
        return res.status(400).json({ message: 'Nom/slug déjà utilisé par une autre catégorie' });
      }
    }

    // Met à jour les autres champs
    if (typeof req.body.description === 'string') patch.description = req.body.description;
    if (typeof req.body.isActive === 'boolean') patch.isActive = !!req.body.isActive;

    // Met à jour la catégorie
    const updated = await Category.findByIdAndUpdate(id, patch, { new: true });
    if (!updated) return res.status(404).json({ message: 'Catégorie introuvable' });
    res.json(updated);
  } catch (e) {
    console.error('PUT /categories/:id error', e);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Contrôleur : suppression d’une catégorie
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;

    // Vérifie si des plats y sont liés avant suppression
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

// Contrôleur : associe plusieurs plats à une catégorie
exports.assignPlats = async (req, res) => {
  try {
    const { id } = req.params;
    const { platIds = [] } = req.body;
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

// Contrôleur : détache plusieurs plats de leurs catégories
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

// Contrôleur : liste des plats appartenant à une catégorie donnée
exports.listPlatsOfCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const onlyAvailable = String(req.query.public || '').trim() === '1';
    const filter = { category: id };
    if (onlyAvailable) filter.isAvailable = true;

    const plats = await Plat.find(filter)
      .sort({ createdAt: -1 })
      // jointure pour récupérer le nom et slug de la catégorie
      .populate('category', 'name slug'); 
    res.json(plats);
  } catch (e) {
    console.error('GET /categories/:id/plats error', e);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Contrôleur : liste simple des catégories actives
exports.listPublic = async (_req, res) => {
  const categories = await Category.find({ isActive: true }).sort({ createdAt: -1 });
  res.json(categories);
};

// Contrôleur : liste des catégories publiques visibles côté front
exports.publicList = async (req, res) => {
  try {
    const cats = await Category.find({ isPublic: true, isActive: true })
      .sort({ createdAt: -1 });
    res.json(cats);
  } catch (e) {
    console.error('GET /categories/public ERROR', e);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
