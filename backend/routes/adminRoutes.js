const express = require('express');
const router = express.Router();
const { adminProtect } = require('../middleware/adminAuth');
const { authorizeAdminRoles } = require('../middleware/roleMiddleware');
const adminAuth = require('../controllers/adminAuthController');

router.post('/login', adminAuth.adminLogin);

router.post(
  '/create-user',
  adminProtect,
  authorizeAdminRoles('superAdmin', 'admin'),
  adminAuth.createAdminUser
);

module.exports = router;
