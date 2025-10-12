// Pour chiffrer et vérifier les mots de passe
const bcrypt = require('bcryptjs');
// Pour générer les tokens JWT
const jwt = require('jsonwebtoken');
// Modèle Mongoose des utilisateurs (clients)
const User = require('../models/User');

// Génère un token JWT pour un client
function signClientToken(id) {
  const secret = process.env.JWT_SECRET;
  return jwt.sign({ id }, secret, { expiresIn: '30d' }); // Durée : 30 jours
}

// Contrôleur : inscription d’un nouvel utilisateur client
exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    // Vérifie si l’utilisateur existe déjà
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Utilisateur déjà existant' });

    // Hash du mot de passe et création du compte
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, role: 'client' });

    // Réponse avec infos de base + token d’authentification
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: signClientToken(user._id),
    });
  } catch (err) {
    console.error('register error', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Contrôleur : connexion d’un client existant
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Recherche l’utilisateur dans la base
    const user = await User.findOne({ email });
    if (!user || user.role !== 'client') {
      return res.status(400).json({ message: 'Accès réservé aux clients' });
    }

    // Vérifie le mot de passe
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ message: 'Mot de passe incorrect' });

    // Réponse avec les infos de l’utilisateur et son token JWT
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: signClientToken(user._id),
    });
  } catch (err) {
    console.error('login error', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
