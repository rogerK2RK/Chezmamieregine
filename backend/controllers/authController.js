const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

function signClientToken(id) {
  const secret = process.env.JWT_SECRET;
  return jwt.sign({ id }, secret, { expiresIn: '30d' });
}

// POST /api/auth/register
exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Utilisateur déjà existant' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, role: 'client' });

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

// POST /api/auth/login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || user.role !== 'client') {
      return res.status(400).json({ message: 'Accès réservé aux clients' });
    }
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ message: 'Mot de passe incorrect' });

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
