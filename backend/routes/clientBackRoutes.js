// backend/routes/clientBackRoutes.js
const express = require('express');
const router = express.Router();

const { adminProtect } = require('../middleware/adminAuthMiddleware');
const { authorizeAdminRoles } = require('../middleware/roleMiddleware');
const clientBack = require('../controllers/clientBackController');

// Rôles autorisés au listing
const allowList = ['superAdmin', 'admin', 'owner'];

router.get(
  '/',
  adminProtect,
  authorizeAdminRoles(...allowList),
  clientBack.getAllClients
);

router.put(
  '/:id',
  adminProtect,
  authorizeAdminRoles('superAdmin', 'admin'),
  clientBack.updateClient
);

router.post(
  '/:id/reset-password',
  adminProtect,
  authorizeAdminRoles('superAdmin', 'admin'),
  clientBack.resetPassword
);

router.delete(
  '/:id',
  adminProtect,
  authorizeAdminRoles('superAdmin'),
  clientBack.deleteClient
);

module.exports = router;
