const bcrypt = require('bcryptjs');
const AdminUser = require('../models/AdminUser');

// Crée un superAdmin à partir des variables d'env, seulement si aucun admin n'existe.
async function ensureSuperAdmin() {
  try {
    const count = await AdminUser.countDocuments();
    if (count > 0) return;

    const { SUPERADMIN_NAME, SUPERADMIN_EMAIL, SUPERADMIN_PASSWORD } = process.env;
    if (!SUPERADMIN_NAME || !SUPERADMIN_EMAIL || !SUPERADMIN_PASSWORD) {
      console.log('initAdmin: SUPERADMIN_* manquantes — création ignorée.');
      return;
    }

    const hashed = await bcrypt.hash(SUPERADMIN_PASSWORD, 10);
    const admin = await AdminUser.create({
      name: SUPERADMIN_NAME.trim(),
      email: SUPERADMIN_EMAIL.trim().toLowerCase(),
      password: hashed,
      role: 'superAdmin',
    });
    console.log('initAdmin: superAdmin créé →', admin.email);
  } catch (e) {
    console.error('initAdmin ERROR:', e.message);
  }
}

module.exports = { ensureSuperAdmin };
