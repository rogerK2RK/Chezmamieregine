// server.js — point d'entrée local : lance l'app Express définie dans app.js.
const app = require('./app');

(async () => {
  try {
    await app.init();                 // connexion DB + création superadmin
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 API on http://localhost:${PORT}`));
  } catch (err) {
    console.error('Échec du démarrage du serveur:', err);
    process.exit(1);
  }
})();
