const express = require('express');
const router = express.Router();
const { clientProtect } = require('../middleware/clientAuth');
const ctrl = require('../controllers/commentFrontController');

// lister commentaires d’un plat (public)
router.get('/plat/:platId', ctrl.listByPlat);

// créer un commentaire (client connecté)
router.post('/', clientProtect, ctrl.create);

// mettre à jour son propre commentaire
router.put('/:id', clientProtect, ctrl.updateOwn);

// supprimer son propre commentaire
router.delete('/:id', clientProtect, ctrl.deleteOwn);

module.exports = router;
