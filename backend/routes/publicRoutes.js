const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const platController = require('../controllers/platController');

// Catégories visibles en front
router.get('/categories', categoryController.listPublic);

// Plats visibles en front, filtrables par catégorie
router.get('/plats', platController.listPublic);

module.exports = router;
