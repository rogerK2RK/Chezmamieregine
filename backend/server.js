const express  = require('express');
const cors     = require('cors');
const dotenv   = require('dotenv');
const path     = require('path');
const connectDB = require('./config/db');

dotenv.config();
const app = express();

/* --- Configuration serveur --- */
app.set('trust proxy', 1); // nécessaire derrière un proxy (ex: Render)

/* --- CORS --- */
const DEFAULT_ALLOWED = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://chezmamieregine.vercel.app' // domaine du front en prod
];
const EXTRA = process.env.FRONT_ORIGIN ? [process.env.FRONT_ORIGIN] : [];
const ALLOWED_ORIGINS = Array.from(new Set([...DEFAULT_ALLOWED, ...EXTRA]));

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || ALLOWED_ORIGINS.includes(origin)) return cb(null, true); // autorise origin connu ou null
    cb(new Error(`CORS: origin non autorisé -> ${origin}`));
  },
  credentials: true
}));

app.options('*', cors()); // gère les requêtes OPTIONS globales

/* --- Middlewares --- */
app.use(express.json()); // parse le JSON
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // sert les fichiers uploadés

/* --- Routes principales --- */
// Auth admin + clients
app.use('/api/admin',          require('./routes/adminRoutes'));
app.use('/api/admin/clients',  require('./routes/clientBackRoutes'));
app.use('/api/auth',           require('./routes/clientAuthRoutes'));

// Gestion du contenu
app.use('/api/categories',     require('./routes/categoryRoutes'));
app.use('/api/plats',          require('./routes/platRoutes'));
app.use('/api/commandes',      require('./routes/commandeRoutes'));
app.use('/api/uploads',        require('./routes/uploadRoutes'));

// Commentaires
app.use('/api/comments',       require('./routes/commentFrontRoutes'));
app.use('/api/admin/comments', require('./routes/commentBackRoutes'));

// Routes publiques
app.use('/api/public', require('./routes/publicRoutes'));

// Routes user front
app.use('/api/me', require('./routes/meRoutes'));

/* --- Healthcheck --- */
app.get('/healthz', (_req, res) => res.json({ ok: true }));
app.get('/api/health', (_req, res) => res.json({ ok: true }));

/* --- Gestion des erreurs --- */
app.use((req, res, _next) => {
  res.status(404).json({ message: `Route introuvable: ${req.method} ${req.originalUrl}` });
});

app.use((err, _req, res, _next) => {
  console.error('API error:', err);
  res.status(err.status || 500).json({ message: err.message || 'Erreur serveur' });
});

/* --- Démarrage du serveur --- */
const { ensureSuperAdmin } = require('./utils/initAdmin');
(async () => {
  await connectDB();          // connexion à MongoDB
  await ensureSuperAdmin();   // crée un super admin si absent
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 API on http://localhost:${PORT}`));
})();
