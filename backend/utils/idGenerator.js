const Counter = require('../models/Counter');

// Génère un nouvel ID incrémenté (ex: ADM-000001)
async function getNextId(prefix, seqName) {
  if (!prefix || !seqName) {
    throw new Error(`getNextId: invalid args prefix="${prefix}" seqName="${seqName}"`);
  }

  // Incrémente ou crée un compteur pour la séquence donnée
  const updated = await Counter.findOneAndUpdate(
    { name: seqName },
    {
      $setOnInsert: { prefix, name: seqName }, // crée le compteur s’il n’existe pas
      $inc: { seq: 1 }, // incrémente la valeur
    },
    { new: true, upsert: true }
  );

  // Formate l’ID (ex: ADM-000123)
  const n = updated.seq;
  const padded = String(n).padStart(6, '0');
  return `${prefix}-${padded}`;
}

module.exports = { getNextId };
