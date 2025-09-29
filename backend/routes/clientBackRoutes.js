// backend/routes/clientBackRoutes.js
const express = require('express');
const router = express.Router();

const { adminProtect } = require('../middleware/adminAuthMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const clientBack = require('../controllers/clientBackController');

// Lister tous les clients (admin/superAdmin/owner)
router.get(
  '/',
  adminProtect,
  authorizeRoles('superAdmin', 'admin', 'owner'),
  clientBack.getAllClients
);

// (Optionnel) Récupérer un client par ID
// router.get(
//   '/:id',
//   adminProtect,
//   authorizeRoles('superAdmin', 'admin'),
//   clientBack.getClientById
// );

// Mettre à jour un client
router.put(
  '/:id',
  adminProtect,
  authorizeRoles('superAdmin', 'admin'),
  clientBack.updateClient
);

// Supprimer un client
router.delete(
  '/:id',
  adminProtect,
  authorizeRoles('superAdmin'),
  clientBack.deleteClient
);

module.exports = router;
