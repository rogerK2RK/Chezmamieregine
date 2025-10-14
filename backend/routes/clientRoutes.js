// backend/routes/clientRoutes.js
const express = require('express');
const router = express.Router();
const { clientProtect } = require('../middleware/clientAuth');
const clientCtrl = require('../controllers/clientAuthController'); // suppose que tu as clientController.me

router.get('/me', clientProtect, clientCtrl.me);
router.put('/me', clientProtect, clientCtrl.updateMe);

module.exports = router;
