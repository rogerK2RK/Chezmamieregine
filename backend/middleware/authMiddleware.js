const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware pour protéger les routes des utilisateurs connectés
const protect = async (req, res, next) => {
  let token = req.headers.authorization;

  // Vérifie la présence d’un jeton au format "Bearer ..."
  if (token && token.startsWith("Bearer ")) {
    try {
      // Extrait le jeton et le vérifie avec la clé secrète
      token = token.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Récupère l’utilisateur associé au token (sans le mot de passe)
      req.user = await User.findById(decoded.id).select("-password");

      // Passe au middleware suivant
      next();
    } catch (err) {
      // Jeton invalide ou expiré
      res.status(401).json({ message: "Token invalide" });
    }
  } else {
    // Aucun token fourni
    res.status(401).json({ message: "Non autorisé, token manquant" });
  }
};

// Exporte le middleware
module.exports = { protect };
