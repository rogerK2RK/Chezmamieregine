// backend/controllers/commentBackController.js
const mongoose = require('mongoose');
const Comment  = require('../models/Comment');

// GET /api/admin/comments
exports.list = async (req, res) => {
  try {
    const { q } = req.query;
    const filter = {};
    if (q) {
      filter.$or = [
        { text:       { $regex: q, $options: 'i' } },
        { authorName: { $regex: q, $options: 'i' } },
        { staffReply: { $regex: q, $options: 'i' } },
      ];
    }

    const items = await Comment.find(filter)
      .sort({ createdAt: -1 })
      .populate('plat', 'name nom ar')                // pour l’UI
      .populate('authorClient', 'firstName lastName email') // pour l’UI
      .lean();

    // Normalise quelques alias utiles côté front
    const mapped = items.map(c => ({
      ...c,
      client: c.authorClient,         // alias
      isVisible: !c.isHidden,         // alias
      adminReply: c.staffReply || ''  // alias
    }));

    return res.json(mapped);
  } catch (e) {
    console.error('admin/comments list ERROR:', e);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};

// PATCH /api/admin/comments/:id/reply  { reply }
exports.reply = async (req, res) => {
  try {
    const { id } = req.params;
    const { reply } = req.body || {};
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'id invalide' });
    if (!reply || !reply.trim())      return res.status(400).json({ message: 'Texte requis' });

    const c = await Comment.findById(id);
    if (!c) return res.status(404).json({ message: 'Commentaire introuvable' });

    c.staffReply   = reply.trim();
    c.staffReplyAt = new Date();
    c.staffReplyBy = req.admin?._id || null; // si adminProtect remplit req.admin
    await c.save();

    const out = await Comment.findById(id)
      .populate('plat', 'name nom ar')
      .populate('authorClient', 'firstName lastName email')
      .lean();

    return res.json({
      ...out,
      client: out.authorClient,
      isVisible: !out.isHidden,
      adminReply: out.staffReply || ''
    });
  } catch (e) {
    console.error('admin/comments reply ERROR:', e);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};

// PATCH /api/admin/comments/:id/hide
exports.hide = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'id invalide' });

    const c = await Comment.findByIdAndUpdate(id, { isHidden: true }, { new: true })
      .populate('plat', 'name nom ar')
      .populate('authorClient', 'firstName lastName email')
      .lean();
    if (!c) return res.status(404).json({ message: 'Commentaire introuvable' });

    return res.json({
      ...c,
      client: c.authorClient,
      isVisible: !c.isHidden,
      adminReply: c.staffReply || ''
    });
  } catch (e) {
    console.error('admin/comments hide ERROR:', e);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};

// PATCH /api/admin/comments/:id/unhide
exports.unhide = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'id invalide' });

    const c = await Comment.findByIdAndUpdate(id, { isHidden: false }, { new: true })
      .populate('plat', 'name nom ar')
      .populate('authorClient', 'firstName lastName email')
      .lean();
    if (!c) return res.status(404).json({ message: 'Commentaire introuvable' });

    return res.json({
      ...c,
      client: c.authorClient,
      isVisible: !c.isHidden,
      adminReply: c.staffReply || ''
    });
  } catch (e) {
    console.error('admin/comments unhide ERROR:', e);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};

// DELETE /api/admin/comments/:id
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'id invalide' });

    const del = await Comment.findByIdAndDelete(id);
    if (!del) return res.status(404).json({ message: 'Commentaire introuvable' });

    return res.json({ ok: true });
  } catch (e) {
    console.error('admin/comments remove ERROR:', e);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};
