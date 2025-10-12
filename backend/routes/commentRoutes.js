const express = require("express");
const router = express.Router();
const { adminProtect } = require("../middleware/adminAuthMiddleware"); // Vérifie le token admin
const { authorizeRoles } = require("../middleware/roleMiddleware"); // Vérifie les rôles autorisés
const Comment = require("../models/Comment"); // Modèle de commentaire

// Récupère tous les commentaires (admin)
router.get(
  "/",
  adminProtect,
  authorizeRoles("admin", "owner", "superAdmin"),
  async (req, res) => {
    try {
      const comments = await Comment.find().sort({ createdAt: -1 }); // Tri par date décroissante
      res.json(comments);
    } catch (err) {
      console.error("[GET /admin/comments]", err);
      res.status(500).json({ message: "Erreur serveur" });
    }
  }
);

// Supprime un commentaire par son ID
router.delete(
  "/:id",
  adminProtect,
  authorizeRoles("admin", "owner", "superAdmin"),
  async (req, res) => {
    try {
      await Comment.findByIdAndDelete(req.params.id);
      res.json({ message: "Commentaire supprimé" });
    } catch (err) {
      console.error("[DELETE /admin/comments/:id]", err);
      res.status(500).json({ message: "Erreur serveur" });
    }
  }
);

// Exporte le routeur
module.exports = router;
