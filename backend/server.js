// server.js — point d'entrée local : lance l'app Express définie dans app.js.
const app = require('./app');

const PORT = process.env.PORT || 5000;

// On lie le port IMMÉDIATEMENT : l'hôte (Render) doit voir le service "live"
// même si la base de données met du temps à répondre. Le middleware d'app.js
// garantit que la DB est connectée avant de traiter chaque requête.
app.listen(PORT, () => console.log(`🚀 API on http://localhost:${PORT}`));

// Initialisation (connexion DB + superadmin) en arrière-plan : une erreur ici
// ne doit pas empêcher le serveur d'écouter. Le middleware réessaiera par requête.
app.init().catch((err) => {
  console.error('⚠️  Initialisation différée (DB/superadmin) échouée:', err.message);
});
