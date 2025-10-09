// backend/routes/commentRoutes.js
const express = require("express");
const router = express.Router();
const { adminProtect } = require("../middleware/adminAuthMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

// Exemple de contrôleur minimal (à adapter à ton modèle réel)
const Comment = require("../models/Comment"); // ⚠️ Crée ce modèle si pas encore

// [GET] /api/admin/comments — liste tous les commentaires
router.get("/", adminProtect, authorizeRoles("admin", "owner", "superAdmin"), async (req, res) => {
  try {
    const comments = await Comment.find().sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) {
    console.error("[GET /admin/comments]", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// [DELETE] /api/admin/comments/:id — supprimer un commentaire
router.delete("/:id", adminProtect, authorizeRoles("admin", "owner", "superAdmin"), async (req, res) => {
  try {
    await Comment.findByIdAndDelete(req.params.id);
    res.json({ message: "Commentaire supprimé" });
  } catch (err) {
    console.error("[DELETE /admin/comments/:id]", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;
