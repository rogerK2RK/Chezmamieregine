const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authController"); // Import des fonctions de contrôle

// Route d’inscription utilisateur
router.post("/register", register);

// Route de connexion utilisateur
router.post("/login", login);

// Exporte le routeur pour l’utiliser dans server.js
module.exports = router;
