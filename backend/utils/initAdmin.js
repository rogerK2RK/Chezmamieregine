const bcrypt = require('bcryptjs');
const AdminUser = require('../models/AdminUser');

async function ensureSuperAdmin() {
  try {
    const count = await AdminUser.countDocuments();
    if (count > 0) {
      console.log('initAdmin: des admins existent déjà — aucune création.');
      return;
    }

    const { SUPERADMIN_NAME, SUPERADMIN_EMAIL, SUPERADMIN_PASSWORD } = process.env;
    if (!SUPERADMIN_NAME || !SUPERADMIN_EMAIL || !SUPERADMIN_PASSWORD) {
      console.log('initAdmin: SUPERADMIN_* manquantes — création ignorée.');
      return;
    }

    const hashed = await bcrypt.hash(SUPERADMIN_PASSWORD, 10);
    const admin = await AdminUser.create({
      name: SUPERADMIN_NAME,
      email: SUPERADMIN_EMAIL,
      password: hashed,
      role: 'superAdmin',
    });
    console.log(`initAdmin: SuperAdmin créé (${admin.email})`);
  } catch (err) {
    console.error('initAdmin ERROR:', err.message);
  }
}

module.exports = { ensureSuperAdmin };