const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

// CORS en dev
app.use(cors({ origin: "http://localhost:5173" }));

app.use(express.json());

// Routes
const adminRoutes = require("./routes/adminRoutes");
app.use("/api/admin", adminRoutes);

const authRoutes = require("./routes/authRoutes");
const platRoutes = require("./routes/platRoutes");
const commandeRoutes = require("./routes/commandeRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/plats", platRoutes);
app.use("/api/commandes", commandeRoutes);


// Test route
app.get("/", (req, res) => res.send("Bienvenue sur l'API de Chez Mamie Régine"));

// Lancement serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Serveur lancé sur le port ${PORT}`));
