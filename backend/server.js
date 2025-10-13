const express  = require('express');
const cors     = require('cors');
const dotenv   = require('dotenv');
const path     = require('path');
const connectDB = require('./config/db');

dotenv.config();
const app = express();

/* --- Proxy --- */
app.set('trust proxy', 1);

/* --- CORS (prod + dev) --- */
const DEFAULT_ALLOWED = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://chezmamieregine.vercel.app',
];
const EXTRA = process.env.FRONT_ORIGIN ? [process.env.FRONT_ORIGIN] : [];
const ALLOWED = new Set([...DEFAULT_ALLOWED, ...EXTRA]);

const corsMw = cors({
  origin(origin, cb) {
    // autorise SSR/postman (origin null) + domaines listés
    if (!origin || ALLOWED.has(origin)) return cb(null, true);
    return cb(new Error(`CORS: origin non autorisé -> ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Authorization', 'Content-Type'],
  optionsSuccessStatus: 204,
});

// applique CORS partout + fait varier sur Origin (cache)
app.use((req, res, next) => { res.header('Vary', 'Origin'); next(); });
app.use(corsMw);

// répond explicitement aux preflight (important pour Render)
app.options('*', corsMw);
app.options('/api/*', corsMw, (_req, res) => res.sendStatus(204));

/* --- Parsers/Static --- */
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

/* --- Routes --- */
app.use('/api/admin',          require('./routes/adminRoutes'));
app.use('/api/admin/clients',  require('./routes/clientBackRoutes'));
app.use('/api/auth',           require('./routes/clientAuthRoutes'));
app.use('/api/categories',     require('./routes/categoryRoutes'));
app.use('/api/plats',          require('./routes/platRoutes'));
app.use('/api/commandes',      require('./routes/commandeRoutes'));
app.use('/api/uploads',        require('./routes/uploadRoutes'));
app.use('/api/comments',       require('./routes/commentFrontRoutes'));
app.use('/api/admin/comments', require('./routes/commentBackRoutes'));
app.use('/api/public',         require('./routes/publicRoutes'));

// ⚠️ place /api/me après CORS (déjà le cas) – ça marche aussi avec l’intercepteur Axios
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
