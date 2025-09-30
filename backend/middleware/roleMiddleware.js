// Middleware générique : accepte un rôle depuis req.admin (back) OU req.user (front)
function authorizeRoles(...allowed) {
  return (req, res, next) => {
    const role = req.admin?.role || req.user?.role;
    if (!role) return res.status(401).json({ message: 'Non autorisé' });
    if (!allowed.includes(role)) {
      return res.status(403).json({ message: 'Accès refusé : rôle insuffisant' });
    }
    next();
  };
}

// Variante dédiée admin pour le back-office
function authorizeAdminRoles(...allowed) {
  return (req, res, next) => {
    if (!req.admin?.role) return res.status(401).json({ message: 'Non autorisé' });
    if (!allowed.includes(req.admin.role)) {
      return res.status(403).json({ message: 'Accès refusé : rôle insuffisant' });
    }
    next();
  };
}

module.exports = { authorizeRoles, authorizeAdminRoles };
