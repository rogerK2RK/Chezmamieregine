// api/index.js (point d'entrée Vercel)
const app = require('../backend/app');
module.exports = app; // Express app -> handler serverless
