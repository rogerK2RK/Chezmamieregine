const Commande = require("../models/Commande");

// Récupère toutes les commandes (pour l’admin)
// Inclut les infos de l’utilisateur et des plats via populate()
exports.getAllCommandes = async (req, res) => {
  const commandes = await Commande.find()
    .populate("user")          // Joint les infos de l’utilisateur
    .populate("plats.plat");   // Joint les détails des plats commandés
  res.json(commandes);
};

// Récupère uniquement les commandes de l’utilisateur connecté
exports.getMesCommandes = async (req, res) => {
  const commandes = await Commande.find({ user: req.user._id })
    .populate("plats.plat");   // Ajoute les détails des plats
  res.json(commandes);
};

// Crée une nouvelle commande pour l’utilisateur connecté
exports.createCommande = async (req, res) => {
  const { plats, total } = req.body;

  const newCommande = new Commande({
    user: req.user._id,
    plats,
    total
  });

  const savedCommande = await newCommande.save();
  res.status(201).json(savedCommande);
};

// Met à jour le statut d’une commande (ex: en cours, livrée, annulée)
exports.updateCommandeStatus = async (req, res) => {
  const { status } = req.body;

  const updatedCommande = await Commande.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true } // Retourne la version mise à jour
  );

  if (!updatedCommande)
    return res.status(404).json({ message: "Commande non trouvée" });

  res.json(updatedCommande);
};
