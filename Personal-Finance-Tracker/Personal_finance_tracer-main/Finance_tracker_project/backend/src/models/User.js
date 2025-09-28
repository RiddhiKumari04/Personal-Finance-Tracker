const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  currency: { type: String, default: 'INR' },
  locale: { type: String, default: 'en-IN' }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
