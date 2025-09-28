import React, { useEffect, useState } from 'react';
import Dashboard from './pages/Dashboard';
import api from './services/api';

export default function App(){
  const [user, setUser] = useState(null);

  useEffect(()=> {
    const token = localStorage.getItem('token');
    if(token){
      // try to fetch preferences
      api.get('/user/preferences').then(r => setUser(r.data)).catch(()=> {});
    }
  }, []);

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: 20 }}>
      <h1>Personal Finance Tracker (Starter)</h1>
      <p style={{ color: '#666' }}>Minimal frontend — extend as needed.</p>
      <Dashboard user={user} />
    </div>
  );
}
