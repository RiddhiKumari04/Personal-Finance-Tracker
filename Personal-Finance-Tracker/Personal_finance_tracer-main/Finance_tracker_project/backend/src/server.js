require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// connect to mongo
const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/finance';
mongoose.connect(mongoURI).then(()=>console.log('Mongo connected')).catch(err=>console.error(err));

// routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/transactions', require('./routes/transactions'));
app.use('/api/budgets', require('./routes/budgets'));
app.use('/api/reports', require('./routes/reports'));
app.use('/api/user', require('./routes/user'));

const PORT = process.env.PORT || 4000;
app.listen(PORT, ()=>console.log(`Server listening on ${PORT}`));

// start cron jobs
try { require('./cron/checkBudgets').start(); } catch(e){ console.log('cron not started', e); }
