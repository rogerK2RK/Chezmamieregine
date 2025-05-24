const Plat = require("../models/Plat");

// GET all plats
exports.getPlats = async (req, res) => {
  const plats = await Plat.find();
  res.json(plats);
};

// GET single plat by ID
exports.getPlatById = async (req, res) => {
  const plat = await Plat.findById(req.params.id);
  if (!plat) return res.status(404).json({ message: "Plat non trouvé" });
  res.json(plat);
};

// POST create plat
exports.createPlat = async (req, res) => {
  console.log("REQ.BODY ➔", req.body);
  const newPlat = new Plat({ ...req.body, owner: req.user._id });
  const savedPlat = await newPlat.save();
  res.status(201).json(savedPlat);
};

// PUT update plat
exports.updatePlat = async (req, res) => {
  const updatedPlat = await Plat.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!updatedPlat) return res.status(404).json({ message: "Plat non trouvé" });
  res.json(updatedPlat);
};

// DELETE plat
exports.deletePlat = async (req, res) => {
  const deletedPlat = await Plat.findByIdAndDelete(req.params.id);
  if (!deletedPlat) return res.status(404).json({ message: "Plat non trouvé" });
  res.json({ message: "Plat supprimé" });
};
