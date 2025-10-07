// backend/app.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("./config/db");
const { ensureSuperAdmin } = require('./utils/initAdmin');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// si tu utilises des cookies/sessions derrière un proxy (Render)
app.set('trust proxy', 1);

// ============ CORS (UNE SEULE CONFIG) ============
const allowedOrigins = [
  process.env.FRONTEND_URL,      // ex: https://chezmamie...vercel.app  (à mettre dans Render)
  'http://localhost:5173'        // dev Vite
];

const corsOptions = {
  origin(origin, cb) {
    // autorise aussi les appels sans origin (Postman/health checks)
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    return cb(new Error('Not allowed by CORS: ' + origin));
  },
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
  credentials: true
};

app.use(cors(corsOptions));       // <— AVANT les routes
app.options('*', cors(corsOptions)); // <— préflight OPTIONS partout

// ================================================

app.use(express.json());

// Health
app.get('/health', (_req, res) => res.send('ok'));
app.get('/healthz', (_req, res) => res.json({ ok: true }));

// Ajout pour compatibilité front (Render + Vercel)
app.get('/api/health', (_req, res) => res.send('ok'));
app.get('/api/healthz', (_req, res) => res.json({ ok: true }));

// Fichiers statiques (ok)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ======== ROUTES (tu gardes ton prefix /api) ========
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/auth", require("./routes/clientAuthRoutes"));
app.use('/api/admin/clients', require('./routes/clientBackRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use("/api/plats", require("./routes/platRoutes"));
app.use("/api/commandes", require("./routes/commandeRoutes"));
app.use('/api/public', require('./routes/publicRoutes'));
app.use('/api/uploads', require('./routes/uploadRoutes'));

app.get("/healthz", (_req, res) => res.json({ ok: true }));

// 404 & erreurs
app.use((req, res) => {
  res.status(404).json({ message: `Route introuvable: ${req.method} ${req.originalUrl}` });
});
app.use((err, _req, res, _next) => {
  console.error("API error:", err);
  res.status(err.status || 500).json({ message: err.message || "Erreur serveur" });
});

// Boot
(async () => {
  await connectDB();
  await ensureSuperAdmin();
})();

app.listen(PORT, () => {
  console.log('API running on port', PORT);
});
