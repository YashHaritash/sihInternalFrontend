import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import SpreadsheetEditor from './components/SpreadsheetEditor';

const socket = io('http://localhost:4000');

const App = () => {
  const [sessionKey, setSessionKey] = useState('');

  const createSession = async () => {
    const response = await fetch('http://localhost:4000/create-session', {
      method: 'POST',
    });
    const data = await response.json();
    setSessionKey(data.sessionKey);
    alert(`Your session key is: ${data.sessionKey}`);
    socket.emit('joinSession', data.sessionKey);
  };

  const joinSession = async (key) => {
    const response = await fetch('http://localhost:4000/join-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionKey: key }),
    });

    if (response.status === 200) {
      setSessionKey(key);
      socket.emit('joinSession', key);
    } else {
      alert('Session not found');
    }
  };

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to server');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
    };
  }, []);

  return (
    <div className="App">
      <h1>Real-Time Collaborative Spreadsheet</h1>
      {!sessionKey && (
        <div>
          <button onClick={createSession}>Create New Session</button>
          <br />
          <input 
            type="text" 
            placeholder="Enter session key" 
            onChange={(e) => setSessionKey(e.target.value)} 
          />
          <button onClick={() => joinSession(sessionKey)}>Join Session</button>
        </div>
      )}
      {sessionKey && <SpreadsheetEditor socket={socket} sessionKey={sessionKey} />}
    </div>
  );
};

export default App;
