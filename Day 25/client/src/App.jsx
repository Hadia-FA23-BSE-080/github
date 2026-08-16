import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [serverStatus, setServerStatus] = useState('Checking...');
  const [serverMessage, setServerMessage] = useState('');
  
  useEffect(() => {
    // This will point to Render backend URL in production
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    
    const checkServer = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/health`);
        if (res.ok) {
          const data = await res.json();
          setServerStatus('Online');
          setServerMessage(`Server responded at: ${new Date(data.timestamp).toLocaleTimeString()}`);
        } else {
          setServerStatus('Error');
          setServerMessage('Server responded with an error status.');
        }
      } catch (err) {
        setServerStatus('Offline');
        setServerMessage('Could not connect to the Render backend.');
      }
    };

    checkServer();
  }, []);

  return (
    <div className="container">
      <div className="card">
        <h1 className="title">Deployment Test</h1>
        <p className="subtitle">React on Vercel & Express on Render</p>
        
        <div className="status-container">
          <div className="status-item">
            <span className="status-label">Frontend (Vercel)</span>
            <span className="status-badge online">Active</span>
          </div>
          
          <div className="status-item">
            <span className="status-label">Backend (Render)</span>
            <span className={`status-badge ${serverStatus.toLowerCase()}`}>
              {serverStatus}
            </span>
          </div>
        </div>

        {serverMessage && (
          <div className="message-box">
            <p>{serverMessage}</p>
          </div>
        )}

        <div className="instructions">
          <h3>Deployment Guide</h3>
          <ul>
            <li><strong>Vercel:</strong> Push this <code>client</code> folder and set <code>VITE_API_URL</code> to your Render URL.</li>
            <li><strong>Render:</strong> Push the <code>server</code> folder and deploy as a Web Service.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
