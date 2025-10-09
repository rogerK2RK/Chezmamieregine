const Comment = require('../models/Comment');
const Plat     = require('../models/Plat');

/** Liste des commentaires d’un plat (public) */
exports.listByPlat = async (req, res) => {
  const { platId } = req.params;
  const comments = await Comment.find({ plat: platId, isHidden: { $ne: true } })
    .sort({ createdAt: -1 })
    .lean();
  res.json(comments);
};

/** Créer un commentaire (client connecté) */
exports.create = async (req, res) => {
  const { platId, text, rating } = req.body;
  if (!platId || !text?.trim()) return res.status(400).json({ message: 'Champs manquants' });

  const platExists = await Plat.exists({ _id: platId });
  if (!platExists) return res.status(404).json({ message: 'Plat introuvable' });

  const doc = await Comment.create({
    plat: platId,
    authorClient: req.client._id,
    authorName: `${req.client.firstName || ''} ${req.client.lastName || ''}`.trim(),
    text: text.trim(),
    rating: Math.max(1, Math.min(5, Number(rating || 5)))
  });
  res.status(201).json(doc);
};

/** Mettre à jour son propre commentaire */
exports.updateOwn = async (req, res) => {
  const { id } = req.params;
  const { text, rating } = req.body;

  const c = await Comment.findOne({ _id: id, authorClient: req.client._id });
  if (!c) return res.status(404).json({ message: 'Commentaire introuvable' });

  if (typeof text === 'string') c.text = text.trim();
  if (rating != null) c.rating = Math.max(1, Math.min(5, Number(rating)));
  await c.save();
  res.json(c);
};

/** Supprimer son propre commentaire */
exports.deleteOwn = async (req, res) => {
  const { id } = req.params;
  const del = await Comment.findOneAndDelete({ _id: id, authorClient: req.client._id });
  if (!del) return res.status(404).json({ message: 'Commentaire introuvable' });
  res.json({ ok: true });
};
