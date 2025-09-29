const express = require('express');
const router = express.Router();

const commandeController = require('../controllers/commandeController');
const { adminProtect }   = require('../middleware/adminAuthMiddleware'); // ✅
const { authorizeRoles } = require('../middleware/roleMiddleware');      // ✅
console.log('[DEBUG route <nom>]', typeof authorizeRoles);

router.get('/',    adminProtect, authorizeRoles('admin','superAdmin','owner'), commandeController.getAllCommandes);
router.put('/:id', adminProtect, authorizeRoles('admin','superAdmin','owner'), commandeController.updateCommandeStatus);

// (routes client éventuelles avec protect client, pas adminProtect)
module.exports = router;
