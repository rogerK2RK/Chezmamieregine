const jwt = require('jsonwebtoken');
const Client = require('../models/Client');

const clientProtect = async (req, res, next) => {
  try {
    const auth = req.headers.authorization || '';
    if (!auth.startsWith('Bearer ')) return res.status(401).json({ message: 'Non autorisé' });

    const token = auth.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.type !== 'client') return res.status(403).json({ message: 'Token non client' });

    const client = await Client.findById(decoded.id).select('-password');
    if (!client) return res.status(401).json({ message: 'Client introuvable' });

    req.client = client;
    next();
  } catch (e) {
    return res.status(401).json({ message: 'Token invalide' });
  }
};

module.exports = { clientProtect };