const mongoose = require("mongoose");

const commandeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  plats: [
    {
      plat: { type: mongoose.Schema.Types.ObjectId, ref: "Plat", required: true },
      quantity: { type: Number, required: true, default: 1 }
    }
  ],
  total: { type: Number, required: true },
  status: { type: String, enum: ["en attente", "en cours", "livrée"], default: "en attente" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Commande", commandeSchema);
