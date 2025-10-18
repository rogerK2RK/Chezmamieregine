// backend/utils/gridfs.js
const mongoose = require('mongoose');

let bucket = null;

// Appelé automatiquement quand Mongoose est connecté
mongoose.connection.once('open', () => {
  bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: 'uploads', // collections: uploads.files & uploads.chunks
  });
  console.log('✅ GridFS bucket prêt:', bucket.s.namespace);
});

/**
 * Récupère le bucket GridFS initialisé
 */
function getBucket() {
  if (!bucket) {
    throw new Error('GridFS non initialisé (connexion Mongo non ouverte)');
  }
  return bucket;
}

module.exports = { getBucket };
