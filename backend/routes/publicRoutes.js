const router = require('express').Router();
const plat = require('../controllers/platController');
const category = require('../controllers/categoryController');
const contact = require('../controllers/contactController');
const comment = require('../controllers/commentController');

// Plats
router.get('/plats', plat.listPublic);
router.get('/plats/:id', plat.getPublic);

// Catégories
router.get('/categories', category.listPublic);

// Contact
router.post('/contact', contact.create);

// Commentaires d'un plat
router.get('/plats/:platId/comments', comment.listByPlat);
router.post('/plats/:platId/comments', comment.create);

module.exports = router;
