const bcrypt = require('bcryptjs');
const AdminUser = require('../models/AdminUser');
const generateToken = require('../utils/generateToken');

exports.adminLogin = async (req, res) => {
  const { email, password } = req.body;
  
  const admin = await AdminUser.findOne({ email });
  if (!admin) return res.status(400).json({ message: 'Identifiants invalides' });

  const ok = await bcrypt.compare(password, admin.password);
  if (!ok) return res.status(400).json({ message: 'Mot de passe incorrect' });

  res.json({
    _id: admin._id,
    name: admin.name,
    email: admin.email,
    role: admin.role,
    token: generateToken(admin._id, 'admin'),
  });
};

exports.createAdminUser = async (req, res) => {
  const { name, email, password, role = 'admin' } = req.body;
  if (!['admin', 'superAdmin', 'owner'].includes(role)) {
    return res.status(400).json({ message: 'Rôle invalide' });
  }
  const exists = await AdminUser.findOne({ email });
  if (exists) return res.status(400).json({ message: 'Email déjà utilisé' });

  const hashed = await bcrypt.hash(password, 10);
  const admin = await AdminUser.create({ name, email, password: hashed, role });
  res.status(201).json({ _id: admin._id, name: admin.name, email: admin.email, role: admin.role });
};
