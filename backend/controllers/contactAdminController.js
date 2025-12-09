// backend/controllers/contactAdminController.js
const ContactMessage = require('../models/ContactMessage');

// GET /api/admin/contact-messages  -> liste
exports.listMessages = async (req, res) => {
  try {
    const messages = await ContactMessage
      .find()
      .sort({ createdAt: -1 });

    res.json(messages);
  } catch (e) {
    console.error('GET /api/admin/contact-messages ERROR:', e);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// GET /api/admin/contact-messages/:id  -> détail
exports.getMessage = async (req, res) => {
  try {
    const msg = await ContactMessage.findById(req.params.id);
    if (!msg) return res.status(404).json({ message: 'Message introuvable' });

    // on marque comme lu
    if (!msg.isRead) {
      msg.isRead = true;
      await msg.save();
    }

    res.json(msg);
  } catch (e) {
    console.error('GET /api/admin/contact-messages/:id ERROR:', e);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
