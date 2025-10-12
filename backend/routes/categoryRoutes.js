const express = require('express');
const router = express.Router();

const c = require('../controllers/categoryController'); // Contrôleur des catégories
const { adminProtect } = require('../middleware/adminAuthMiddleware'); // Vérifie le token admin
const { authorizeRoles } = require('../middleware/roleMiddleware'); // Vérifie le rôle admin

// Liste des catégories — publique ou admin
router.get('/', async (req, res, next) => {
  if (String(req.query.public) === '1') {
    // Si ?public=1 → liste publique
    return c.publicList(req, res);
  }
  return next(); // Sinon continue vers la version protégée
}, adminProtect, authorizeRoles('admin', 'owner', 'superAdmin'), c.list);

// CRUD Admin
router.post('/', adminProtect, authorizeRoles('admin', 'owner', 'superAdmin'), c.create); // Créer une catégorie
router.put('/:id', adminProtect, authorizeRoles('admin', 'owner', 'superAdmin'), c.update); // Modifier une catégorie
router.delete('/:id', adminProtect, authorizeRoles('owner', 'superAdmin'), c.remove); // Supprimer une catégorie

// Gestion des plats liés à une catégorie
router.post('/:id/assign-plats', adminProtect, authorizeRoles('admin', 'owner', 'superAdmin'), c.assignPlats); // Assigner des plats
router.post('/unassign-plats', adminProtect, authorizeRoles('admin', 'owner', 'superAdmin'), c.unassignPlats); // Détacher des plats

// Liste des plats d’une catégorie (publique)
router.get('/:id/plats', c.listPlatsOfCategory);

module.exports = router;
