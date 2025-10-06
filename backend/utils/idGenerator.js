const Counter = require('../models/Counter');

/**
 * getNextId('ADM','admin') -> ADM-000001
 */
async function getNextId(prefix, seqName) {
  if (!prefix || !seqName) {
    throw new Error(`getNextId: invalid args prefix="${prefix}" seqName="${seqName}"`);
  }

  const updated = await Counter.findOneAndUpdate(
    { name: seqName },
    {
      // create doc if missing (without touching `seq`)
      $setOnInsert: { prefix, name: seqName },
      // always increment the sequence
      $inc: { seq: 1 },
    },
    { new: true, upsert: true }
  );

  const n = updated.seq;                 // 1, 2, 3, ...
  const padded = String(n).padStart(6, '0');
  return `${prefix}-${padded}`;
}

module.exports = { getNextId };
