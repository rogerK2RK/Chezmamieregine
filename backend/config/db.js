const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // options inutiles avec Mongoose 6+, on peut laisser vide
    });
    console.log(`✅ MongoDB connecté: ${conn.connection.host}`);
  } catch (err) {
    console.error('❌ Erreur MongoDB :', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
