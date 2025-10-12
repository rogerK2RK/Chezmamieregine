const jwt    = require('jsonwebtoken');
const Client = require('../models/Client');

// Middleware d’authentification pour les clients
const clientProtect = async (req, res, next) => {
  try {
    // Vérifie la présence d’un token "Bearer ..."
    const auth = req.headers.authorization || '';
    if (!auth.startsWith('Bearer ')) 
      return res.status(401).json({ message: 'Non autorisé' });

    // Extrait et vérifie le token JWT
    const token   = auth.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_CLIENT_SECRET || process.env.JWT_SECRET);

    // Empêche l’accès si le token n’est pas de type client
    if (decoded.type && decoded.type !== 'client') {
      return res.status(403).json({ message: 'Type de token invalide' });
    }

    // Recherche du client associé au token
    const client = await Client.findById(decoded.id);
    if (!client) return res.status(401).json({ message: 'Compte introuvable' });

    // Attache le client à la requête
    req.client = client;
    next(); // Passe au middleware ou contrôleur suivant
  } catch (e) {
    // Erreur : token absent, invalide ou expiré
    return res.status(401).json({ message: 'Token invalide' });
  }
};

// Exporte le middleware
module.exports = { clientProtect };
