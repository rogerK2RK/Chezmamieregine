const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  plat:          { type: mongoose.Schema.Types.ObjectId, ref: 'Plat', required: true },

  authorClient:  { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  authorName:    { type: String, required: true },

  text:          { type: String, required: true, trim: true },
  rating:        { type: Number, min: 1, max: 5, default: 5 },

  // Modération
  isHidden:      { type: Boolean, default: false },
  staffReply:    { type: String, default: '' },
  staffReplyAt:  { type: Date,   default: null },
  staffReplyBy:  { type: mongoose.Schema.Types.ObjectId, ref: 'AdminUser', default: null },
}, { timestamps: true });

module.exports = mongoose.model('Comment', commentSchema);
