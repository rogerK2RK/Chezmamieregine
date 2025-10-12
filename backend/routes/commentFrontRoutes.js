const express = require('express');
const router = express.Router();
const { clientProtect } = require('../middleware/clientAuth'); // Vérifie le token client
const ctrl = require('../controllers/commentFrontController'); // Contrôleur des commentaires côté client

// Liste les commentaires d’un plat (accessible à tous)
router.get('/plat/:platId', ctrl.listByPlat);

// Création d’un commentaire (client connecté)
router.post('/', clientProtect, ctrl.create);

// Mise à jour d’un commentaire par son auteur
router.put('/:id', clientProtect, ctrl.updateOwn);

// Suppression d’un commentaire par son auteur
router.delete('/:id', clientProtect, ctrl.deleteOwn);

// Exporte le routeur
module.exports = router;
