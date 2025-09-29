const express = require('express');
const router = express.Router();

const { adminProtect }   = require('../middleware/adminAuthMiddleware'); // ✅
const { authorizeRoles } = require('../middleware/roleMiddleware');      // ✅
console.log('[DEBUG route <nom>]', typeof authorizeRoles);
const adminAuthController = require('../controllers/adminAuthController'); // ✅

router.post('/login', adminAuthController.loginAdmin);

router.post(
  '/create-user',
  adminProtect,                                // ✅ D’ABORD
  authorizeRoles('admin', 'superAdmin'),       // ✅ ENSUITE
  adminAuthController.createUserByAdmin
);

module.exports = router;
