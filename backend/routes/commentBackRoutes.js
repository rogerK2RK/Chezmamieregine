const express = require('express');
const router = express.Router();
const { adminProtect } = require('../middleware/adminAuthMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const ctrl = require('../controllers/commentBackController');

// ✅ Liste des commentaires (admin)
router.get(
  '/',
  adminProtect,
  authorizeRoles('admin', 'superAdmin', 'owner'),
  ctrl.list
);

// ✅ Répondre à un commentaire (staff/admin)
router.patch(
  '/:id/reply',
  adminProtect,
  authorizeRoles('admin', 'superAdmin', 'owner'),
  ctrl.reply
);

// ✅ Masquer un commentaire
router.patch(
  '/:id/hide',
  adminProtect,
  authorizeRoles('admin', 'superAdmin', 'owner'),
  ctrl.hide
);

// ✅ Afficher (démasquer) un commentaire
router.patch(
  '/:id/unhide',
  adminProtect,
  authorizeRoles('admin', 'superAdmin', 'owner'),
  ctrl.unhide
);

// ✅ Supprimer un commentaire
router.delete(
  '/:id',
  adminProtect,
  authorizeRoles('admin', 'superAdmin', 'owner'),
  ctrl.remove
);

module.exports = router;
