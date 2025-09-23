// backend/middleware/roleMiddleware.js
const authorizeAdminRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.admin) return res.status(401).json({ message: 'Non autorisé' });
    if (!roles.includes(req.admin.role)) {
      return res.status(403).json({ message: 'Accès refusé : rôle insuffisant' });
    }
    next();
  };
};

module.exports = { authorizeAdminRoles };
