// Middleware générique pour restreindre l’accès selon les rôles autorisés
function authorizeRoles(...allowed) {
  return (req, res, next) => {
    const role = req.admin?.role || req.user?.role; // Récupère le rôle (admin ou user)
    if (!role) return res.status(401).json({ message: 'Non autorisé' });
    if (!allowed.includes(role)) {
      return res.status(403).json({ message: 'Accès refusé : rôle insuffisant' });
    }
    next(); // Accès autorisé
  };
}

// Middleware spécifique pour les rôles d’administrateurs
function authorizeAdminRoles(...allowed) {
  return (req, res, next) => {
    if (!req.admin?.role) return res.status(401).json({ message: 'Non autorisé' });
    if (!allowed.includes(req.admin.role)) {
      return res.status(403).json({ message: 'Accès refusé : rôle insuffisant' });
    }
    next(); // Accès autorisé
  };
}

// Exporte les deux middlewares
module.exports = { authorizeRoles, authorizeAdminRoles };
