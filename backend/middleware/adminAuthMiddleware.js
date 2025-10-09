// backend/middleware/adminAuthMiddleware.js
const jwt = require('jsonwebtoken');
const AdminUser = require('../models/AdminUser');

exports.adminProtect = async (req, res, next) => {
  try {
    const auth = req.headers.authorization || '';
    if (!auth.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token' });
    }

    const token = auth.split(' ')[1];
    // 👇 même secret que dans adminAuthController
    const decoded = jwt.verify(token, process.env.JWT_ADMIN_SECRET || process.env.JWT_SECRET);

    // On exige un type/role admin dans le token
    if (!decoded.type || !['admin', 'owner', 'superAdmin'].includes(decoded.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const admin = await AdminUser.findById(decoded.id).lean();
    if (!admin) return res.status(401).json({ message: 'Invalid admin' });

    req.admin = admin;
    next();
  } catch (e) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};
