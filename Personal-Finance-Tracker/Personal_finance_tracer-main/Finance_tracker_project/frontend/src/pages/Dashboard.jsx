import React, { useEffect, useState } from 'react';
import api from '../services/api';
import TransactionList from '../components/TransactionList';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
ChartJS.register(ArcElement, Tooltip, Legend);

export default function Dashboard({ user }){
  const [tx, setTx] = useState([]);
  const [byCat, setByCat] = useState([]);
  const [predict, setPredict] = useState(null);

  useEffect(()=> {
    api.get('/transactions').then(r => setTx(r.data)).catch(()=> {});
    api.get('/reports/summary').then(r => setByCat(r.data.byCategory)).catch(()=> {});
    api.get('/reports/predict').then(r => setPredict(r.data)).catch(()=> {});
  }, []);

  const exportCSV = () => {
    const header = ['Date','Type','Category','Amount','Notes'];
    const rows = tx.map(t => [new Date(t.date).toISOString().slice(0,10), t.type, t.category, t.amount, (t.notes||'').replace(/,/g,'')]);
    const csv = [header, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `transactions_${new Date().toISOString().slice(0,10)}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const labels = byCat.map(b => b._id || 'Unk');
  const data = byCat.map(b => b.total);

  return (
    <div>
      <div style={{ display:'flex', gap:20 }}>
        <div style={{ flex:1 }}>
          <h2>Transactions</h2>
          <TransactionList items={tx} />
          <button onClick={exportCSV}>Export CSV</button>
        </div>
        <div style={{ width:320 }}>
          <h2>Spending by Category</h2>
          <Pie data={{ labels, datasets: [{ data }] }} />
          <h3>Prediction</h3>
          <div>{predict ? `Next month predicted spending: ${Math.round(predict.prediction)}` : 'Loading...'}</div>
        </div>
      </div>
    </div>
  );
}
