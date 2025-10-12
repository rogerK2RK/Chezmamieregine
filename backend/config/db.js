// Import de mongoose pour gérer la connexion à MongoDB
const mongoose = require('mongoose');

// Fonction asynchrone de connexion à la base de données MongoDB
module.exports = async function connectDB() {
  const uri = process.env.MONGO_URI;
  const dbName = process.env.DB_NAME || 'chezmamie';

  if (!uri) {
    throw new Error('MONGO_URI manquant dans .env');
  }

  await mongoose.connect(uri, {
    dbName,
    maxPoolSize: 10,
  });

  console.log('✅ MongoDB connecté sur Atlas, DB =', dbName);
};
