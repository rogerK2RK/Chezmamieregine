const express = require('express');
const router = express.Router();

const { adminProtect } = require('../middleware/adminAuth');           // ✅
const { authorizeAdminRoles } = require('../middleware/roleMiddleware'); // ✅
const platController = require('../controllers/platController');

// Routes BO (gestion des plats)
router.get(
  '/',
  adminProtect,
  authorizeAdminRoles('admin', 'owner', 'superAdmin'),
  platController.getAllPlats
);

router.post(
  '/',
  adminProtect,
  authorizeAdminRoles('admin', 'owner', 'superAdmin'),
  platController.createPlat
);

router.put(
  '/:id',
  adminProtect,
  authorizeAdminRoles('admin', 'owner', 'superAdmin'),
  platController.updatePlat
);

router.delete(
  '/:id',
  adminProtect,
  authorizeAdminRoles('admin', 'owner', 'superAdmin'),
  platController.deletePlat
);

module.exports = router;
