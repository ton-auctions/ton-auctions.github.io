import * as React from 'react';
import './index.css';
import { TonConnectUIProvider, TonConnectButton } from './ton-ui';

const manifest = new URL('./ton-connect-manifest.json', import.meta.url);

function App() {
  return (
    <TonConnectUIProvider manifestUrl={manifest.href}>
      <div>
        <header className='flex flex-col items-center justify-center min-h-screen bg-gray-700 text-white'>
          <span>My App with React UI</span>
          <TonConnectButton />
        </header>
      </div>
    </TonConnectUIProvider>
  );
}

export default App;
