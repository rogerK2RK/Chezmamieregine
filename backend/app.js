// app.js — construit et exporte l'app Express (sans démarrer le serveur).
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { ensureSuperAdmin } = require('./utils/initAdmin');

dotenv.config();

// Valide les secrets JWT au démarrage (fail-fast).
require('./config/jwt');

const app = express();
app.set('trust proxy', 1);

// Health-check infra (AVANT l'init DB) : le service est "live" même si Mongo tarde.
app.get('/healthz', (_req, res) => res.json({ ok: true }));

/* --- Initialisation unique (DB + superadmin), mémoïsée --- */
let initPromise = null;
function init() {
  if (!initPromise) {
    initPromise = (async () => {
      await connectDB();
      await ensureSuperAdmin();
    })().catch((err) => {
      initPromise = null; // permet une nouvelle tentative
      throw err;
    });
  }
  return initPromise;
}

// Garantit la connexion DB avant chaque requête.
app.use(async (req, res, next) => {
  try {
    await init();
    next();
  } catch (err) {
    next(err);
  }
});

/* --- CORS --- */
const DEFAULT_ALLOWED = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://chezmamieregine.vercel.app',
];
const ALLOWED = new Set([...DEFAULT_ALLOWED, ...(process.env.FRONT_ORIGIN ? [process.env.FRONT_ORIGIN] : [])]);
const corsMw = cors({
  origin(origin, cb) {
    if (!origin || ALLOWED.has(origin)) return cb(null, true);
    return cb(new Error(`CORS: origin non autorisé -> ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Authorization', 'Content-Type'],
  optionsSuccessStatus: 204,
});
app.use((req, res, next) => { res.header('Vary', 'Origin'); next(); });
app.use(corsMw);
app.options('*', corsMw);

app.use(express.json());

/* --- Routes --- */
app.use('/api/public', require('./routes/publicRoutes'));
app.use('/api/auth', require('./routes/clientAuthRoutes'));
app.use('/api/me', require('./routes/meRoutes'));
app.use('/api/uploads', require('./routes/uploadRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

app.get('/api/health', (_req, res) => res.json({ ok: true }));

/* --- 404 & erreurs --- */
app.use((req, res) => res.status(404).json({ message: `Route introuvable: ${req.method} ${req.originalUrl}` }));
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error('API error:', err.message);
  res.status(err.status || 500).json({ message: err.message || 'Erreur serveur' });
});

module.exports = app;
module.exports.init = init;
