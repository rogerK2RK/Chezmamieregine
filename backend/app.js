// backend/app.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("./config/db");
const { ensureSuperAdmin } = require("./utils/initAdmin");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ======================
// CORS (pour le local et le déploiement futur)
// ======================
const allowedOrigins = [
  "http://localhost:5173",                         // Front local
  process.env.FRONTEND_URL || "https://chezmamier egine.vercel.app" // Prod
];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS: " + origin));
    },
    credentials: true,
  })
);

// ======================
app.use(express.json());

// ======================
// Health checks simples
// ======================
app.get("/health", (_req, res) => res.send("ok"));
app.get("/api/health", (_req, res) => res.send("ok"));

// ======================
// Fichiers statiques
// ======================
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ======================
// Routes API
// ======================
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/auth", require("./routes/clientAuthRoutes"));
app.use("/api/admin/clients", require("./routes/clientBackRoutes"));
app.use("/api/categories", require("./routes/categoryRoutes"));
app.use("/api/plats", require("./routes/platRoutes"));
app.use("/api/commandes", require("./routes/commandeRoutes"));
app.use("/api/public", require("./routes/publicRoutes"));
app.use("/api/uploads", require("./routes/uploadRoutes"));

// ======================
// Gestion 404 & erreurs
// ======================
app.use((req, res) => {
  res.status(404).json({ message: `Route introuvable: ${req.method} ${req.originalUrl}` });
});

app.use((err, _req, res, _next) => {
  console.error("API error:", err);
  res.status(err.status || 500).json({ message: err.message || "Erreur serveur" });
});

// ======================
// Boot (connexion + admin)
// ======================
(async () => {
  await connectDB();
  await ensureSuperAdmin();
})();

app.listen(PORT, () => {
  console.log(`🚀 API running on http://localhost:${PORT}`);
});
