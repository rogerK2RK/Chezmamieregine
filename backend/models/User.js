const mongoose = require("mongoose");

// Schéma Mongoose pour les utilisateurs (clients ou admins)
const userSchema = new mongoose.Schema({
  name:     { type: String, required: true }, // Nom de l’utilisateur
  email:    { type: String, required: true, unique: true }, // Email unique
  password: { type: String, required: true }, // Mot de passe hashé
  role:     { 
    type: String, 
    enum: ["client", "owner", "admin"], 
    default: "client" 
  } // Rôle utilisateur (client par défaut)
}, { timestamps: true }); // Ajoute createdAt et updatedAt

// Exporte le modèle lié à la collection "users"
module.exports = mongoose.model("User", userSchema);
