const express = require('express');
const router = express.Router();
const { adminProtect } = require('../middleware/adminAuthMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const ctrl = require('../controllers/commentBackController');

// liste globale / recherche (BO)
router.get('/',
  adminProtect,
  authorizeRoles('admin', 'superAdmin', 'owner'),
  ctrl.list
);

// répondre (staff) à un commentaire
router.post('/:id/reply',
  adminProtect,
  authorizeRoles('admin', 'superAdmin', 'owner'),
  ctrl.reply
);

// masquer/afficher
router.patch('/:id/visibility',
  adminProtect,
  authorizeRoles('admin', 'superAdmin', 'owner'),
  ctrl.setVisibility
);

// suppression (modération)
router.delete('/:id',
  adminProtect,
  authorizeRoles('admin', 'superAdmin', 'owner'),
  ctrl.remove
);

module.exports = router;
