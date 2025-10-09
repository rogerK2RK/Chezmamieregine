const mongoose = require('mongoose');

const CounterSchema = new mongoose.Schema({
  name:   { type: String, required: true, unique: true, index: true }, // "admin", "client", "plat"...
  seq:    { type: Number, default: 0 },
  prefix: { type: String, required: true },
}, { collection: 'counters', timestamps: true });

module.exports = mongoose.model('Counter', CounterSchema);
