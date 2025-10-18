const express = require('express');
const router = express.Router();
const multer = require('multer');
const { Types } = require('mongoose');

const { adminProtect } = require('../middleware/adminAuthMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const { getBucket } = require('../utils/gridfs');

// Limites et types autorisés
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 Mo
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

// Multer en mémoire (on stream ensuite vers GridFS)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED.includes(file.mimetype)) {
      return cb(new Error('Type de fichier non autorisé'), false);
    }
    cb(null, true);
  },
});

// ====================
// POST /api/uploads
// ====================
router.post(
  '/',
  adminProtect,
  authorizeRoles('admin', 'owner', 'superAdmin'),
  upload.array('files', 10),
  async (req, res) => {
    try {
      const bucket = getBucket();
      const files = req.files || [];

      // aucune pièce jointe
      if (!files.length) return res.json({ files: [] });

      // Upload chaque fichier en GridFS
      const uploaded = await Promise.all(
        files.map((f) => {
          return new Promise((resolve, reject) => {
            const filename = `${Date.now()}-${(f.originalname || 'image').replace(/\s+/g, '-')}`.slice(0, 120);

            const uploadStream = bucket.openUploadStream(filename, {
              contentType: f.mimetype,
              metadata: {
                size: f.size,
                originalname: f.originalname,
                by: req.admin?._id || null, // si adminProtect met req.admin
              },
            });

            uploadStream.on('error', reject);
            uploadStream.on('finish', (file) => {
              // file contient _id, length, chunkSize, uploadDate, filename, metadata, contentType
              resolve({
                id: file._id.toString(),
                filename: file.filename,
                size: file.length,
                mimetype: file.contentType,
                // URL pour afficher/télécharger
                url: `${req.protocol}://${req.get('host')}/api/uploads/${file._id.toString()}`,
              });
            });

            // on envoie le buffer en une fois
            uploadStream.end(f.buffer);
          });
        })
      );

      return res.json({ files: uploaded });
    } catch (e) {
      console.error('[UPLOAD GridFS] ERROR:', e);
      return res.status(500).json({ message: e.message || 'Upload impossible' });
    }
  }
);

// ====================
// GET /api/uploads/:id  (stream)
// ====================
router.get('/:id', async (req, res) => {
  try {
    const bucket = getBucket();
    const { id } = req.params;
    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'id invalide' });
    }

    const _id = new Types.ObjectId(id);

    // Récupérer le fichier (pour le mimetype)
    const [file] = await bucket.find({ _id }).toArray();
    if (!file) return res.status(404).json({ message: 'Fichier introuvable' });

    res.set('Content-Type', file.contentType || 'application/octet-stream');
    res.set('Cache-Control', 'public, max-age=31536000, immutable'); // cache 1 an

    const dl = req.query.download === '1';
    if (dl) {
      res.set('Content-Disposition', `attachment; filename="${file.filename}"`);
    }

    const readStream = bucket.openDownloadStream(_id);
    readStream.on('error', (err) => {
      console.error('[GridFS read] ERROR:', err);
      if (!res.headersSent) res.status(500).json({ message: 'Lecture impossible' });
      else res.end();
    });
    readStream.pipe(res);
  } catch (e) {
    console.error('[GET upload] ERROR:', e);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
});

// ====================
// DELETE /api/uploads/:id  (optionnel)
// ====================
router.delete(
  '/:id',
  adminProtect,
  authorizeRoles('admin', 'owner', 'superAdmin'),
  async (req, res) => {
    try {
      const bucket = getBucket();
      const { id } = req.params;
      if (!Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'id invalide' });
      }
      await bucket.delete(new Types.ObjectId(id));
      return res.json({ ok: true });
    } catch (e) {
      console.error('[DELETE upload] ERROR:', e);
      return res.status(500).json({ message: 'Suppression impossible' });
    }
  }
);

module.exports = router;
