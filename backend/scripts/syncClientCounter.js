const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Client = require('../models/Client');
const Counter = require('../models/Counter');

// Script de synchronisation du compteur client
(async () => {
  // Connexion à MongoDB
  await mongoose.connect(process.env.MONGO_URI);

  // Récupère le numéro le plus élevé dans les clientId existants (ex: "CLI-123")
  const agg = await Client.aggregate([
    { $match: { clientId: { $type: 'string' } } },
    { $project: {
        n: {
          $toInt: { $arrayElemAt: [ { $split: ['$clientId','-'] }, 1 ] } // Extrait la partie numérique
        }
      }
    },
    { $group: { _id: null, max: { $max: '$n' } } } // Trouve le plus grand numéro
  ]);

  // Met à jour ou crée le compteur avec la dernière valeur trouvée
  const lastNum = agg[0]?.max || 0;
  await Counter.updateOne(
    { name: 'client' },
    { $set: { prefix: 'CLI', seq: lastNum } },
    { upsert: true }
  );

  console.log('Counter client.seq =', lastNum);

  // Déconnexion propre de MongoDB
  await mongoose.disconnect();
})();
