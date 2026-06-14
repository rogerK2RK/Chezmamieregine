// Pour hasher et vérifier les mots de passe
const bcrypt = require('bcryptjs');
// Pour créer les tokens JWT
const jwt = require('jsonwebtoken');
// Modèle Mongoose pour les clients
const Client = require('../models/Client');
// Secret JWT centralisé (validé au démarrage)
const { JWT_SECRET } = require('../config/jwt');

// =========================
// Regex de validation
// =========================
const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ' -]{2,50}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Min 8 caractères, au moins 1 lettre et 1 chiffre
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;

// 🔐 Génère un token JWT pour un client connecté
function signClientToken(id) {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: '30d' }); // Token valide 30 jours
}

// 🧾 Contrôleur : inscription d’un nouveau client
exports.register = async (req, res) => {
  try {
    let { firstName, lastName, sex, email, password } = req.body;

    // Normalisation basique
    firstName = String(firstName || '').trim();
    lastName  = String(lastName || '').trim();
    email     = String(email || '').toLowerCase().trim();
    password  = String(password || '');

    // ========= Vérifications de présence =========
    if (!firstName || !lastName || !sex || !email || !password) {
      return res.status(400).json({ message: 'Tous les champs sont requis.' });
    }

    // ========= Vérifications de format =========
    if (!nameRegex.test(firstName)) {
      return res.status(400).json({
        message:
          "Prénom invalide : 2 à 50 caractères, lettres, espaces, apostrophes ou tirets uniquement.",
      });
    }

    if (!nameRegex.test(lastName)) {
      return res.status(400).json({
        message:
          "Nom invalide : 2 à 50 caractères, lettres, espaces, apostrophes ou tirets uniquement.",
      });
    }

    if (!['H', 'F', 'other'].includes(sex)) {
      return res
        .status(400)
        .json({ message: 'Sexe invalide (H, F ou other).' });
    }

    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ message: "Adresse email invalide." });
    }

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          'Mot de passe invalide : au moins 8 caractères, avec au moins 1 lettre et 1 chiffre.',
      });
    }

    // ========= Vérifie si l’adresse email existe déjà =========
    const exists = await Client.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: 'Email déjà utilisé.' });
    }

    // ========= Hash du mot de passe et création du compte client =========
    const hashed = await bcrypt.hash(password, 10);

    const client = await Client.create({
      firstName,
      lastName,
      sex,
      email,
      password: hashed,
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
      token,
    });
  } catch (e) {
    console.error(
      'REGISTER client ERROR:',
      e?.name,
      e?.message,
      e?.errors || '',
      e?.code || ''
    );

    // Erreur d’unicité (email / clientId)
    if (e?.code === 11000) {
      const dupField = Object.keys(e.keyPattern || {})[0] || 'unique';
      const msg =
        dupField === 'email'
          ? 'Email déjà utilisé.'
          : dupField === 'clientId'
          ? 'Conflit ID client — réessayez.'
          : 'Conflit d’unicité.';
      return res.status(400).json({ message: msg });
    }

    // Erreur de validation Mongoose (en plus des regex)
    if (e?.name === 'ValidationError') {
      const msg = Object.values(e.errors)
        .map((er) => er.message)
        .join(' | ');
      return res.status(400).json({ message: msg || 'Données invalides.' });
    }

    return res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// 🔓 Contrôleur : connexion d’un client existant
exports.login = async (req, res) => {
  try {
    let { email, password } = req.body;
    email = String(email || '').toLowerCase().trim();
    password = String(password || '');

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: 'Email et mot de passe sont requis.' });
    }

    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ message: "Adresse email invalide." });
    }

    // Recherche du client dans la base
    const client = await Client.findOne({ email });
    if (!client) {
      return res.status(400).json({ message: 'Identifiants invalides.' });
    }

    // Vérification du mot de passe
    const ok = await bcrypt.compare(password, client.password);
    if (!ok) {
      return res.status(400).json({ message: 'Identifiants invalides.' });
    }

    // Génération du token JWT et réponse avec les infos client
    const token = signClientToken(client._id);
    res.json({
      _id: client._id,
      clientId: client.clientId,
      firstName: client.firstName,
      lastName: client.lastName,
      sex: client.sex,
      email: client.email,
      token,
    });
  } catch (e) {
    console.error('LOGIN client ERROR:', e);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// Récupérer le profil du client connecté
exports.me = async (req, res) => {
  try {
    if (!req.client) {
      return res.status(401).json({ message: 'Non autorisé.' });
    }

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
    return res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// Mettre à jour le profil du client connecté
exports.updateMe = async (req, res) => {
  try {
    if (!req.client) {
      return res.status(401).json({ message: 'Non autorisé.' });
    }

    const allowed = ['firstName', 'lastName', 'sex', 'email']; // champs éditables

    for (const k of allowed) {
      if (k in req.body) {
        let value = String(req.body[k] || '').trim();

        if (k === 'email') {
          value = value.toLowerCase();
          if (!emailRegex.test(value)) {
            return res
              .status(400)
              .json({ message: "Adresse email invalide." });
          }
          req.client.email = value;
        } else if (k === 'firstName' || k === 'lastName') {
          if (!nameRegex.test(value)) {
            return res.status(400).json({
              message:
                'Nom / prénom invalide : 2 à 50 caractères, lettres, espaces, apostrophes ou tirets uniquement.',
            });
          }
          req.client[k] = value;
        } else if (k === 'sex') {
          if (!['H', 'F', 'other'].includes(value)) {
            return res
              .status(400)
              .json({ message: 'Sexe invalide (H, F ou other).' });
          }
          req.client.sex = value;
        }
      }
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
      return res.status(400).json({ message: 'Email déjà utilisé.' });
    }
    return res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// Suppression du compte du client connecté
exports.deleteMe = async (req, res) => {
  try {
    if (!req.client) {
      return res.status(401).json({ message: 'Non autorisé.' });
    }

    const clientId = req.client._id;

    await Client.findByIdAndDelete(clientId);

    return res.json({ message: 'Compte supprimé avec succès.' });
  } catch (e) {
    console.error('DELETE ME client ERROR:', e);
    return res.status(500).json({ message: 'Suppression du compte impossible.' });
  }
};

