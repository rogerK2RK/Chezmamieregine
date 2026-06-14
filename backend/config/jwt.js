// config/jwt.js — source unique des secrets JWT.
// Valide la présence des secrets au chargement (fail-fast) plutôt que de
// retomber silencieusement sur une valeur en dur, ce qui permettrait de
// forger des tokens en production.

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error(
    'JWT_SECRET manquant : définissez-le dans les variables d’environnement (voir .env.example).'
  );
}

// Secret dédié aux tokens admin ; retombe sur JWT_SECRET si non défini.
const JWT_ADMIN_SECRET = process.env.JWT_ADMIN_SECRET || JWT_SECRET;

module.exports = { JWT_SECRET, JWT_ADMIN_SECRET };
