const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

const app = express();

/** CORS */
const FRONT_ORIGIN = process.env.FRONT_ORIGIN || "http://localhost:5173";
app.use(cors({
  origin: FRONT_ORIGIN,
  credentials: true,
}));

app.use(express.json());

/** Routes ADMIN */
const adminRoutes = require("./routes/adminRoutes");
app.use("/api/admin", adminRoutes);

/** Routes CLIENT */
const clientAuthRoutes = require("./routes/clientAuthRoutes");
app.use("/api/auth", clientAuthRoutes);

/** Autres routes métiers */
const platRoutes = require("./routes/platRoutes");
const commandeRoutes = require("./routes/commandeRoutes");
app.use("/api/plats", platRoutes);
app.use("/api/commandes", commandeRoutes);

/** Ping / health */
app.get("/healthz", (_req, res) => res.json({ ok: true }));

/** 404 */
app.use((req, res, _next) => {
  res.status(404).json({ message: `Route introuvable: ${req.method} ${req.originalUrl}` });
});

/** Handler d’erreurs */
app.use((err, _req, res, _next) => {
  console.error("API error:", err);
  res.status(err.status || 500).json({ message: err.message || "Erreur serveur" });
});

/** ⬇️ Import ET appel de l'init superAdmin après connexion DB */
const { ensureSuperAdmin } = require('./utils/initAdmin');

(async () => {
  await connectDB();            // on attend la connexion Mongo
  await ensureSuperAdmin();     // on crée le superAdmin si nécessaire

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 Serveur lancé sur le port ${PORT}`));
})();
