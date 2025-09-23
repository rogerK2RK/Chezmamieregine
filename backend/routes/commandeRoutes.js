const express = require('express');
const router = express.Router();

const { adminProtect } = require('../middleware/adminAuth');              // BO
const { clientProtect } = require('../middleware/clientAuth');            // Client
const { authorizeAdminRoles } = require('../middleware/roleMiddleware');  // Rôles BO
const commandeController = require('../controllers/commandeController');



// Routes accessibles uniquement à admin/owner
router.get(
  '/',
  adminProtect,
  authorizeAdminRoles('admin', 'owner', 'superAdmin'),
  commandeController.getAllCommandes
);

router.put(
  '/:id',
  adminProtect,
  authorizeAdminRoles('admin', 'owner', 'superAdmin'),
  commandeController.updateCommandeStatus
);

// Routes pour les clients
router.get('/mes', clientProtect, commandeController.getMesCommandes);
router.post('/', clientProtect, commandeController.createCommande);

module.exports = router;
