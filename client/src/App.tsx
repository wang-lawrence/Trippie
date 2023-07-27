import { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const [serverData, setServerData] = useState('');

  useEffect(() => {
    async function readServerData() {
      const resp = await fetch('/api/hello');
      const data = await resp.json();

      console.log('TS react - Data from server:', data);

      setServerData(data.message);
    }

    readServerData();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1 className="text-gray-500 text-lg">{serverData}</h1>
      </header>
    </div>
  );
}

export default App;
