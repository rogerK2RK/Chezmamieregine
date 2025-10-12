const Comment = require('../models/Comment');
const Plat     = require('../models/Plat');

// Récupère les commentaires visibles associés à un plat
exports.listByPlat = async (req, res) => {
  const { platId } = req.params;

  // Recherche les commentaires non masqués du plat
  const comments = await Comment.find({ plat: platId, isHidden: { $ne: true } })
    // Trie du plus récent au plus ancien
    .sort({ createdAt: -1 })
    // Renvoie des objets simples (pas des documents Mongoose)
    .lean();

  res.json(comments);
};

// Crée un nouveau commentaire pour un plat
exports.create = async (req, res) => {
  const { platId, text, rating } = req.body;

  // Vérifie la présence des champs nécessaires
  if (!platId || !text?.trim()) 
    return res.status(400).json({ message: 'Champs manquants' });

  // Vérifie que le plat existe avant de créer le commentaire
  const platExists = await Plat.exists({ _id: platId });
  if (!platExists) 
    return res.status(404).json({ message: 'Plat introuvable' });

  // Crée le document Comment
  const doc = await Comment.create({
    plat: platId,
    authorClient: req.client._id,
    authorName: `${req.client.firstName || ''} ${req.client.lastName || ''}`.trim(),
    text: text.trim(),
    rating: Math.max(1, Math.min(5, Number(rating || 5))) // Note entre 1 et 5
  });

  res.status(201).json(doc);
};

// Met à jour un commentaire appartenant au client connecté
exports.updateOwn = async (req, res) => {
  const { id } = req.params;
  const { text, rating } = req.body;

  // Vérifie que le commentaire appartient bien au client
  const c = await Comment.findOne({ _id: id, authorClient: req.client._id });
  if (!c) return res.status(404).json({ message: 'Commentaire introuvable' });

  // Met à jour uniquement les champs modifiés
  if (typeof text === 'string') c.text = text.trim();
  if (rating != null) c.rating = Math.max(1, Math.min(5, Number(rating)));

  await c.save();
  res.json(c);
};

// Supprime un commentaire appartenant au client connecté
exports.deleteOwn = async (req, res) => {
  const { id } = req.params;

  const del = await Comment.findOneAndDelete({ _id: id, authorClient: req.client._id });
  if (!del) return res.status(404).json({ message: 'Commentaire introuvable' });

  res.json({ ok: true });
};
