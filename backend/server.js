const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const path = require("path");

dotenv.config();
const app = express();

/** CORS */
const FRONT_ORIGIN = process.env.FRONT_ORIGIN || "http://localhost:5173";
app.use(cors({ origin: FRONT_ORIGIN, credentials: true }));

app.use(express.json());

/** ➜ Fichiers statiques uploadés (AVANT 404) */
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

/** Routes métier (AVANT 404) */
const adminRoutes = require("./routes/adminRoutes");
app.use("/api/admin", adminRoutes);

const clientAuthRoutes = require("./routes/clientAuthRoutes");
app.use("/api/auth", clientAuthRoutes);

const clientBackRoutes = require('./routes/clientBackRoutes');
app.use('/api/admin/clients', clientBackRoutes);

const categoryRoutes = require('./routes/categoryRoutes');
app.use('/api/categories', categoryRoutes);

const platRoutes = require("./routes/platRoutes");
app.use("/api/plats", platRoutes);

const commandeRoutes = require("./routes/commandeRoutes");
app.use("/api/commandes", commandeRoutes);

/** ➜ Route d’upload (AVANT 404) */
const uploadRoutes = require('./routes/uploadRoutes');
app.use('/api/uploads', uploadRoutes);

/** Healthcheck */
app.get("/healthz", (_req, res) => res.json({ ok: true }));

const commentRoutes = require('./routes/commentRoutes');
app.use('/api/comments', commentRoutes);

const commentBackRoutes = require('./routes/commentBackRoutes');
app.use('/api/admin/comments', commentBackRoutes);

const publicRoutes = require('./routes/publicRoutes');
app.use('/api/public', publicRoutes);

/** 404 (APRÈS TOUTES LES ROUTES !) */
app.use((req, res, _next) => {
  res.status(404).json({ message: `Route introuvable: ${req.method} ${req.originalUrl}` });
});

/** Handler d’erreurs (toujours en dernier) */
app.use((err, _req, res, _next) => {
  console.error("API error:", err);
  res.status(err.status || 500).json({ message: err.message || "Erreur serveur" });
});

/** Boot */
const { ensureSuperAdmin } = require('./utils/initAdmin');
(async () => {
  await connectDB();
  await ensureSuperAdmin();
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 Serveur lancé sur le port ${PORT}`));
})();
