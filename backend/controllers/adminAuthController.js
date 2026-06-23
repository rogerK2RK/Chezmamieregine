const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const AdminUser = require('../models/AdminUser');
const { JWT_ADMIN_SECRET } = require('../config/jwt');
const { asyncHandler, emailRegex } = require('../utils/helpers');

const signAdmin = (a) =>
  jwt.sign({ id: a._id, type: 'admin', role: a.role }, JWT_ADMIN_SECRET, { expiresIn: '30d' });

exports.loginAdmin = asyncHandler(async (req, res) => {
  const email = String(req.body.email || '').trim().toLowerCase();
  const password = String(req.body.password || '');

  const admin = await AdminUser.findOne({ email });
  if (!admin || !(await bcrypt.compare(password, admin.password)))
    return res.status(400).json({ message: 'Identifiants invalides' });
  if (!['admin', 'owner', 'superAdmin'].includes(admin.role))
    return res.status(403).json({ message: 'Accès réservé aux administrateurs' });

  return res.json({
    _id: admin._id, name: admin.name, email: admin.email,
    role: admin.role, token: signAdmin(admin),
  });
});

// Création d'un admin par un superAdmin/owner
exports.createAdmin = asyncHandler(async (req, res) => {
  let { name, email, password, role } = req.body;
  email = String(email || '').trim().toLowerCase();
  if (!name || !emailRegex.test(email) || !password)
    return res.status(400).json({ message: 'Champs invalides.' });
  if (!['admin', 'owner'].includes(role)) role = 'admin';
  if (await AdminUser.findOne({ email }))
    return res.status(400).json({ message: 'Email déjà utilisé.' });

  const hashed = await bcrypt.hash(password, 10);
  const admin = await AdminUser.create({ name, email, password: hashed, role });
  return res.status(201).json({ _id: admin._id, adminId: admin.adminId, name: admin.name, email: admin.email, role: admin.role });
});

exports.listAdmins = asyncHandler(async (_req, res) => {
  const admins = await AdminUser.find().select('-password').sort('-createdAt').lean();
  res.json(admins);
});
