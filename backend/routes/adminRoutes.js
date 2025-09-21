const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");
const authController = require("../controllers/authController");
const adminController = require("../controllers/adminController");

// === Connexion admin ===
// POST /api/admin/login
router.post("/login", adminController.adminLogin);

// === Gestion utilisateurs par admin ===
// Seuls admin et superAdmin peuvent créer un compte admin/owner
router.post(
  "/create-user",
  protect,
  authorizeRoles("admin", "superAdmin"),
  authController.createUserByAdmin
);

module.exports = router;
