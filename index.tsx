
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import Splash from './components/Splash';

// Maintenance mode: when true, only the opening splash screen is shown and the
// app itself never mounts. Set to false to bring the app back up.
const MAINTENANCE_MODE = true;

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    {MAINTENANCE_MODE ? <Splash /> : <App />}
  </React.StrictMode>
);
