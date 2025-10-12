const app = require('./app'); // Importe l’application Express
const PORT = process.env.PORT || 5000; // Définit le port (variable d’env. ou 5000 par défaut)

// Lance le serveur HTTP Express
app.listen(PORT, () => console.log(`🚀 API locale sur http://localhost:${PORT}`));
