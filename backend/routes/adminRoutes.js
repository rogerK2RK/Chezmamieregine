// backend/routes/adminRoutes.js
const express = require("express");
const router = express.Router();

const { adminProtect }   = require("../middleware/adminAuthMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");
const adminAuthController = require("../controllers/adminAuthController");

// Préflight spécifique pour /login (ceinture + bretelles)
router.options("/login", (req, res) => res.sendStatus(204));

// --- Login admin (PUBLIC) ---
router.post("/login", adminAuthController.loginAdmin);

// --- Création d'utilisateur (protégée) ---
router.post(
  "/create-user",
  adminProtect,
  authorizeRoles("admin", "superAdmin"),
  adminAuthController.createUserByAdmin
);

// --- Liste des utilisateurs (protégée) ---
router.get(
  "/users",
  adminProtect,
  authorizeRoles("admin", "superAdmin", "owner"),
  adminAuthController.listAdmins
);

module.exports = router;
