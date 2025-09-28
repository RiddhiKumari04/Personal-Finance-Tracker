import React from 'react';
export default function TransactionList({ items }){
  if(!items || items.length === 0) return <div>No transactions yet</div>;
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead><tr><th>Date</th><th>Type</th><th>Category</th><th>Amount</th><th>Notes</th></tr></thead>
      <tbody>
        {items.map(it => (
          <tr key={it._id} style={{ borderTop: '1px solid #eee' }}>
            <td>{new Date(it.date).toLocaleDateString()}</td>
            <td>{it.type}</td>
            <td>{it.category}</td>
            <td>{it.amount}</td>
            <td>{it.notes}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
