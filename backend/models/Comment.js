const mongoose = require('mongoose');
const { getNextId } = require('../utils/idGenerator');

const replySchema = new mongoose.Schema({
  by:   { type: mongoose.Schema.Types.ObjectId, ref: 'AdminUser', required: true },
  text: { type: String, required: true, trim: true },
  at:   { type: Date, default: Date.now }
}, { _id: false });

const commentSchema = new mongoose.Schema({
  commentId: { type: String, unique: true, index: true },
  plat:      { type: mongoose.Schema.Types.ObjectId, ref: 'Plat', required: true, index: true },
  client:    { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true, index: true },
  text:      { type: String, required: true, trim: true, maxlength: 2000 },
  rating:    { type: Number, min: 1, max: 5, default: 5 },   // optionnel
  status:    { type: String, enum: ['published','hidden','pending'], default: 'published', index: true },
  reply:     { type: replySchema, default: null }            // réponse Owner/Admin
}, { timestamps: true });

commentSchema.pre('save', async function(next){
  if (!this.isNew || this.commentId) return next();
  this.commentId = await getNextId('CMT','comment');
  next();
});

module.exports = mongoose.model('Comment', commentSchema);
