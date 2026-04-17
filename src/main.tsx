import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const rootElement = document.getElementById('root');

if (rootElement) {
  try {
    createRoot(rootElement).render(
      <StrictMode>
        <App />
      </StrictMode>,
    );
  } catch (error) {
    console.error('Render error:', error);
    rootElement.innerHTML = `<div style="color: white; padding: 20px; font-family: sans-serif;">
      <h2 style="color: #ff4d4d;">SilenceX Initialization Error</h2>
      <p style="opacity: 0.7;">An error occurred while starting the extension. Please check if Premiere Pro is compatible.</p>
      <pre style="background: rgba(0,0,0,0.5); padding: 10px; font-size: 12px; overflow: auto;">${error instanceof Error ? error.stack : String(error)}</pre>
    </div>`;
  }
}

// Global error listener for even earlier crashes
window.onerror = function(msg, url, line, col, error) {
  if (rootElement) {
    rootElement.innerHTML = `<div style="color: white; padding: 20px; font-family: sans-serif;">
      <h2 style="color: #ff4d4d;">SilenceX Critical Crash</h2>
      <pre style="background: rgba(0,0,0,0.5); padding: 10px; font-size: 12px; overflow: auto;">${msg}\nAt: ${url}:${line}:${col}</pre>
    </div>`;
  }
  return false;
};
