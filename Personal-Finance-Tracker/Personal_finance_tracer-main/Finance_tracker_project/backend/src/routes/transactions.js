const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Transaction = require('../models/Transaction');

// create transaction
router.post('/', auth, async (req, res) => {
  const { type, amount, category, date, notes } = req.body;
  if(!type || !amount) return res.status(400).json({ message: 'type and amount required' });
  try {
    const t = new Transaction({ user: req.userId, type, amount, category, date: date ? new Date(date) : new Date(), notes });
    await t.save();
    res.json(t);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// list with optional filters
router.get('/', auth, async (req, res) => {
  const { from, to, category } = req.query;
  const q = { user: req.userId };
  if(category) q.category = category;
  if(from || to) q.date = {};
  if(from) q.date.$gte = new Date(from);
  if(to) q.date.$lte = new Date(to);
  const items = await Transaction.find(q).sort({ date: -1 }).limit(1000);
  res.json(items);
});

module.exports = router;
