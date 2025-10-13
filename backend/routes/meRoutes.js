const express = require('express');
const router = express.Router();
const { clientProtect } = require('../middleware/clientAuth');

// Récupérer le profil du client connecté
router.get('/', clientProtect, async (req, res) => {
  const c = req.client;
  res.json({
    _id: c._id,
    clientId: c.clientId,
    firstName: c.firstName,
    lastName: c.lastName,
    sex: c.sex,
    email: c.email,
  });
});

// Mettre à jour le profil
router.put('/', clientProtect, async (req, res) => {
  const c = req.client;
  const { firstName, lastName, sex, email } = req.body || {};

  if (typeof firstName === 'string') c.firstName = firstName.trim();
  if (typeof lastName === 'string') c.lastName = lastName.trim();
  if (typeof email === 'string') c.email = email.trim().toLowerCase();
  if (sex && ['H', 'F', 'other'].includes(sex)) c.sex = sex;

  await c.save();
  res.json({
    _id: c._id,
    clientId: c.clientId,
    firstName: c.firstName,
    lastName: c.lastName,
    sex: c.sex,
    email: c.email,
  });
});

module.exports = router;
