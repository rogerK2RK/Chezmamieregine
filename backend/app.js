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

// Si tu utilises des cookies/sessions derrière un proxy (Render)
app.set("trust proxy", 1);

// ============================================================
// ✅ CONFIGURATION CORS UNIQUE (Render + Vercel + local)
const PROD_ORIGIN = process.env.FRONTEND_URL; // ex: https://chezmamier egine.vercel.app

const corsOptions = {
  origin(origin, cb) {
    // Autoriser les requêtes internes (health, Postman, etc.)
    if (!origin) return cb(null, true);

    // Domaine principal du front
    if (PROD_ORIGIN && origin === PROD_ORIGIN) return cb(null, true);

    // Autoriser les préviews Vercel (*.vercel.app)
    if (/^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(origin)) return cb(null, true);

    // Autoriser localhost en dev
    if (origin === "http://localhost:5173") return cb(null, true);

    return cb(new Error("Not allowed by CORS: " + origin));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // Préflight indispensable

// Répond tout de suite aux préflights pour éviter que des middlewares plantent
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    return res.sendStatus(204); // No Content
  }
  next();
});


// ============================================================

app.use(express.json());

// (Optionnel) — Debug rapide pour voir les origines qui se connectent
/*
app.use((req, _res, next) => {
  console.log("CORS DEBUG:", req.headers.origin, "→", req.method, req.originalUrl);
  next();
});
*/

// ============================================================
// ✅ ROUTES HEALTH (pour Render + monitoring)
app.get("/health", (_req, res) => res.send("ok"));
app.get("/healthz", (_req, res) => res.json({ ok: true }));

app.get("/api/health", (_req, res) => res.send("ok"));
app.get("/api/healthz", (_req, res) => res.json({ ok: true }));
// ============================================================

// Fichiers statiques (uploads d’images)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ============================================================
// ✅ ROUTES API
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/auth", require("./routes/clientAuthRoutes"));
app.use("/api/admin/clients", require("./routes/clientBackRoutes"));
app.use("/api/categories", require("./routes/categoryRoutes"));
app.use("/api/plats", require("./routes/platRoutes"));
app.use("/api/commandes", require("./routes/commandeRoutes"));
app.use("/api/public", require("./routes/publicRoutes"));
app.use("/api/uploads", require("./routes/uploadRoutes"));
// ============================================================

// 404 & gestion d’erreurs
app.use((req, res) => {
  res.status(404).json({
    message: `Route introuvable: ${req.method} ${req.originalUrl}`,
  });
});

app.use((err, _req, res, _next) => {
  console.error("API error:", err);
  res.status(err.status || 500).json({
    message: err.message || "Erreur serveur",
  });
});

// ============================================================
// ✅ Démarrage et initialisation DB
(async () => {
  await connectDB();
  await ensureSuperAdmin();
})();

app.listen(PORT, () => {
  console.log("✅ API running on port", PORT);
});
