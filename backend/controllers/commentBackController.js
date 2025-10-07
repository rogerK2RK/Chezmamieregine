// backend/controllers/commentBackController.js
const Comment = require('../models/Comment');

// GET /api/admin/comments?status=published|hidden|pending (optionnel)
exports.adminList = async (req, res) => {
  try {
    const q = {};
    if (req.query.status) q.status = req.query.status;
    const list = await Comment.find(q)
      .sort({ createdAt: -1 })
      .populate('plat', 'name')
      .populate('client', 'firstName lastName email');
    res.json(list);
  } catch (e) {
    console.error('adminList ERROR', e);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// PUT /api/admin/comments/:id/reply  { text }
exports.reply = async (req, res) => {
  try {
    const { id } = req.params;
    const text = (req.body.text || '').trim();
    if (!text) return res.status(400).json({ message: 'Réponse vide' });

    const updated = await Comment.findByIdAndUpdate(
      id,
      { reply: { by: req.admin._id, text, at: new Date() } },
      { new: true }
    )
      .populate('plat', 'name')
      .populate('client', 'firstName lastName email');

    if (!updated) return res.status(404).json({ message: 'Introuvable' });
    res.json(updated);
  } catch (e) {
    console.error('reply ERROR', e);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// PUT /api/admin/comments/:id/status  { status: 'published'|'hidden'|'pending' }
exports.setStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const allowed = ['published', 'hidden', 'pending'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: 'Statut invalide' });
    }
    const updated = await Comment.findByIdAndUpdate(id, { status }, { new: true });
    if (!updated) return res.status(404).json({ message: 'Introuvable' });
    res.json(updated);
  } catch (e) {
    console.error('setStatus ERROR', e);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// DELETE /api/admin/comments/:id
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    const c = await Comment.findById(id);
    if (!c) return res.status(404).json({ message: 'Introuvable' });
    await c.deleteOne();
    res.json({ ok: true });
  } catch (e) {
    console.error('remove ERROR', e);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
