const Commande = require("../models/Commande");

// GET all commandes (admin/owner)
exports.getAllCommandes = async (req, res) => {
  const commandes = await Commande.find().populate("user").populate("plats.plat");
  res.json(commandes);
};

// GET commandes d’un utilisateur (client)
exports.getMesCommandes = async (req, res) => {
  const commandes = await Commande.find({ user: req.user._id }).populate("plats.plat");
  res.json(commandes);
};

// POST créer une commande (client)
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

// PUT mettre à jour le statut (admin/owner)
exports.updateCommandeStatus = async (req, res) => {
  const { status } = req.body;

  const updatedCommande = await Commande.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!updatedCommande) return res.status(404).json({ message: "Commande non trouvée" });

  res.json(updatedCommande);
};
