const express = require('express');
const router = express.Router();

const commandeController = require('../controllers/commandeController'); // Contrôleur des commandes
const { adminProtect }   = require('../middleware/adminAuthMiddleware'); // Vérifie l’authentification admin
const { authorizeRoles } = require('../middleware/roleMiddleware'); // Vérifie les rôles autorisés

// Log de debug (utile en dev)
console.log('[DEBUG route <nom>]', typeof authorizeRoles);

// Liste toutes les commandes (réservé aux admins, owners, superAdmins)
router.get('/', adminProtect, authorizeRoles('admin','superAdmin','owner'), commandeController.getAllCommandes);

// Met à jour le statut d’une commande
router.put('/:id', adminProtect, authorizeRoles('admin','superAdmin','owner'), commandeController.updateCommandeStatus);

// Exporte le routeur pour utilisation dans server.js
module.exports = router;
