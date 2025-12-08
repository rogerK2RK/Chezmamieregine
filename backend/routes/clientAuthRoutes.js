const express = require('express');
const router = express.Router();
const clientAuthController = require('../controllers/clientAuthController'); // Contrôleur d’authentification client

// Inscription d’un nouveau client
router.post('/register', clientAuthController.register);

// Connexion d’un client existant
router.post('/login', clientAuthController.login);

// Suppression du compte du client connecté
router.delete('/me', authClient, clientAuthController.deleteMe);

// Exporte le routeur pour l’utiliser dans server.js
module.exports = router;
