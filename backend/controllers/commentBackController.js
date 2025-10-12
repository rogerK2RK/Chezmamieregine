const Comment = require('../models/Comment');

// Liste tous les commentaires (filtrés si recherche "q" présente)
exports.list = async (req, res) => {
  const { q } = req.query;
  const filter = {};

  // Si un mot-clé est fourni, filtre sur le texte, l’auteur ou la réponse du staff
  if (q) {
    filter.$or = [
      { text:       { $regex: q, $options: 'i' } },
      { authorName: { $regex: q, $options: 'i' } },
      { staffReply: { $regex: q, $options: 'i' } },
    ];
  }

  // Récupère les commentaires triés du plus récent au plus ancien
  const items = await Comment.find(filter).sort({ createdAt: -1 }).lean();
  res.json(items);
};

// Permet à un administrateur de répondre à un commentaire
exports.reply = async (req, res) => {
  const { id } = req.params;
  const { reply } = req.body;

  const c = await Comment.findById(id);
  if (!c) return res.status(404).json({ message: 'Commentaire introuvable' });

  // Ajoute la réponse, la date et l’auteur (admin connecté)
  c.staffReply   = (reply || '').trim();
  c.staffReplyAt = new Date();
  c.staffReplyBy = req.admin?._id || null;

  await c.save();
  res.json(c);
};

// Change la visibilité d’un commentaire (affiché ou masqué)
exports.setVisibility = async (req, res) => {
  const { id } = req.params;
  const { isHidden } = req.body;

  const c = await Comment.findByIdAndUpdate(
    id,
    { $set: { isHidden: !!isHidden } },
    { new: true } // Retourne le document mis à jour
  );

  if (!c) return res.status(404).json({ message: 'Commentaire introuvable' });
  res.json(c);
};

// Supprime définitivement un commentaire
exports.remove = async (req, res) => {
  const { id } = req.params;
  const del = await Comment.findByIdAndDelete(id);
  if (!del) return res.status(404).json({ message: 'Commentaire introuvable' });
  res.json({ ok: true });
};
