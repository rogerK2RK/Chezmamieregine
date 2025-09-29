const Counter = require('../models/Counter');

// format: PREFIX-000001
async function getNextId(prefix, name) {
  const c = await Counter.findOneAndUpdate(
    { name },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  const n = String(c.seq).padStart(6, '0');
  return `${prefix}-${n}`;
}

module.exports = { getNextId };
