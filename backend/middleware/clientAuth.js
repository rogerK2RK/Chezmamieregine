const jwt = require('jsonwebtoken');
const Client = require('../models/Client');

const clientProtect = async (req, res, next) => {
  try {
    const auth = req.headers.authorization || '';
    console.log('[clientProtect] auth =', auth.slice(0, 32) + '...'); // log entrée
    if (!auth.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Non autorisé' });
    }

    const token = auth.split(' ')[1];

    // ⚠️ Utilise EXACTEMENT le même secret que pour la signature (fallback inclus)
    const secret = process.env.JWT_SECRET || 'dev_secret';
    let decoded;
    try {
      decoded = jwt.verify(token, secret);
      console.log('[clientProtect] decoded =', decoded); // log payload
    } catch (e) {
      console.error('[clientProtect] verify ERROR:', e.name, e.message);
      return res.status(401).json({ message: 'Token invalide' });
    }

    const clientId = decoded.id || decoded._id;
    if (!clientId) {
      console.error('[clientProtect] no clientId in token payload');
      return res.status(401).json({ message: 'Token invalide' });
    }

    const client = await Client.findById(clientId);
    if (!client) {
      console.error('[clientProtect] Client introuvable pour id =', clientId);
      return res.status(401).json({ message: 'Compte introuvable' });
    }

    req.client = client;
    return next();
  } catch (e) {
    console.error('[clientProtect] ERROR:', e.name, e.message);
    return res.status(401).json({ message: 'Token invalide' });
  }
};

module.exports = { clientProtect };
