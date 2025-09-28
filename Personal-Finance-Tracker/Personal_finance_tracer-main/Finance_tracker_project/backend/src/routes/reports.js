const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Transaction = require('../models/Transaction');
const { linearPredict } = require('../utils/predict');

// GET /api/reports/summary?month=2025-09
router.get('/summary', auth, async (req, res) => {
  const { month } = req.query;
  let start, end;
  if(month){
    const [y,m] = month.split('-').map(Number);
    start = new Date(y, m-1, 1);
    end = new Date(y, m-1+1, 1);
  } else {
    const now = new Date();
    start = new Date(now.getFullYear(), now.getMonth(), 1);
    end = new Date(now.getFullYear(), now.getMonth()+1, 1);
  }
  const agg = await Transaction.aggregate([
    { $match: { user: require('mongoose').Types.ObjectId(req.userId), date: { $gte: start, $lt: end } } },
    { $group: { _id: '$category', total: { $sum: '$amount' } } }
  ]);
  res.json({ byCategory: agg });
});

// GET /api/reports/predict?months=6
router.get('/predict', auth, async (req, res) => {
  const months = parseInt(req.query.months || '6', 10);
  const now = new Date();
  const data = [];
  for(let i = months-1; i >= 0; i--){
    const dt = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const start = dt;
    const end = new Date(dt.getFullYear(), dt.getMonth()+1, 1);
    const agg = await Transaction.aggregate([
      { $match: { user: require('mongoose').Types.ObjectId(req.userId), type: 'expense', date: { $gte: start, $lt: end } } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    data.push({ monthIndex: months - i - 1, total: (agg[0]?.total) || 0, month: `${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2,'0')}` });
  }
  const monthlyTotals = data.map((d,i)=>({ monthIndex: d.monthIndex, total: d.total }));
  const prediction = linearPredict(monthlyTotals);
  res.json({ monthly: data, prediction });
});

module.exports = router;
