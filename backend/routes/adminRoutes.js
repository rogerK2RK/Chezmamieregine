const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");
const authController = require("../controllers/authController");

// Seuls admin et superAdmin peuvent créer admin/owner
router.post("/create-user", protect, authorizeRoles("admin", "superAdmin"), authController.createUserByAdmin);

console.log("authorizeRoles typeof:", typeof authorizeRoles);

module.exports = router;

