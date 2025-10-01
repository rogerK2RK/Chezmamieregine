// backend/scripts/backfillClientIds.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const connectDB = require('../config/db');
const Client = require('../models/Client');
const { getNextId } = require('../utils/idGenerator');

(async () => {
  try {
    await connectDB();

    // Trouver les clients sans clientId
    const withoutId = await Client.find({ $or: [{ clientId: { $exists: false } }, { clientId: '' }, { clientId: null }] });

    if (!withoutId.length) {
      console.log('✅ Aucun client sans clientId. Rien à faire.');
      process.exit(0);
    }

    console.log(`🔧 Clients à corriger: ${withoutId.length}`);

    for (const cli of withoutId) {
      cli.clientId = await getNextId('CLI', 'client');
      await cli.save(); // déclenche validations mongoose
      console.log(`→ Mis à jour: ${cli.email} => ${cli.clientId}`);
    }

    console.log('🎉 Migration terminée.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Migration ERROR:', err);
    process.exit(1);
  }
})();
