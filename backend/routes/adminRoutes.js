const express = require('express');
const router = express.Router();

const { adminProtect }   = require('../middleware/adminAuthMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const adminAuthController = require('../controllers/adminAuthController');

// ✅ répondre au préflight CORS sur /login
router.options('/login', (_req, res) => res.sendStatus(204));

// ✅ Login PUBLIC (aucun middleware de protection ici)
router.post('/login', ctrl.login);

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
