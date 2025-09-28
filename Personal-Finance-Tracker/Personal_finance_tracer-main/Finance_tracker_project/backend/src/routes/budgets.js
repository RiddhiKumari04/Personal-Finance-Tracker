const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Budget = require('../models/Budget');

// create
router.post('/', auth, async (req, res) => {
  const { category, limit, period } = req.body;
  const b = new Budget({ user: req.userId, category, limit, period, alertSent: false });
  await b.save();
  res.json(b);
});

// list
router.get('/', auth, async (req, res) => {
  const budgets = await Budget.find({ user: req.userId });
  res.json(budgets);
});

module.exports = router;
