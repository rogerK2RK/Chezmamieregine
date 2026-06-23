const jwt = require('jsonwebtoken');
const Client = require('../models/Client');
const { JWT_SECRET } = require('../config/jwt');

const clientProtect = async (req, res, next) => {
  try {
    const auth = req.headers.authorization || '';
    if (!auth.startsWith('Bearer ')) return res.status(401).json({ message: 'Non autorisé' });

    const decoded = jwt.verify(auth.split(' ')[1], JWT_SECRET);
    const client = await Client.findById(decoded.id || decoded._id);
    if (!client) return res.status(401).json({ message: 'Compte introuvable' });

    req.client = client;
    next();
  } catch {
    return res.status(401).json({ message: 'Token invalide' });
  }
};

module.exports = { clientProtect };
