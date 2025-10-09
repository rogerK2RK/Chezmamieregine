// backend/controllers/adminAuthController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const AdminUser = require('../models/AdminUser'); // 👈 modèle correct

function signAdminToken(admin) {
  // Utilise TOUJOURS la même clé que le middleware
  const secret = process.env.JWT_ADMIN_SECRET || process.env.JWT_SECRET;

  // On encode l'id + le type + le rôle pour que le middleware puisse autoriser
  return jwt.sign(
    { id: admin._id, type: 'admin', role: admin.role },
    secret,
    { expiresIn: '30d' }
  );
}

// POST /api/admin/login
exports.loginAdmin = async (req, res) => {
  try {
    const emailNorm = (req.body.email || '').trim().toLowerCase();
    const { password } = req.body;

    const admin = await AdminUser.findOne({ email: emailNorm });
    if (!admin) return res.status(400).json({ message: 'Identifiants invalides' });

    if (!['admin', 'owner', 'superAdmin'].includes(admin.role)) {
      return res.status(403).json({ message: 'Accès réservé aux administrateurs' });
    }

    const ok = await bcrypt.compare(password, admin.password);
    if (!ok) return res.status(400).json({ message: 'Identifiants invalides' });

    const token = signAdminToken(admin);

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

// POST /api/admin/create-user
exports.createUserByAdmin = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!['admin', 'owner'].includes(role)) {
      return res.status(400).json({ message: 'Rôle non autorisé' });
    }

    const emailNorm = (email || '').trim().toLowerCase();
    const exists = await AdminUser.findOne({ email: emailNorm });
    if (exists) return res.status(400).json({ message: 'Utilisateur déjà existant' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await AdminUser.create({ name, email: emailNorm, password: hashed, role });

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

// GET /api/admin/users
exports.listAdmins = async (_req, res) => {
  try {
    const users = await AdminUser.find({}, '-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (e) {
    console.error('listAdmins error', e);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
