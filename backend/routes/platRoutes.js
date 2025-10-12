const express = require('express');
const router = express.Router();

const platController = require('../controllers/platController'); // Contrôleur des plats
const { adminProtect }   = require('../middleware/adminAuthMiddleware'); // Vérifie le token admin
const { authorizeRoles } = require('../middleware/roleMiddleware'); // Vérifie les rôles autorisés

// Log de debug (utile en développement)
console.log('[DEBUG route <nom>]', typeof authorizeRoles);

// Route publique — liste des plats visibles pour le front
router.get('/public', platController.getPublicPlats);

// Routes protégées (admin / owner / superAdmin)
router.get('/', adminProtect, authorizeRoles('admin','superAdmin','owner'), platController.getAllPlats); // Liste tous les plats
router.get('/:id', adminProtect, authorizeRoles('admin','superAdmin','owner'), platController.getPlatById); // Détail d’un plat
router.post('/', adminProtect, authorizeRoles('admin','superAdmin','owner'), platController.createPlat); // Créer un plat
router.put('/:id', adminProtect, authorizeRoles('admin','superAdmin','owner'), platController.updatePlat); // Modifier un plat
router.delete('/:id', adminProtect, authorizeRoles('admin','superAdmin','owner'), platController.deletePlat); // Supprimer un plat

// Exporte le routeur
module.exports = router;
