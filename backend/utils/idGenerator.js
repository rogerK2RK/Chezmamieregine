const Counter = require('../models/Counter');

// Incrémente atomiquement un compteur et renvoie un ID formaté ex. "ADM-000001".
async function getNextId(prefix, key) {
  const c = await Counter.findByIdAndUpdate(
    key,
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return `${prefix}-${String(c.seq).padStart(6, '0')}`;
}

module.exports = { getNextId };
