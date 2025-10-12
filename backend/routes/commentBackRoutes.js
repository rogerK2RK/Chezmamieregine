const express = require('express');
const router = express.Router();
const { adminProtect } = require('../middleware/adminAuthMiddleware'); // Vérifie le token admin
const { authorizeRoles } = require('../middleware/roleMiddleware'); // Vérifie les rôles autorisés
const ctrl = require('../controllers/commentBackController'); // Contrôleur des commentaires côté admin

// Liste ou recherche des commentaires (back-office)
router.get('/',
  adminProtect,
  authorizeRoles('admin', 'superAdmin', 'owner'),
  ctrl.list
);

// Répondre à un commentaire (staff/admin)
router.post('/:id/reply',
  adminProtect,
  authorizeRoles('admin', 'superAdmin', 'owner'),
  ctrl.reply
);

// Modifier la visibilité d’un commentaire (masquer/afficher)
router.patch('/:id/visibility',
  adminProtect,
  authorizeRoles('admin', 'superAdmin', 'owner'),
  ctrl.setVisibility
);

// Supprimer un commentaire (modération)
router.delete('/:id',
  adminProtect,
  authorizeRoles('admin', 'superAdmin', 'owner'),
  ctrl.remove
);

// Exporte le routeur
module.exports = router;
