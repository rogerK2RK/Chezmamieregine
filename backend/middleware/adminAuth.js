const jwt = require('jsonwebtoken');
const AdminUser = require('../models/AdminUser');
const { JWT_ADMIN_SECRET } = require('../config/jwt');

// Vérifie le JWT admin + existence en base.
const adminProtect = async (req, res, next) => {
  try {
    const auth = req.headers.authorization || '';
    if (!auth.startsWith('Bearer ')) return res.status(401).json({ message: 'No token' });

    const decoded = jwt.verify(auth.split(' ')[1], JWT_ADMIN_SECRET);
    if (decoded.type !== 'admin' || !['admin', 'owner', 'superAdmin'].includes(decoded.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const admin = await AdminUser.findById(decoded.id).lean();
    if (!admin) return res.status(401).json({ message: 'Invalid admin' });

    req.admin = admin;
    next();
  } catch {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

// Restreint à certains rôles.
const requireRole = (...roles) => (req, res, next) => {
  if (!req.admin || !roles.includes(req.admin.role)) {
    return res.status(403).json({ message: 'Rôle insuffisant' });
  }
  next();
};

module.exports = { adminProtect, requireRole };
