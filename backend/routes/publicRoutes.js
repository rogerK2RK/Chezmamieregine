const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController'); // Contrôleur des catégories
const platController = require('../controllers/platController'); // Contrôleur des plats

// Liste des catégories visibles sur le site (front)
router.get('/categories', categoryController.listPublic);

// Liste des plats disponibles, avec option de filtrage par catégorie
router.get('/plats', platController.listPublic);

// Détail d’un plat spécifique (par ID)
router.get('/plats/:id', platController.getOnePublic);

// Exporte le routeur public
module.exports = router;
