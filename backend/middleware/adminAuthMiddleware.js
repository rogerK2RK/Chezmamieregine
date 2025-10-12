const jwt = require('jsonwebtoken');
const AdminUser = require('../models/AdminUser');

exports.adminProtect = async (req, res, next) => {
  try {
    // Vérifie la présence d’un jeton JWT dans l’en-tête Authorization
    const auth = req.headers.authorization || '';
    if (!auth.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token' });
    }

    // Extrait et vérifie le jeton avec la clé secrète
    const token = auth.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_ADMIN_SECRET || process.env.JWT_SECRET);

    // Vérifie le rôle et le type de compte du token
    if (!decoded.type || !['admin', 'owner', 'superAdmin'].includes(decoded.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    // Vérifie que l’administrateur existe encore en base
    const admin = await AdminUser.findById(decoded.id).lean();
    if (!admin) return res.status(401).json({ message: 'Invalid admin' });

    // Attache les infos admin à la requête pour la suite du traitement
    req.admin = admin;
    next(); // Passe la main au middleware ou contrôleur suivant
  } catch (e) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};
