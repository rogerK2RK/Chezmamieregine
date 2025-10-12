const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const connectDB = require('../config/db'); // Connexion à la base MongoDB
const Client = require('../models/Client'); // Modèle Client
const { getNextId } = require('../utils/idGenerator'); // Génère un ID unique

(async () => {
  try {
    // Connexion à MongoDB
    await connectDB();

    // Recherche des clients sans clientId défini
    const withoutId = await Client.find({
      $or: [
        { clientId: { $exists: false } },
        { clientId: '' },
        { clientId: null }
      ]
    });

    if (!withoutId.length) {
      console.log('✅ Aucun client sans clientId. Rien à faire.');
      process.exit(0); // Quitte le script
    }

    console.log(`🔧 Clients à corriger: ${withoutId.length}`);

    // Assigne un nouvel ID à chaque client manquant
    for (const cli of withoutId) {
      cli.clientId = await getNextId('CLI', 'client');
      await cli.save();
      console.log(`→ Mis à jour: ${cli.email} => ${cli.clientId}`);
    }

    console.log('🎉 Migration terminée.');
    process.exit(0); // Quitte proprement
  } catch (err) {
    console.error('❌ Migration ERROR:', err);
    process.exit(1); // Quitte avec erreur
  }
})();
