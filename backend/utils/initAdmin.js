const bcrypt = require('bcryptjs');
const AdminUser = require('../models/AdminUser');

// Crée automatiquement un super administrateur si aucun admin n’existe
async function ensureSuperAdmin() {
  try {
    // Vérifie si un admin existe déjà
    const count = await AdminUser.countDocuments();
    if (count > 0) {
      console.log('initAdmin: des admins existent déjà — aucune création.');
      return;
    }

    // Vérifie la présence des variables d’environnement nécessaires
    const { SUPERADMIN_NAME, SUPERADMIN_EMAIL, SUPERADMIN_PASSWORD } = process.env;
    if (!SUPERADMIN_NAME || !SUPERADMIN_EMAIL || !SUPERADMIN_PASSWORD) {
      console.log('initAdmin: SUPERADMIN_* manquantes — création ignorée.');
      return;
    }

    // Prépare les données du super admin
    const email = SUPERADMIN_EMAIL.trim().toLowerCase();
    const name  = SUPERADMIN_NAME.trim();

    // Hash le mot de passe et crée le compte
    const hashed = await bcrypt.hash(SUPERADMIN_PASSWORD, 10);
    const admin = await AdminUser.create({
      name,
      email,
      password: hashed,
      role: 'superAdmin',
    });

    console.log(`initAdmin: SuperAdmin créé (${admin.email})`);
  } catch (err) {
    console.error('initAdmin ERROR:', err.message);
  }
}

module.exports = { ensureSuperAdmin };
