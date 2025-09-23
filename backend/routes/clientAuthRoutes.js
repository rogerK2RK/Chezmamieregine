const express = require('express');
const router = express.Router();
const clientAuth = require('../controllers/clientAuthController');

// Auth client
router.post('/register', clientAuth.register);
router.post('/login', clientAuth.login);

module.exports = router;
