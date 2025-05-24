const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const platController = require("../controllers/platController");

// Public routes
router.get("/", platController.getPlats);
router.get("/:id", platController.getPlatById);

// Protected routes (owners/admin)
router.post("/", protect, platController.createPlat);
router.put("/:id", protect, platController.updatePlat);
router.delete("/:id", protect, platController.deletePlat);

module.exports = router;
