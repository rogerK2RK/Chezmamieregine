const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/jwt');

// Génère un token JWT valable 30 jours
// id → identifiant de l’utilisateur
// type → type de compte (par défaut : "client")
module.exports = function generateToken(id, type = 'client') {
  return jwt.sign({ id, type }, JWT_SECRET, { expiresIn: '30d' });
};
