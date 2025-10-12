const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const { adminProtect } = require('../middleware/adminAuthMiddleware'); // Vérifie le token admin
const { authorizeRoles } = require('../middleware/roleMiddleware'); // Vérifie les rôles autorisés

// Limites et types autorisés
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 Mo
const ALLOWED = ['image/jpeg','image/png','image/webp','image/gif'];

// Configuration du stockage des fichiers
const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    const dest = path.join(__dirname, '..', 'uploads'); // Dossier de destination
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true }); // Crée le dossier si inexistant
    cb(null, dest);
  },
  filename: function (_req, file, cb) {
    // Nettoie le nom et ajoute un timestamp
    const ext = path.extname(file.originalname).toLowerCase();
    const base = path.basename(file.originalname, ext).replace(/\s+/g, '-').slice(0, 50);
    cb(null, `${Date.now()}-${base}${ext}`);
  }
});

// Filtrage du type de fichier
const fileFilter = (_req, file, cb) => {
  if (!ALLOWED.includes(file.mimetype)) {
    return cb(new Error('Type de fichier non autorisé'), false);
  }
  cb(null, true);
};

// Initialisation de multer
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_FILE_SIZE }
});

// Route d’upload (max 10 fichiers, champ : "files")
router.post(
  '/',
  adminProtect,
  authorizeRoles('admin', 'owner', 'superAdmin'),
  upload.array('files', 10),
  (req, res) => {
    // Retourne les infos des fichiers uploadés
    const files = (req.files || []).map(f => ({
      filename: f.filename,
      url: `${req.protocol}://${req.get('host')}/uploads/${f.filename}`,
      size: f.size,
      mimetype: f.mimetype
    }));
    res.json({ files });
  }
);

// Exporte le routeur
module.exports = router;
