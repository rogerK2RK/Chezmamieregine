const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require('../middleware/roleMiddleware');
const platController = require("../controllers/platController");

// Admin/owner : lister tous les plats
router.get('/', protect, authorizeRoles('admin','owner','superAdmin'), platController.getAllPlats);

// Créer
router.post('/', protect, authorizeRoles('admin','owner','superAdmin'), platController.createPlat);

// Mettre à jour
router.put('/:id', protect, authorizeRoles('admin','owner','superAdmin'), platController.updatePlat);

// Supprimer
router.delete('/:id', protect, authorizeRoles('admin','owner','superAdmin'), platController.deletePlat);

module.exports = router;
