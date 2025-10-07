const express = require('express');
const router = express.Router();
const { adminProtect } = require('../middleware/adminAuthMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const ctrl = require('../controllers/commentBackController');

const ALLOW = ['owner','admin','superAdmin'];

router.get('/', adminProtect, authorizeRoles(...ALLOW), ctrl.adminList);
router.put('/:id/reply', adminProtect, authorizeRoles(...ALLOW), ctrl.reply);
router.put('/:id/status', adminProtect, authorizeRoles(...ALLOW), ctrl.setStatus);
router.delete('/:id', adminProtect, authorizeRoles(...ALLOW), ctrl.remove);

module.exports = router;
