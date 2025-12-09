// backend/routes/adminContactRoutes.js
const express = require('express');
const router = express.Router();

const contactAdminController = require('../controllers/contactAdminController');
const { adminProtect } = require('../middleware/adminAuthMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

// Liste des messages
router.get(
  '/contact-messages',
  adminProtect,
  authorizeRoles('admin', 'superAdmin', 'owner'),
  contactAdminController.listMessages
);

// Détail d’un message
router.get(
  '/contact-messages/:id',
  adminProtect,
  authorizeRoles('admin', 'superAdmin', 'owner'),
  contactAdminController.getMessage
);

module.exports = router;
