const jwt = require('jsonwebtoken');
const AdminUser = require('../models/AdminUser');

const adminProtect = async (req, res, next) => {
  try {
    const auth = req.headers.authorization || '';
    if (!auth.startsWith('Bearer ')) return res.status(401).json({ message: 'Non autorisé' });

    const token = auth.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.type !== 'admin') return res.status(403).json({ message: 'Token non admin' });

    const admin = await AdminUser.findById(decoded.id).select('-password');
    if (!admin) return res.status(401).json({ message: 'Admin introuvable' });

    req.admin = admin;
    next();
  } catch (e) {
    return res.status(401).json({ message: 'Token invalide' });
  }
};

module.exports = { adminProtect };