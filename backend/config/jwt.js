// Source unique des secrets JWT — fail-fast si JWT_SECRET absent.
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error(
    'JWT_SECRET manquant : définissez-le dans les variables d’environnement (voir .env.example).'
  );
}

const JWT_ADMIN_SECRET = process.env.JWT_ADMIN_SECRET || JWT_SECRET;

module.exports = { JWT_SECRET, JWT_ADMIN_SECRET };
