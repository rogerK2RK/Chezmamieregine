const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema(
  {
    plat: { type: mongoose.Schema.Types.ObjectId, ref: 'Plat', index: true },
    author: { type: String, required: true, trim: true },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    text: { type: String, required: true, trim: true },
    hidden: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Comment', CommentSchema, 'comments');
