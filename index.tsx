import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Security Check
const params = new URLSearchParams(window.location.search);
const key = params.get('key');
const ACCESS_KEY = import.meta.env.VITE_ACCESS_KEY;

// If VITE_ACCESS_KEY is defined in environment, enforce it.
if (ACCESS_KEY && key !== ACCESS_KEY) {
  document.body.innerHTML = `
    <div style="height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; background-color: #f9fafb; font-family: system-ui, -apple-system, sans-serif;">
      <h1 style="font-size: 1.5rem; font-weight: 700; color: #111827; margin-bottom: 0.5rem;">Access denied</h1>
      <p style="color: #6b7280;">This demo is private.</p>
    </div>
  `;
  throw new Error('Unauthorized');
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);