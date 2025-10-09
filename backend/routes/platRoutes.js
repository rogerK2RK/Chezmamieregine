const express = require('express');
const router = express.Router();

const platController = require('../controllers/platController');
const { adminProtect }   = require('../middleware/adminAuthMiddleware'); // ✅
const { authorizeRoles } = require('../middleware/roleMiddleware');      // ✅
console.log('[DEBUG route <nom>]', typeof authorizeRoles);

// ➤ PUBLIC
router.get('/public', platController.getPublicPlats);

router.get('/',     adminProtect, authorizeRoles('admin','superAdmin','owner'), platController.getAllPlats);
router.get('/:id',  adminProtect, authorizeRoles('admin','superAdmin','owner'), platController.getPlatById);
router.post('/',    adminProtect, authorizeRoles('admin','superAdmin','owner'), platController.createPlat);
router.put('/:id',  adminProtect, authorizeRoles('admin','superAdmin','owner'), platController.updatePlat);
router.delete('/:id', adminProtect, authorizeRoles('admin','superAdmin','owner'), platController.deletePlat);

module.exports = router;
