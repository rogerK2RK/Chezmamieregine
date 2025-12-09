// server.js
const express   = require('express');
const cors      = require('cors');
const dotenv    = require('dotenv');
const path      = require('path');
const connectDB = require('./config/db');
const publicContactRoutes = require('./routes/publicContactRoutes');

dotenv.config();
const app = express();

/* Proxy (Render/NGINX) */
app.set('trust proxy', 1);

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

//Commentaire
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

/* --- Boot --- */
const { ensureSuperAdmin } = require('./utils/initAdmin');
(async () => {
  await connectDB();
  await ensureSuperAdmin();
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 API on http://localhost:${PORT}`));
})();
