const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

const authRoutes = require("./routes/authRoutes");
const platRoutes = require("./routes/platRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/plats", platRoutes);

// Test route
app.get("/", (req, res) => res.send("Bienvenue sur l'API de Chez Mamie Régine"));

// Lancement serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Serveur lancé sur le port ${PORT}`));
