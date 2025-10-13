// backend/middleware/clientAuth.js
const jwt = require('jsonwebtoken');
const Client = require('../models/Client');

const clientProtect = async (req, res, next) => {
  try {
    const auth = req.headers.authorization || '';
    if (!auth.startsWith('Bearer '))
      return res.status(401).json({ message: 'Non autorisé' });

    const token = auth.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_CLIENT_SECRET || process.env.JWT_SECRET);

    // Vérifie que le token est bien de type client
    if (decoded.type && decoded.type !== 'client') {
      return res.status(403).json({ message: 'Type de token invalide' });
    }

    const client = await Client.findById(decoded.id);
    if (!client) return res.status(401).json({ message: 'Compte introuvable' });

    req.client = client;
    next();
  } catch (e) {
    return res.status(401).json({ message: 'Token invalide ou expiré' });
  }
};

module.exports = { clientProtect };
