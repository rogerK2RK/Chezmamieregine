// backend/routes/categoryRoutes.js
const express = require('express');
const router = express.Router();

const { adminProtect } = require('../middleware/adminAuthMiddleware'); // ✅ bon fichier
const { authorizeRoles } = require('../middleware/roleMiddleware');    // ✅ middleware unifié
const ctrl = require('../controllers/categoryController');

const allow = ['admin', 'owner', 'superAdmin'];

// CRUD Catégories
router.get('/', adminProtect, authorizeRoles(...allow), ctrl.list);
router.post('/', adminProtect, authorizeRoles(...allow), ctrl.create);
router.put('/:id', adminProtect, authorizeRoles(...allow), ctrl.update);
router.delete('/:id', adminProtect, authorizeRoles(...allow), ctrl.remove);

// Gestion association plats <-> catégorie
router.get('/:id/plats', adminProtect, authorizeRoles(...allow), ctrl.listPlatsOfCategory);
router.post('/:id/assign-plats', adminProtect, authorizeRoles(...allow), ctrl.assignPlats);
router.post('/unassign-plats', adminProtect, authorizeRoles(...allow), ctrl.unassignPlats);

module.exports = router;
