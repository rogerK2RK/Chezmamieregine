// server.js — point d'entrée local/Render.
const app = require('./app');

const PORT = process.env.PORT || 5000;

// On lie le port IMMÉDIATEMENT (Render doit voir le service "live"),
// l'init DB tourne en arrière-plan (le middleware la garantit par requête).
app.listen(PORT, () => console.log(`🚀 API on http://localhost:${PORT}`));

app.init().catch((err) =>
  console.error('⚠️  Init différée (DB/superadmin) échouée:', err.message)
);
