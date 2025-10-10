const express  = require('express');
const cors     = require('cors');
const dotenv   = require('dotenv');
const path     = require('path');
const connectDB = require('./config/db');

dotenv.config();
const app = express();

/* Proxy (utile si cookies secure derrière Render/Reverse proxy) */
app.set('trust proxy', 1);

/* CORS (dev + prod) */
const DEFAULT_ALLOWED = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://chezmamieregine.vercel.app' // adapte si ton domaine Vercel diffère
];
// Permets d’ajouter un origin via FRONT_ORIGIN (ex: preview Vercel)
const EXTRA = process.env.FRONT_ORIGIN ? [process.env.FRONT_ORIGIN] : [];
const ALLOWED_ORIGINS = Array.from(new Set([...DEFAULT_ALLOWED, ...EXTRA]));

app.use(cors({
  origin: (origin, cb) => {
    // autorise Postman/SSR (origin null) + origins connus
    if (!origin || ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
    cb(new Error(`CORS: origin non autorisé -> ${origin}`));
  },
  credentials: true
}));

// Pré-requêtes (OPTIONS) pour tous
app.options('*', cors());

/* Parsers */
app.use(express.json());

/* Fichiers statiques uploadés (temporaire, en attendant Cloudinary) */
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

/* Routes ADMIN */
app.use('/api/admin',          require('./routes/adminRoutes'));
app.use('/api/admin/clients',  require('./routes/clientBackRoutes'));

/* Auth client */
app.use('/api/auth',           require('./routes/clientAuthRoutes'));

/* Catégories / Plats / Commandes / Upload */
app.use('/api/categories',     require('./routes/categoryRoutes'));
app.use('/api/plats',          require('./routes/platRoutes'));
app.use('/api/commandes',      require('./routes/commandeRoutes'));
app.use('/api/uploads',        require('./routes/uploadRoutes'));

/* Commentaires — front + back */
app.use('/api/comments',       require('./routes/commentFrontRoutes'));
app.use('/api/admin/comments', require('./routes/commentBackRoutes'));

app.use('/api/public', require('./routes/publicRoutes'));

/* Health */
app.get('/healthz', (_req, res) => res.json({ ok: true }));
app.get('/api/health', (_req, res) => res.json({ ok: true }));

/* 404 */
app.use((req, res, _next) => {
  res.status(404).json({ message: `Route introuvable: ${req.method} ${req.originalUrl}` });
});

/* Handler erreurs */
app.use((err, _req, res, _next) => {
  console.error('API error:', err);
  res.status(err.status || 500).json({ message: err.message || 'Erreur serveur' });
});

/* Boot */
const { ensureSuperAdmin } = require('./utils/initAdmin');
(async () => {
  await connectDB();          // lit process.env.MONGO_URI
  await ensureSuperAdmin();
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 API on http://localhost:${PORT}`));
})();
