const Comment = require('../models/Comment');
const mongoose = require('mongoose');

// Liste les commentaires publiés pour un plat donné
exports.listByPlat = async (req, res) => {
  const { platId } = req.params;

  // Vérifie que l'ID du plat est valide
  if (!mongoose.isValidObjectId(platId)) 
    return res.status(400).json({ message: 'platId invalide' });

  // Recherche les commentaires liés au plat et publiés
  const comments = await Comment.find({ plat: platId, status: 'published' })
    // Trie du plus récent au plus ancien
    .sort({ createdAt: -1 })
    // Ajoute les infos du client       
    .populate('client', 'firstName lastName');

  res.json(comments);
};

// Crée un nouveau commentaire associé à un plat et un client
exports.create = async (req, res) => {
  const { plat, text, rating } = req.body;

  // Vérifications de base
  if (!mongoose.isValidObjectId(plat)) 
    return res.status(400).json({ message: 'plat invalide' });
  if (!text || !text.trim()) 
    return res.status(400).json({ message: 'Texte requis' });

  // Enregistre le commentaire dans la base
  const doc = await Comment.create({
    plat,
    client: req.client._id,
    text: text.trim(),
    rating: Number(rating) || 5,
    status: 'published'
  });

  res.status(201).json(doc);
};

// Supprime un commentaire appartenant au client connecté
exports.removeOwn = async (req, res) => {
  const { id } = req.params;

  // Vérifie que le commentaire appartient bien à l'utilisateur connecté
  const c = await Comment.findOne({ _id: id, client: req.client._id });
  if (!c) return res.status(404).json({ message: 'Commentaire introuvable' });

  await c.deleteOne();
  res.json({ ok: true });
};
