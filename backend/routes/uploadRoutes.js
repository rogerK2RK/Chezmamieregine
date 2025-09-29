const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const { adminProtect } = require('../middleware/adminAuthMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED = ['image/jpeg','image/png','image/webp','image/gif'];

const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    const dest = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    cb(null, dest);
  },
  filename: function (_req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    const base = path.basename(file.originalname, ext).replace(/\s+/g, '-').slice(0, 50);
    cb(null, `${Date.now()}-${base}${ext}`);
  }
});

const fileFilter = (_req, file, cb) => {
  if (!ALLOWED.includes(file.mimetype)) {
    return cb(new Error('Type de fichier non autorisé'), false);
  }
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_FILE_SIZE }
});

// POST /api/uploads  (clé de champ "files")
router.post(
  '/',
  adminProtect,
  authorizeRoles('admin', 'owner', 'superAdmin'),
  upload.array('files', 10),
  (req, res) => {
    const files = (req.files || []).map(f => ({
      filename: f.filename,
      url: `${req.protocol}://${req.get('host')}/uploads/${f.filename}`,
      size: f.size,
      mimetype: f.mimetype
    }));
    res.json({ files });
  }
);

module.exports = router;
