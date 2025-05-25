const express = require("express");
const router = express.Router();
const commandeController = require("../controllers/commandeController");
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");


// Routes accessibles uniquement à admin/owner
router.get("/", protect, authorizeRoles("admin", "owner"), commandeController.getAllCommandes);
router.put("/:id", protect, authorizeRoles("admin", "owner"), commandeController.updateCommandeStatus);

// Routes pour les clients
router.get("/mes", protect, commandeController.getMesCommandes);
router.post("/", protect, commandeController.createCommande);

console.log("commandeController.getAllCommandes typeof:", typeof commandeController.getAllCommandes);
console.log("protect typeof:", typeof protect);
console.log("authorizeRoles typeof:", typeof authorizeRoles);


module.exports = router;
