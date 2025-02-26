import * as React from 'react';
import './index.css';
import './App.css';
import { TonConnectUIProvider } from './ton-ui';

const manifest = new URL('ton-connect-manifest.json', import.meta.url);
const logo = new URL('logo.svg', import.meta.url);

function App() {
  return (
    <TonConnectUIProvider manifestUrl={manifest.href}>
      <div className="App">
        <header className="App-header">
          <img src={logo.pathname} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    </TonConnectUIProvider>
  );
}

export default App;
