// backend/routes/adminRoutes.js
const express = require("express");
const router = express.Router();

const { adminProtect }   = require("../middleware/adminAuthMiddleware"); // Vérifie le token admin
const { authorizeRoles } = require("../middleware/roleMiddleware"); // Contrôle d’accès par rôle
const adminAuthController = require("../controllers/adminAuthController"); // Contrôleurs admin

// Répond aux requêtes OPTIONS pour /login (préflight CORS)
router.options("/login", (req, res) => res.sendStatus(204));

// Route publique — connexion admin
router.post("/login", adminAuthController.loginAdmin);

// Route protégée — création d’un nouvel utilisateur admin
router.post(
  "/create-user",
  adminProtect, // Vérifie le token admin
  authorizeRoles("admin", "superAdmin"), // Autorise seulement certains rôles
  adminAuthController.createUserByAdmin
);

// Route protégée — liste des utilisateurs admin
router.get(
  "/users",
  adminProtect,
  authorizeRoles("admin", "superAdmin", "owner"),
  adminAuthController.listAdmins
);

// Exporte le routeur pour utilisation dans server.js
module.exports = router;
