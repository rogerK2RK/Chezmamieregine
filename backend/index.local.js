// backend/index.local.js
const app = require('./app');
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 API locale sur http://localhost:${PORT}`));
