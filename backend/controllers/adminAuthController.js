// Pour le hachage et la vérif de mots de passe
const bcrypt = require('bcryptjs');
// Pour la génération de tokens JWT            
const jwt = require('jsonwebtoken');
// Modèle Mongoose pour les utilisateurs admin         
const AdminUser = require('../models/AdminUser');

// Fonction utilitaire : génère un token JWT pour un admin
function signAdminToken(admin) {
  const secret = process.env.JWT_ADMIN_SECRET || process.env.JWT_SECRET;
  return jwt.sign(
    { id: admin._id, type: 'admin', role: admin.role },
    secret,
    { expiresIn: '30d' }
  );
}

// Contrôleur : connexion d’un administrateur
exports.loginAdmin = async (req, res) => {
  try {
    const emailNorm = (req.body.email || '').trim().toLowerCase();
    const { password } = req.body;

    // Vérifie si l'admin existe
    const admin = await AdminUser.findOne({ email: emailNorm });
    if (!admin) return res.status(400).json({ message: 'Identifiants invalides' });

    // Vérifie le rôle autorisé
    if (!['admin', 'owner', 'superAdmin'].includes(admin.role)) {
      return res.status(403).json({ message: 'Accès réservé aux administrateurs' });
    }

    // Compare le mot de passe fourni avec le hash stocké
    const ok = await bcrypt.compare(password, admin.password);
    if (!ok) return res.status(400).json({ message: 'Identifiants invalides' });

    // Génère le token JWT
    const token = signAdminToken(admin);

    // Retourne les infos admin + token
    res.json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      token
    });
  } catch (err) {
    console.error('loginAdmin error', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Contrôleur : création d’un utilisateur admin par un autre admin
exports.createUserByAdmin = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Vérifie que le rôle est autorisé
    if (!['admin', 'owner'].includes(role)) {
      return res.status(400).json({ message: 'Rôle non autorisé' });
    }

    // Vérifie si l’email est déjà utilisé
    const emailNorm = (email || '').trim().toLowerCase();
    const exists = await AdminUser.findOne({ email: emailNorm });
    if (exists) return res.status(400).json({ message: 'Utilisateur déjà existant' });

    // Hachage du mot de passe et création du compte
    const hashed = await bcrypt.hash(password, 10);
    const user = await AdminUser.create({ name, email: emailNorm, password: hashed, role });

    // Retourne les infos du nouvel utilisateur (sans mot de passe)
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    });
  } catch (err) {
    console.error('createUserByAdmin error', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Contrôleur : liste tous les administrateurs (sans les mots de passe)
exports.listAdmins = async (_req, res) => {
  try {
    const users = await AdminUser.find({}, '-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (e) {
    console.error('listAdmins error', e);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
