const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// get preferences
router.get('/preferences', auth, async (req, res) => {
  const user = await User.findById(req.userId).select('currency locale name email');
  res.json(user);
});

// update preferences
router.patch('/preferences', auth, async (req, res) => {
  const { currency, locale, name } = req.body;
  const user = await User.findById(req.userId);
  if(!user) return res.status(404).json({ message: 'User not found' });
  if(currency) user.currency = currency;
  if(locale) user.locale = locale;
  if(name) user.name = name;
  await user.save();
  res.json({ currency: user.currency, locale: user.locale, name: user.name });
});

module.exports = router;
