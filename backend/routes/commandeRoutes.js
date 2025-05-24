const express = require("express");
const router = express.Router();
const commandeController = require("../controllers/commandeController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, commandeController.getAllCommandes);           // admin/owner
router.get("/mes", protect, commandeController.getMesCommandes);       // client
router.post("/", protect, commandeController.createCommande);          // client
router.put("/:id", protect, commandeController.updateCommandeStatus);  // admin/owner

module.exports = router;
