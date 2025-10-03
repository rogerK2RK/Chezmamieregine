const express = require('express');
const router = express.Router();

const { adminProtect }   = require('../middleware/adminAuthMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
console.log('[DEBUG route <nom>]', typeof authorizeRoles);
const adminAuthController = require('../controllers/adminAuthController');

// Login admin
router.post(
  '/login', adminAuthController.loginAdmin
);

// Créer un utilisateur
router.post(
  '/create-user',
  adminProtect,
  authorizeRoles('admin', 'superAdmin'),
  adminAuthController.createUserByAdmin
);

// Lister les utilisateurs “back-office”
router.get(
  '/users',
  adminProtect,
  authorizeRoles('admin', 'superAdmin', 'owner'),
  adminAuthController.listAdmins
);

module.exports = router;
