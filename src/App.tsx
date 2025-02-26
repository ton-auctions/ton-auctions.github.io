import * as React from 'react';
import './index.css';
import { TonConnectUIProvider, TonConnectButton } from './ton-ui';
import { useEffect } from 'react';
import { WebApp } from '@grammyjs/web-app';

const manifest = new URL('./ton-connect-manifest.json', import.meta.url);

function App() {
  
  useEffect(() => {
    console.log(WebApp.initDataUnsafe.chat?.id);
    console.log(WebApp.initDataUnsafe.chat?.username);
  }, [])

  return (
    <TonConnectUIProvider manifestUrl={manifest.href}>
      <div>
        <header className='flex flex-col items-center justify-center min-h-screen bg-gray-700 text-white'>
          <span>My App with React UI</span>
          <span>{JSON.stringify(WebApp.initDataUnsafe)}</span>
          <TonConnectButton />
        </header>
      </div>
    </TonConnectUIProvider>
  );
}

export default App;
