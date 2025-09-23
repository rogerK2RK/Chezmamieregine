const bcrypt = require('bcryptjs');
const Client = require('../models/Client');
const generateToken = require('../utils/generateToken');

exports.register = async (req, res) => {
  const { name, email, password, phone } = req.body;
  const exists = await Client.findOne({ email });
  if (exists) return res.status(400).json({ message: 'Email déjà utilisé' });

  const hashed = await bcrypt.hash(password, 10);
  const client = await Client.create({ name, email, password: hashed, phone });

  res.status(201).json({
    _id: client._id,
    name: client.name,
    email: client.email,
    token: generateToken(client._id, 'client'),
  });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const client = await Client.findOne({ email });
  if (!client) return res.status(400).json({ message: 'Identifiants invalides' });

  const ok = await bcrypt.compare(password, client.password);
  if (!ok) return res.status(400).json({ message: 'Mot de passe incorrect' });

  res.json({
    _id: client._id,
    name: client.name,
    email: client.email,
    token: generateToken(client._id, 'client'),
  });
};
