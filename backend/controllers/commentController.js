// backend/controllers/commentController.js
const mongoose = require('mongoose');
const Comment  = require('../models/Comment');

// GET /api/admin/comments  (admin) — liste paginée/filtrable
exports.list = async (req, res) => {
  try {
    const { q, platId, authorId, page = 1, limit = 20, hidden } = req.query;
    const filter = {};
    if (platId && mongoose.isValidObjectId(platId)) filter.plat = platId;
    if (authorId && mongoose.isValidObjectId(authorId)) filter.authorClient = authorId;
    if (hidden === 'true') filter.isHidden = true;
    if (hidden === 'false') filter.isHidden = false;
    if (q) filter.text = { $regex: String(q), $options: 'i' };

    const skip = (Number(page) - 1) * Number(limit);

    const [items, total] = await Promise.all([
      Comment
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .populate('authorClient', 'firstName lastName email')
        .lean(),
      Comment.countDocuments(filter)
    ]);

    return res.json({
      items,
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit)) || 1,
    });
  } catch (e) {
    console.error('adminComments.list ERROR:', e);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};

// PATCH /api/admin/comments/:id/hide   (admin)
exports.hide = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'id invalide' });

    const c = await Comment.findByIdAndUpdate(id, { isHidden: true }, { new: true });
    if (!c) return res.status(404).json({ message: 'Commentaire introuvable' });

    return res.json(c);
  } catch (e) {
    console.error('adminComments.hide ERROR:', e);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};

// PATCH /api/admin/comments/:id/unhide   (admin)
exports.unhide = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'id invalide' });

    const c = await Comment.findByIdAndUpdate(id, { isHidden: false }, { new: true });
    if (!c) return res.status(404).json({ message: 'Commentaire introuvable' });

    return res.json(c);
  } catch (e) {
    console.error('adminComments.unhide ERROR:', e);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};

// PATCH /api/admin/comments/:id/reply   (admin) — répondre en staff
exports.staffReply = async (req, res) => {
  try {
    const { id } = req.params;
    const { reply, staffId } = req.body || {};
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'id invalide' });
    if (!reply || !reply.trim()) return res.status(400).json({ message: 'Texte requis' });

    const c = await Comment.findById(id);
    if (!c) return res.status(404).json({ message: 'Commentaire introuvable' });

    c.staffReply = reply.trim();
    c.staffReplyAt = new Date();
    c.staffReplyBy = mongoose.isValidObjectId(staffId) ? staffId : c.staffReplyBy;

    await c.save();
    return res.json(c);
  } catch (e) {
    console.error('adminComments.staffReply ERROR:', e);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};

// DELETE /api/admin/comments/:id   (admin)
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'id invalide' });

    const del = await Comment.findByIdAndDelete(id);
    if (!del) return res.status(404).json({ message: 'Commentaire introuvable' });

    return res.json({ ok: true });
  } catch (e) {
    console.error('adminComments.remove ERROR:', e);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};
