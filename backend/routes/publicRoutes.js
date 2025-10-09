const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const platController = require('../controllers/platController');

router.get('/categories', categoryController.listPublic);
router.get('/plats', platController.listPublic);

module.exports = router;
