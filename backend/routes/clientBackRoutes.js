const express = require('express');
const router = express.Router();

const { adminProtect } = require('../middleware/adminAuthMiddleware'); // Vérifie le token admin
const { authorizeAdminRoles } = require('../middleware/roleMiddleware'); // Vérifie le rôle admin
const clientBack = require('../controllers/clientBackController'); // Contrôleur de gestion des clients

// Rôles autorisés pour voir la liste
const allowList = ['superAdmin', 'admin', 'owner'];

// Liste tous les clients
router.get(
  '/',
  adminProtect,
  authorizeAdminRoles(...allowList),
  clientBack.getAllClients
);

// Modifier un client
router.put(
  '/:id',
  adminProtect,
  authorizeAdminRoles('superAdmin', 'admin'),
  clientBack.updateClient
);

// Réinitialiser le mot de passe d’un client
router.post(
  '/:id/reset-password',
  adminProtect,
  authorizeAdminRoles('superAdmin', 'admin'),
  clientBack.resetPassword
);

// Supprimer un client
router.delete(
  '/:id',
  adminProtect,
  authorizeAdminRoles('superAdmin'),
  clientBack.deleteClient
);

// Exporte le routeur pour utilisation dans server.js
module.exports = router;
