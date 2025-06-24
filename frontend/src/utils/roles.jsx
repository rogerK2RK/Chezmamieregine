export const ROLES = {
  CLIENT: 'client',
  ADMIN: 'admin',
  SUPERADMIN: 'superAdmin',
  OWNER: 'owner', // si tu comptes l'utiliser
};

// Groupes de rôles (pour PrivateRoute ou autre)
export const ADMIN_ROLES = [ROLES.ADMIN, ROLES.SUPERADMIN];
export const FULL_ADMIN_ROLES = [ROLES.ADMIN, ROLES.SUPERADMIN, ROLES.OWNER];
