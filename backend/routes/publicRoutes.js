const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const platController = require('../controllers/platController');

// Catégories visibles en front
router.get('/categories', categoryController.listPublic);

// Plats visibles en front, filtrables par catégorie
router.get('/plats', platController.listPublic);

// Récupérer un plat précis par ID
router.get('/plats/:id', platController.getOnePublic);

module.exports = router;
