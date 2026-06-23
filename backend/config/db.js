const mongoose = require('mongoose');

// Connexion MongoDB (Atlas). dbName piloté par l'env, défaut "chezmamie".
module.exports = async function connectDB() {
  const uri = process.env.MONGO_URI;
  const dbName = process.env.DB_NAME || 'chezmamie';
  if (!uri) throw new Error('MONGO_URI manquant dans les variables d’environnement.');

  await mongoose.connect(uri, { dbName, maxPoolSize: 10 });
  console.log('✅ MongoDB connecté — DB =', dbName);
};
