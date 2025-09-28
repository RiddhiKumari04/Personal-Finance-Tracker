const cron = require('node-cron');
const Budget = require('../models/Budget');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const { sendMail } = require('../utils/mailer');

function start() {
  // every day at 09:00
  cron.schedule('0 9 * * *', async () => {
    try {
      const budgets = await Budget.find({});
      const now = new Date();
      for(const b of budgets){
        // compute period start
        let periodStart = new Date(now);
        if(b.period === 'monthly') periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
        else if(b.period === 'weekly') { const day = now.getDay(); periodStart.setDate(now.getDate() - (day - 1)); }
        else periodStart = new Date(now.getFullYear(), 0, 1);
        const agg = await Transaction.aggregate([
          { $match: { user: b.user, type: 'expense', date: { $gte: periodStart, $lte: now } } },
          { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);
        const spent = (agg[0]?.total) || 0;
        if(b.limit && spent >= 0.9 * b.limit && !b.alertSent){
          b.alertSent = true;
          await b.save();
          const user = await User.findById(b.user);
          await sendMail(user.email, 'Budget warning', `You have spent ${spent} of ${b.limit} for ${b.category || 'general'} this period.`);
        }
      }
    } catch(err){
      console.error('cron error', err);
    }
  });
}

module.exports = { start };
