const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: String,
  limit: Number,
  period: { type: String, enum: ['monthly','weekly','yearly'], default: 'monthly' },
  alertSent: { type: Boolean, default: false }
});

module.exports = mongoose.model('Budget', budgetSchema);
