const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Client = require('../models/Client');
const { JWT_SECRET } = require('../config/jwt');
const { asyncHandler, nameRegex, emailRegex, passwordRegex } = require('../utils/helpers');

const sign = (id) => jwt.sign({ id }, JWT_SECRET, { expiresIn: '30d' });

const publicClient = (c) => ({
  _id: c._id, clientId: c.clientId, firstName: c.firstName,
  lastName: c.lastName, sex: c.sex, email: c.email,
});

exports.register = asyncHandler(async (req, res) => {
  let { firstName, lastName, sex, email, password } = req.body;
  firstName = String(firstName || '').trim();
  lastName = String(lastName || '').trim();
  email = String(email || '').toLowerCase().trim();
  password = String(password || '');

  if (!firstName || !lastName || !sex || !email || !password)
    return res.status(400).json({ message: 'Tous les champs sont requis.' });
  if (!nameRegex.test(firstName) || !nameRegex.test(lastName))
    return res.status(400).json({ message: 'Nom/prénom invalide (2 à 50 lettres).' });
  if (!['H', 'F', 'other'].includes(sex))
    return res.status(400).json({ message: 'Sexe invalide.' });
  if (!emailRegex.test(email))
    return res.status(400).json({ message: 'Adresse email invalide.' });
  if (!passwordRegex.test(password))
    return res.status(400).json({ message: 'Mot de passe : 8+ caractères, 1 lettre et 1 chiffre.' });

  if (await Client.findOne({ email }))
    return res.status(400).json({ message: 'Email déjà utilisé.' });

  const hashed = await bcrypt.hash(password, 10);
  const client = await Client.create({ firstName, lastName, sex, email, password: hashed });
  return res.status(201).json({ ...publicClient(client), token: sign(client._id) });
});

exports.login = asyncHandler(async (req, res) => {
  let { email, password } = req.body;
  email = String(email || '').toLowerCase().trim();
  password = String(password || '');
  if (!emailRegex.test(email) || !password)
    return res.status(400).json({ message: 'Identifiants invalides.' });

  const client = await Client.findOne({ email });
  if (!client || !(await bcrypt.compare(password, client.password)))
    return res.status(400).json({ message: 'Identifiants invalides.' });

  return res.json({ ...publicClient(client), token: sign(client._id) });
});

exports.me = asyncHandler(async (req, res) => res.json(publicClient(req.client)));

exports.updateMe = asyncHandler(async (req, res) => {
  const allowed = ['firstName', 'lastName', 'sex', 'email'];
  for (const k of allowed) {
    if (!(k in req.body)) continue;
    let v = String(req.body[k] || '').trim();
    if (k === 'email') {
      v = v.toLowerCase();
      if (!emailRegex.test(v)) return res.status(400).json({ message: 'Email invalide.' });
    }
    if ((k === 'firstName' || k === 'lastName') && !nameRegex.test(v))
      return res.status(400).json({ message: 'Nom/prénom invalide.' });
    if (k === 'sex' && !['H', 'F', 'other'].includes(v))
      return res.status(400).json({ message: 'Sexe invalide.' });
    req.client[k] = v;
  }
  const saved = await req.client.save();
  return res.json(publicClient(saved));
});
