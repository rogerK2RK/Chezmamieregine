// Pour hasher et vérifier les mots de passe
const bcrypt = require('bcryptjs');
// Pour créer les tokens JWT
const jwt = require('jsonwebtoken');
// Modèle Mongoose pour les clients
const Client = require('../models/Client');

/**
 * Génère un token JWT pour un client (signature alignée avec clientAuth.js)
 * - Utilise JWT_CLIENT_SECRET si présent, sinon JWT_SECRET, sinon 'dev_secret'
 * - Ajoute { type: 'client' } pour distinguer des tokens admin
 */
function signClientToken(id) {
  const secret = process.env.JWT_CLIENT_SECRET || process.env.JWT_SECRET;
  return jwt.sign({ id, type: 'client' }, secret, { expiresIn: '30d' });
}


// Inscription client
exports.register = async (req, res) => {
  try {
    const { firstName, lastName, sex, email, password } = req.body;

    if (!firstName || !lastName || !sex || !email || !password) {
      return res.status(400).json({ message: 'Tous les champs sont requis' });
    }
    if (!['H', 'F', 'other'].includes(sex)) {
      return res.status(400).json({ message: "Sexe invalide (H, F ou other)" });
    }

    const exists = await Client.findOne({ email: String(email).toLowerCase().trim() });
    if (exists) return res.status(400).json({ message: 'Email déjà utilisé' });

    const hashed = await bcrypt.hash(password, 10);

    const client = await Client.create({
      firstName: String(firstName).trim(),
      lastName:  String(lastName).trim(),
      sex,
      email:     String(email).toLowerCase().trim(),
      password:  hashed,
    });

    const token = signClientToken(client._id);

    return res.status(201).json({
      _id: client._id,
      clientId: client.clientId,
      firstName: client.firstName,
      lastName: client.lastName,
      sex: client.sex,
      email: client.email,
      token
    });

  } catch (e) {
    console.error('REGISTER client ERROR:', e?.name, e?.message, e?.errors || '', e?.code || '');

    if (e?.code === 11000) {
      const dupField = Object.keys(e.keyPattern || {})[0] || 'unique';
      const msg = dupField === 'email' ? 'Email déjà utilisé'
                : dupField === 'clientId' ? 'Conflit ID client — réessayez'
                : 'Conflit d’unicité';
      return res.status(400).json({ message: msg });
    }

    if (e?.name === 'ValidationError') {
      const msg = Object.values(e.errors).map(er => er.message).join(' | ');
      return res.status(400).json({ message: msg || 'Données invalides' });
    }

    return res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Connexion client
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const client = await Client.findOne({ email: String(email).toLowerCase().trim() });
    if (!client) return res.status(400).json({ message: 'Identifiants invalides' });

    const ok = await bcrypt.compare(password, client.password);
    if (!ok) return res.status(400).json({ message: 'Identifiants invalides' });

    const token = signClientToken(client._id);
    res.json({
      _id: client._id,
      clientId: client.clientId,
      firstName: client.firstName,
      lastName: client.lastName,
      sex: client.sex,
      email: client.email,
      token
    });
  } catch (e) {
    console.error('LOGIN client ERROR:', e);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
