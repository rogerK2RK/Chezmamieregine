const mongoose = require("mongoose");

const platSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
  images: [
    {
      url:  { type: String, required: true },
      order:  { type: Number, default: 1 }  // pour gérer l’ordre d’affichage
    }
  ],
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  available: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model("Plat", platSchema);
