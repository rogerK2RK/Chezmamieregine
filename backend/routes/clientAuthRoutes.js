const express = require('express');
const router = express.Router();
const clientAuthController = require('../controllers/clientAuthController');
// 🔐 On importe bien le middleware avec le bon nom + bon fichier
const { clientProtect } = require('../middlewares/clientAuth');

// Inscription d’un nouveau client
router.post('/register', clientAuthController.register);

// Connexion d’un client existant
router.post('/login', clientAuthController.login);

// Profil du client connecté
router.get('/me', clientProtect, clientAuthController.me);

// Mise à jour du profil du client connecté
router.put('/me', clientProtect, clientAuthController.updateMe);

// Suppression du compte du client connecté
router.delete('/me', clientProtect, clientAuthController.deleteMe);

module.exports = router;
