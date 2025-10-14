// Pour hasher et vérifier les mots de passe
const bcrypt = require('bcryptjs');
// Pour créer les tokens JWT
const jwt = require('jsonwebtoken');
// Modèle Mongoose pour les clients
const Client = require('../models/Client'); 

// 🔐 Génère un token JWT pour un client connecté
function signClientToken(id) {
  const secret = process.env.JWT_SECRET || 'dev_secret';
  return jwt.sign({ id }, secret, { expiresIn: '30d' }); // Token valide 30 jours
}

// 🧾 Contrôleur : inscription d’un nouveau client
exports.register = async (req, res) => {
  try {
    const { firstName, lastName, sex, email, password } = req.body;

    // Vérifie la présence et validité des champs
    if (!firstName || !lastName || !sex || !email || !password) {
      return res.status(400).json({ message: 'Tous les champs sont requis' });
    }
    if (!['H', 'F', 'other'].includes(sex)) {
      return res.status(400).json({ message: "Sexe invalide (H, F ou other)" });
    }

    // Vérifie si l’adresse email existe déjà
    const exists = await Client.findOne({ email: String(email).toLowerCase().trim() });
    if (exists) return res.status(400).json({ message: 'Email déjà utilisé' });

    // Hash du mot de passe et création du compte client
    const hashed = await bcrypt.hash(password, 10);
    const client = await Client.create({
      firstName: String(firstName).trim(),
      lastName:  String(lastName).trim(),
      sex,
      email:     String(email).toLowerCase().trim(),
      password:  hashed,
    });

    // Génération du token JWT
    const token = signClientToken(client._id);

    // Retourne les infos essentielles du client + token
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

// 🔓 Contrôleur : connexion d’un client existant
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Recherche du client dans la base
    const client = await Client.findOne({ email: String(email).toLowerCase().trim() });
    if (!client) return res.status(400).json({ message: 'Identifiants invalides' });

    // Vérification du mot de passe
    const ok = await bcrypt.compare(password, client.password);
    if (!ok) return res.status(400).json({ message: 'Identifiants invalides' });

    // Génération du token JWT et réponse avec les infos client
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

// Récupérer le profil du client connecté
exports.me = async (req, res) => {
  try {
    if (!req.client) return res.status(401).json({ message: 'Non autorisé' });

    const c = req.client;
    return res.json({
      _id: c._id,
      clientId: c.clientId,
      firstName: c.firstName,
      lastName: c.lastName,
      sex: c.sex,
      email: c.email,
    });
  } catch (e) {
    console.error('ME client ERROR:', e);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Mettre à jour le profil du client connecté
exports.updateMe = async (req, res) => {
  try {
    if (!req.client) return res.status(401).json({ message: 'Non autorisé' });

    const allowed = ['firstName', 'lastName', 'sex', 'email']; // champs éditables
    for (const k of allowed) {
      if (k in req.body) {
        if (k === 'email') {
          req.client.email = String(req.body.email).toLowerCase().trim();
        } else {
          req.client[k] = String(req.body[k]).trim();
        }
      }
    }

    // petite validation du sexe
    if (req.body.sex && !['H', 'F', 'other'].includes(req.body.sex)) {
      return res.status(400).json({ message: "Sexe invalide (H, F ou other)" });
    }

    const saved = await req.client.save();
    return res.json({
      _id: saved._id,
      clientId: saved.clientId,
      firstName: saved.firstName,
      lastName: saved.lastName,
      sex: saved.sex,
      email: saved.email,
    });
  } catch (e) {
    console.error('UPDATE ME client ERROR:', e);
    if (e?.code === 11000 && e?.keyPattern?.email) {
      return res.status(400).json({ message: 'Email déjà utilisé' });
    }
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};
