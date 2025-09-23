const jwt = require('jsonwebtoken');
module.exports = function generateToken(id, type = 'client') {
  return jwt.sign({ id, type }, process.env.JWT_SECRET, { expiresIn: '30d' });
};
