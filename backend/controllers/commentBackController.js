const Comment = require('../models/Comment');

/** Liste + recherche (BO) */
exports.list = async (req, res) => {
  const { q } = req.query;
  const filter = {};
  if (q) {
    filter.$or = [
      { text:       { $regex: q, $options: 'i' } },
      { authorName: { $regex: q, $options: 'i' } },
      { staffReply: { $regex: q, $options: 'i' } },
    ];
  }
  const items = await Comment.find(filter).sort({ createdAt: -1 }).lean();
  res.json(items);
};

/** Répondre (staff) */
exports.reply = async (req, res) => {
  const { id } = req.params;
  const { reply } = req.body;

  const c = await Comment.findById(id);
  if (!c) return res.status(404).json({ message: 'Commentaire introuvable' });

  c.staffReply   = (reply || '').trim();
  c.staffReplyAt = new Date();
  c.staffReplyBy = req.admin?._id || null;

  await c.save();
  res.json(c);
};

/** Masquer / afficher */
exports.setVisibility = async (req, res) => {
  const { id } = req.params;
  const { isHidden } = req.body;

  const c = await Comment.findByIdAndUpdate(
    id,
    { $set: { isHidden: !!isHidden } },
    { new: true }
  );
  if (!c) return res.status(404).json({ message: 'Commentaire introuvable' });
  res.json(c);
};

/** Supprimer (modération) */
exports.remove = async (req, res) => {
  const { id } = req.params;
  const del = await Comment.findByIdAndDelete(id);
  if (!del) return res.status(404).json({ message: 'Commentaire introuvable' });
  res.json({ ok: true });
};
