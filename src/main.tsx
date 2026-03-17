import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { Buffer } from 'buffer';

(window as any).global = window;
(window as any).Buffer = (window as any).Buffer || Buffer;
(window as any).process = (window as any).process || { 
  env: {}, 
  nextTick: (cb: Function, ...args: any[]) => setTimeout(() => cb(...args), 0) 
};

import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
