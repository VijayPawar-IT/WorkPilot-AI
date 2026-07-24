import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Safely suppress benign and expected Sandbox-specific WebSocket HMR connection warnings
if (typeof window !== 'undefined') {
  const ignorePatterns = [
    'WebSocket',
    'websocket',
    'WebSocket closed',
    'websocket connection',
    'failed to connect to websocket'
  ];

  window.addEventListener('unhandledrejection', (event) => {
    const errorMsg = event.reason?.message || String(event.reason || '');
    if (ignorePatterns.some(pattern => errorMsg.toLowerCase().includes(pattern.toLowerCase()))) {
      event.preventDefault();
      event.stopPropagation();
      console.warn('[Vite Sandbox Guard] Intercepted and suppressed HMR WebSocket rejection:', errorMsg);
    }
  });

  window.addEventListener('error', (event) => {
    const errorMsg = event.message || '';
    if (ignorePatterns.some(pattern => errorMsg.toLowerCase().includes(pattern.toLowerCase()))) {
      event.preventDefault();
      event.stopPropagation();
      console.warn('[Vite Sandbox Guard] Intercepted and suppressed HMR WebSocket error:', errorMsg);
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

