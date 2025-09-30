const mongoose = require('mongoose');

// Collection counters: { _id: 'client', seq: 1 } etc.
const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // 'client', 'plat', ...
  seq: { type: Number, default: 0 }
}, { collection: 'counters' });

const Counter = mongoose.model('Counter', counterSchema);

// prefix ex: 'CLI', key ex: 'client'
async function getNextId(prefix, key) {
  const doc = await Counter.findByIdAndUpdate(
    key,
    { $inc: { seq: 1 } },
    { new: true, upsert: true } // crée si n’existe pas
  ).lean();

  const num = String(doc.seq).padStart(6, '0'); // 000001
  return `${prefix}-${num}`;
}

module.exports = { getNextId };
