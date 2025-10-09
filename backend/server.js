const express  = require('express');
const cors     = require('cors');
const dotenv   = require('dotenv');
const path     = require('path');
const connectDB = require('./config/db');

dotenv.config();
const app = express();

/* CORS (local) */
const FRONT_ORIGIN = process.env.FRONT_ORIGIN || 'http://localhost:5173';
app.use(cors({ origin: FRONT_ORIGIN, credentials: true }));

/* Parsers */
app.use(express.json());

/* Fichiers statiques uploadés */
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

/* Routes ADMIN (auth/admin/users déjà existants chez toi) */
app.use('/api/admin',          require('./routes/adminRoutes'));
app.use('/api/admin/clients',  require('./routes/clientBackRoutes'));

/* Auth client (login/register) */
app.use('/api/auth',           require('./routes/clientAuthRoutes'));

/* Catégories / Plats / Commandes / Upload (tes routes d’origine) */
app.use('/api/categories',     require('./routes/categoryRoutes'));
app.use('/api/plats',          require('./routes/platRoutes'));
app.use('/api/commandes',      require('./routes/commandeRoutes'));
app.use('/api/uploads',        require('./routes/uploadRoutes'));

/* Commentaires — front + back */
app.use('/api/comments',       require('./routes/commentFrontRoutes')); // clients
app.use('/api/admin/comments', require('./routes/commentBackRoutes'));  // BO

app.use('/api/public', require('./routes/publicRoutes'));


/* Health */
app.get('/healthz', (_req, res) => res.json({ ok: true }));

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
  await connectDB();
  await ensureSuperAdmin();
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 API on http://localhost:${PORT}`));
})();
