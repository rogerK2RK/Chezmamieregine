const mongoose = require('mongoose');
const { GridFSBucket, ObjectId } = require('mongodb');
const { asyncHandler } = require('../utils/helpers');

const bucket = () => new GridFSBucket(mongoose.connection.db, { bucketName: 'images' });

// POST /api/admin/uploads  (champ "image") — stocke dans GridFS, renvoie l'URL absolue.
exports.upload = asyncHandler(async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'Aucun fichier reçu.' });

  const stream = bucket().openUploadStream(req.file.originalname || 'image', {
    contentType: req.file.mimetype,
  });
  stream.end(req.file.buffer);

  stream.on('finish', () => {
    const url = `${req.protocol}://${req.get('host')}/api/uploads/${stream.id}`;
    res.status(201).json({ id: String(stream.id), url });
  });
  stream.on('error', () => res.status(500).json({ message: 'Échec de l’upload.' }));
});

// GET /api/uploads/:id — sert l'image (public).
exports.getFile = asyncHandler(async (req, res) => {
  let _id;
  try { _id = new ObjectId(req.params.id); } catch { return res.status(404).end(); }

  const files = await mongoose.connection.db.collection('images.files').find({ _id }).toArray();
  if (!files.length) return res.status(404).end();

  res.set('Content-Type', files[0].contentType || 'image/jpeg');
  res.set('Cache-Control', 'public, max-age=31536000, immutable');
  bucket().openDownloadStream(_id).on('error', () => res.status(404).end()).pipe(res);
});
