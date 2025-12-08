// backend/routes/meRoutes.js
const express = require('express');
const router = express.Router();

// Middleware d'auth client
const { clientProtect } = require('../middleware/clientAuth');

// Contrôleur "me"
const meController = require('../controllers/meController');

// GET /api/me → profil du client connecté
router.get('/', clientProtect, meController.getMe);

// PUT /api/me → mise à jour du profil
router.put('/', clientProtect, meController.updateMe);

// DELETE /api/me → suppression du compte
router.delete('/', clientProtect, meController.deleteMe);

module.exports = router;
