// node scripts/syncClientCounter.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Client = require('../models/Client');
const Counter = require('../models/Counter');

(async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const agg = await Client.aggregate([
    { $match: { clientId: { $type: 'string' } } },
    { $project: {
        n: {
          $toInt: { $arrayElemAt: [ { $split: ['$clientId','-'] }, 1 ] }
        }
      }
    },
    { $group: { _id: null, max: { $max: '$n' } } }
  ]);

  const lastNum = agg[0]?.max || 0;
  await Counter.updateOne(
    { name: 'client' },
    { $set: { prefix: 'CLI', seq: lastNum } },
    { upsert: true }
  );

  console.log('Counter client.seq =', lastNum);
  await mongoose.disconnect();
})();
