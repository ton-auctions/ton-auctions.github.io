import * as React from 'react';
import './index.css';
import './App.css';
import { TonConnectUIProvider, TonConnectButton } from './ton-ui';

const manifest = new URL('ton-connect-manifest.json', import.meta.url);

function App() {
  return (
    <TonConnectUIProvider manifestUrl={manifest.href}>
      <div className="App">
        <header className="App-header">
          <span>My App with React UI</span>
          <span>{manifest.href}</span>
          <TonConnectButton />
        </header>
      </div>
    </TonConnectUIProvider>
  );
}

export default App;
