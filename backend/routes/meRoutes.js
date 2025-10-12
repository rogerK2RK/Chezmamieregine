const express = require('express');
const router = express.Router();
const { clientProtect } = require('../middleware/clientAuth');
const ctrl = require('../controllers/meController');

router.get('/',  clientProtect, ctrl.getMe);
router.put('/',  clientProtect, ctrl.updateMe);

module.exports = router;
