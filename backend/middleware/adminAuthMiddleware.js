// backend/middleware/adminAuthMiddleware.js
const jwt = require('jsonwebtoken');
const AdminUser = require('../models/AdminUser'); // 👈 IMPORTANT

async function adminProtect(req, res, next) {
  try {
    const auth = req.headers.authorization || '';
    if (!auth.startsWith('Bearer ')) return res.status(401).json({ message: 'Non autorisé (token manquant)' });

    const token  = auth.split(' ')[1];
    const secret = process.env.JWT_ADMIN_SECRET || process.env.JWT_SECRET;
    const decoded = jwt.verify(token, secret);

    const admin = await AdminUser.findById(decoded.id).select('-password'); // 👈 AdminUser
    if (!admin || !['admin','superAdmin','owner'].includes(admin.role)) {
      return res.status(403).json({ message: 'Accès admin requis' });
    }
    req.admin = admin;
    next();
  } catch {
    return res.status(401).json({ message: 'Token admin invalide' });
  }
}

module.exports = { adminProtect };
