const express = require('express');
const router = express.Router();

const c = require('../controllers/categoryController');
const { adminProtect } = require('../middleware/adminAuthMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

// ➤ Si ?public=1 → route non protégée
router.get('/', async (req, res, next) => {
  if (String(req.query.public) === '1') {
    return c.publicList(req, res);
  }
  return next();
}, adminProtect, authorizeRoles('admin', 'owner', 'superAdmin'), c.list);

// ➤ ADMIN CRUD
router.post('/', adminProtect, authorizeRoles('admin', 'owner', 'superAdmin'), c.create);
router.put('/:id', adminProtect, authorizeRoles('admin', 'owner', 'superAdmin'), c.update);
router.delete('/:id', adminProtect, authorizeRoles('owner', 'superAdmin'), c.remove);

// ➤ Assignations
router.post('/:id/assign-plats', adminProtect, authorizeRoles('admin', 'owner', 'superAdmin'), c.assignPlats);
router.post('/unassign-plats', adminProtect, authorizeRoles('admin', 'owner', 'superAdmin'), c.unassignPlats);

// ➤ Lister les plats d’une catégorie (publique)
router.get('/:id/plats', c.listPlatsOfCategory);

module.exports = router;
