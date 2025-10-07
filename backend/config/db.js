// backend/config/db.js
const mongoose = require('mongoose');

module.exports = async function connectDB() {
  const uri = process.env.MONGO_URI;
  const dbName = process.env.DB_NAME || 'chezmamie';

  if (!uri) {
    throw new Error('MONGO_URI manquant dans .env');
  }

  await mongoose.connect(uri, {
    dbName,
    // options modernes (Mongoose 6/7+ n’a plus besoin de useNewUrlParser/useUnifiedTopology)
    maxPoolSize: 10,
  });

  console.log('✅ MongoDB connecté sur Atlas, DB =', dbName);
};
