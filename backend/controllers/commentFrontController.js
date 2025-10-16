// backend/controllers/commentFrontController.js
const mongoose = require('mongoose');
const Comment  = require('../models/Comment');
const Plat     = require('../models/Plat'); // seulement si tu tiens une liste de refs sur le plat (facultatif)

// GET /api/comments/plat/:platId  (public)
exports.listByPlat = async (req, res) => {
  try {
    const { platId } = req.params;
    if (!mongoose.isValidObjectId(platId)) {
      return res.status(400).json({ message: 'platId invalide' });
    }

    const comments = await Comment
      .find({ plat: platId, isHidden: false })
      .sort({ createdAt: -1 })
      .populate('authorClient', 'firstName lastName') // optionnel, utile pour fallback du nom
      .lean();

    // Garantit un authorName lisible quand il n’est pas stocké
    const items = comments.map(c => ({
      ...c,
      authorName:
        (c.authorName && c.authorName.trim())
          ? c.authorName
          : [c.authorClient?.firstName, c.authorClient?.lastName].filter(Boolean).join(' ') || 'Client'
    }));

    return res.json(items);
  } catch (e) {
    console.error('comments.listByPlat ERROR:', e);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};

// POST /api/comments  (protégé par clientProtect)
exports.create = async (req, res) => {
  try {
    const { platId, text, rating } = req.body || {};

    if (!mongoose.isValidObjectId(platId)) {
      return res.status(400).json({ message: 'platId invalide' });
    }
    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'Texte requis' });
    }

    // ⚠️ AUCUN check "déjà commenté" → autorise plusieurs commentaires
    const comment = await Comment.create({
      plat: platId,
      authorClient: req.client._id,
      authorName:
        `${req.client.firstName || ''} ${req.client.lastName || ''}`.trim() || req.client.email,
      text: text.trim(),
      rating: Math.max(1, Math.min(5, Number(rating) || 5)),
      // isHidden: false (défaut du schéma)
    });

    // (Facultatif) si tu maintiens une liste d’IDs de commentaires dans le document Plat :
    // Utilise $push (et PAS $addToSet) pour autoriser plusieurs commentaires du même auteur
    try {
      await Plat.findByIdAndUpdate(platId, { $push: { comments: comment._id } });
    } catch (_) { /* non bloquant */ }

    return res.status(201).json(comment);
  } catch (e) {
    console.error('comments.create ERROR:', e);
    // Si un ancien index unique existe toujours en base, Mongo renverra 11000 ici
    if (e?.code === 11000) {
      return res.status(400).json({ message: 'Contrainte d’unicité en base — supprime l’index unique sur comments.' });
    }
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};

// PUT /api/comments/:id  (auteur uniquement)
exports.updateOwn = async (req, res) => {
  try {
    const { id } = req.params;
    const { text, rating } = req.body || {};
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'id invalide' });
    }

    const c = await Comment.findOne({ _id: id, authorClient: req.client._id });
    if (!c) return res.status(404).json({ message: 'Commentaire introuvable' });

    if (typeof text === 'string') c.text = text.trim();
    if (rating != null) c.rating = Math.max(1, Math.min(5, Number(rating)));

    await c.save();
    return res.json(c);
  } catch (e) {
    console.error('comments.updateOwn ERROR:', e);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};

// DELETE /api/comments/:id  (auteur uniquement)
exports.deleteOwn = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'id invalide' });
    }

    const del = await Comment.findOneAndDelete({ _id: id, authorClient: req.client._id });
    if (!del) return res.status(404).json({ message: 'Commentaire introuvable' });

    // (Facultatif) si tu tiens les refs dans Plat
    try {
      await Plat.findByIdAndUpdate(del.plat, { $pull: { comments: del._id } });
    } catch (_) { /* non bloquant */ }

    return res.json({ ok: true });
  } catch (e) {
    console.error('comments.deleteOwn ERROR:', e);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};
