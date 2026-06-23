const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/jwt');

// Token client (30 jours).
module.exports = function generateToken(id, type = 'client') {
  return jwt.sign({ id, type }, JWT_SECRET, { expiresIn: '30d' });
};
