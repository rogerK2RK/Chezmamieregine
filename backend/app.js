// app.js — construit et exporte l'application Express (sans démarrer le serveur).
// Utilisable à la fois en local (via server.js) et en serverless (via api/index.js).
const express   = require('express');
const cors      = require('cors');
const dotenv    = require('dotenv');
const path      = require('path');
const connectDB = require('./config/db');
const { ensureSuperAdmin } = require('./utils/initAdmin');
const publicContactRoutes = require('./routes/publicContactRoutes');

dotenv.config();
const app = express();

/* Proxy (Render/NGINX/Vercel) */
app.set('trust proxy', 1);

/* --- Initialisation unique (DB + superadmin) ---
   Mémorisée pour ne s'exécuter qu'une fois, même en serverless où le module
   peut être réutilisé entre invocations (cold start partagé). */
let initPromise = null;
function init() {
  if (!initPromise) {
    initPromise = (async () => {
      await connectDB();
      await ensureSuperAdmin();
    })().catch((err) => {
      // Réinitialise pour permettre une nouvelle tentative au prochain appel.
      initPromise = null;
      throw err;
    });
  }
  return initPromise;
}

// Garantit que la DB est connectée avant de traiter la moindre requête.
app.use(async (req, res, next) => {
  try {
    await init();
    next();
  } catch (err) {
    next(err);
  }
});

/* --- CORS (dev + prod) --- */
const DEFAULT_ALLOWED = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://chezmamieregine.vercel.app',
];
const EXTRA = process.env.FRONT_ORIGIN ? [process.env.FRONT_ORIGIN] : [];
const ALLOWED = new Set([...DEFAULT_ALLOWED, ...EXTRA]);

const corsMw = cors({
  origin(origin, cb) {
    // Autorise Postman/SSR (origin null) + domaines listés
    if (!origin || ALLOWED.has(origin)) return cb(null, true);
    return cb(new Error(`CORS: origin non autorisé -> ${origin}`));
  },
  credentials: true,
  methods: ['GET','HEAD','PUT','PATCH','POST','DELETE','OPTIONS'],
  allowedHeaders: ['Authorization','authorization','Content-Type'],
  optionsSuccessStatus: 204,
});

// Important pour caches/proxies (Vary: Origin)
app.use((req, res, next) => { res.header('Vary', 'Origin'); next(); });
app.use(corsMw);
// Préflight explicite
app.options('*', corsMw);

/* --- Parsers/Static --- */
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

/* --- Routes --- */
// Admin
app.use('/api/admin',          require('./routes/adminRoutes'));
app.use('/api/admin/clients',  require('./routes/clientBackRoutes'));
app.use('/api/admin',          require('./routes/adminContactRoutes'));

// Auth client
app.use('/api/auth',           require('./routes/clientAuthRoutes'));
// Métier
app.use('/api/categories',     require('./routes/categoryRoutes'));
app.use('/api/plats',          require('./routes/platRoutes'));
app.use('/api/commandes',      require('./routes/commandeRoutes'));
app.use('/api/uploads',        require('./routes/uploadRoutes'));
// Commentaires
app.use('/api/comments',       require('./routes/commentFrontRoutes'));
app.use('/api/admin/comments', require('./routes/commentBackRoutes'));

// Contact public
app.use('/api/public', publicContactRoutes);

// Public
app.use('/api/public',         require('./routes/publicRoutes'));
// Profil client (/api/me)
app.use('/api/me',             require('./routes/meRoutes'));

/* --- Health --- */
app.get('/healthz', (_req, res) => res.json({ ok: true }));
app.get('/api/health', (_req, res) => res.json({ ok: true }));

/* --- 404 & erreurs --- */
app.use((req, res, _next) => {
  res.status(404).json({ message: `Route introuvable: ${req.method} ${req.originalUrl}` });
});
app.use((err, _req, res, _next) => {
  console.error('API error:', err);
  res.status(err.status || 500).json({ message: err.message || 'Erreur serveur' });
});

module.exports = app;
module.exports.init = init;
