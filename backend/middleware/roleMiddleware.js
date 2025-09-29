// ✅ DOIT ÊTRE COMME ÇA
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

module.exports = { authorizeRoles };
