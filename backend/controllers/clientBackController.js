// Modèle Mongoose des clients
const Client = require('../models/Client'); 
// Pour le hachage des mots de passe
const bcrypt = require('bcryptjs');
// Pour générer des mots de passe temporaires   
const crypto = require('crypto');

// Récupère la liste de tous les clients (sans mot de passe)
exports.getAllClients = async (req, res) => {
  try {
    const clients = await Client.find({}, 'clientId firstName lastName email sex createdAt');
    res.json(clients);
  } catch (e) {
    console.error('getAllClients ERROR', e);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Met à jour les informations d’un client existant
exports.updateClient = async (req, res) => {
  try {
    // Ne garde que les champs autorisés pour la mise à jour
    const patch = (({ lastName, firstName, email, sex }) => ({ lastName, firstName, email, sex }))(req.body);

    // Met à jour le document client
    const updated = await Client.findByIdAndUpdate(req.params.id, patch, { new: true })
      .select('lastName firstName email sex createdAt');
    if (!updated) return res.status(404).json({ message: 'Client introuvable' });
    res.json(updated);
  } catch (e) {
    console.error('updateClient', e);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Réinitialise le mot de passe d’un client (génère un mot de passe temporaire)
exports.resetPassword = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) return res.status(404).json({ message: 'Client introuvable' });

    // Génère un mot de passe temporaire aléatoire et le hash
    const temp = crypto.randomBytes(4).toString('hex');
    const hashed = await bcrypt.hash(temp, 10);

    // Remplace l’ancien mot de passe par le nouveau hashé
    client.password = hashed;
    await client.save();

    // Retourne le mot de passe temporaire en clair (pour l’admin)
    res.json({ tempPassword: temp });
  } catch (e) {
    console.error('resetPassword', e);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Supprime définitivement un client
exports.deleteClient = async (req, res) => {
  try {
    const del = await Client.findByIdAndDelete(req.params.id);
    if (!del) return res.status(404).json({ message: 'Client introuvable' });
    res.json({ ok: true });
  } catch (e) {
    console.error('deleteClient', e);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
