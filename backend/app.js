// backend/app.js
const express = require("express");
const cors = require("cors");

const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("./config/db");
const { ensureSuperAdmin } = require('./utils/initAdmin');

dotenv.config();

const app = express();

// Laisse Render choisir le port
const PORT = process.env.PORT || 5000;

// CORS — autorise Vercel en prod + Vite en dev
const allowedOrigins = [
  process.env.FRONTEND_URL,    // ex: https://chezmamie…vercel.app (on le mettra sur Render)
  'http://localhost:5173'      // pour dev local
];

app.use(cors({
  origin(origin, cb) {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    return cb(new Error('Not allowed by CORS'));
  },
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
  credentials: true
}));

app.use(express.json());

// CORS
const FRONT_ORIGIN = process.env.FRONT_ORIGIN || "http://localhost:5173";
app.use(cors({ origin: FRONT_ORIGIN, credentials: true }));
app.use(express.json());

// Fichiers statiques (OK en local; en prod Vercel -> read-only, cf. étape 6)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/auth", require("./routes/clientAuthRoutes"));
app.use('/api/admin/clients', require('./routes/clientBackRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use("/api/plats", require("./routes/platRoutes"));
app.use("/api/commandes", require("./routes/commandeRoutes"));
// Routes publiques (si ce n’est pas déjà fait)
app.use('/api/public', require('./routes/publicRoutes'));
app.use('/api/uploads', require('./routes/uploadRoutes')); // ⚠️ voir étape 6

app.get("/healthz", (_req, res) => res.json({ ok: true }));

app.use((req, res) => {
  res.status(404).json({ message: `Route introuvable: ${req.method} ${req.originalUrl}` });
});
app.use((err, _req, res, _next) => {
  console.error("API error:", err);
  res.status(err.status || 500).json({ message: err.message || "Erreur serveur" });
});

// Connexion DB + init (exécutés au cold start du lambda)
(async () => {
  await connectDB();
  await ensureSuperAdmin();
})();

module.exports = app;

app.listen(PORT, () => {
  console.log('API running on port', PORT);
});
