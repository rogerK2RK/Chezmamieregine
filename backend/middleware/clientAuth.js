// backend/middleware/clientAuth.js
const jwt = require('jsonwebtoken');
const Client = require('../models/Client');

const clientProtect = async (req, res, next) => {
  try {
    const auth = req.headers.authorization || '';
    if (!auth.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Non autorisé' });
    }

    const token = auth.split(' ')[1];
    // ✅ utilise le même secret que celui utilisé pour signer
    const secret = process.env.JWT_CLIENT_SECRET || process.env.JWT_SECRET;
    const decoded = jwt.verify(token, secret);

    // (optionnel mais conseillé) s’assurer que c’est bien un token client
    if (decoded.type && decoded.type !== 'client') {
      return res.status(403).json({ message: 'Type de token invalide' });
    }

    const clientId = decoded.id || decoded._id;
    const client = await Client.findById(clientId);
    if (!client) return res.status(401).json({ message: 'Compte introuvable' });

    req.client = client;
    next();
  } catch (e) {
    return res.status(401).json({ message: 'Token invalide' });
  }
};

module.exports = { clientProtect };
