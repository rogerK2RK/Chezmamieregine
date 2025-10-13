const jwt = require('jsonwebtoken');
const Client = require('../models/Client');

const clientProtect = async (req, res, next) => {
  try {
    const auth = req.headers.authorization || '';
    if (!auth.startsWith('Bearer '))
      return res.status(401).json({ message: 'Non autorisé' });

    const token = auth.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const client = await Client.findById(decoded.id);
    if (!client) return res.status(401).json({ message: 'Compte introuvable' });

    req.client = client;
    next();
  } catch (e) {
    return res.status(401).json({ message: 'Token invalide' });
  }
};

module.exports = { clientProtect };
