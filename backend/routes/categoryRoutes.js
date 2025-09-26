const express = require('express');
const router = express.Router();

const { adminProtect } = require('../middleware/adminAuth');
const { authorizeAdminRoles } = require('../middleware/roleMiddleware');
const ctrl = require('../controllers/categoryController');

const allow = [ 'admin', 'owner', 'superAdmin' ];

router.get('/', adminProtect, authorizeAdminRoles(...allow), ctrl.list);
router.post('/', adminProtect, authorizeAdminRoles(...allow), ctrl.create);
router.put('/:id', adminProtect, authorizeAdminRoles(...allow), ctrl.update);
router.delete('/:id', adminProtect, authorizeAdminRoles(...allow), ctrl.remove);

// gestion d’association plats <-> catégorie
router.get('/:id/plats', adminProtect, authorizeAdminRoles(...allow), ctrl.listPlatsOfCategory);
router.post('/:id/assign-plats', adminProtect, authorizeAdminRoles(...allow), ctrl.assignPlats);
router.post('/unassign-plats', adminProtect, authorizeAdminRoles(...allow), ctrl.unassignPlats);

module.exports = router;
