const express = require('express');
const router = express.Router();

const { adminProtect } = require('../middleware/adminAuth');
const { authorizeAdminRoles } = require('../middleware/roleMiddleware');
const clientBack = require('../controllers/clientBackController');

// Lister tous les clients
router.get(
  '/',
  adminProtect,
  authorizeAdminRoles('superAdmin', 'admin', 'owner'),
  clientBack.getAllClients
);

// Mettre à jour un client (ex: nom, phone, adresses)
router.put(
  '/:id',
  adminProtect,
  authorizeAdminRoles('superAdmin', 'admin'),
  clientBack.updateClient
);

// Supprimer un client
router.delete(
  '/:id',
  adminProtect,
  authorizeAdminRoles('superAdmin'),
  clientBack.deleteClient
);

module.exports = router;
