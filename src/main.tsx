import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';  // ou './App.tsx' (mas geralmente só './App' funciona)
import './index.css';

const root = createRoot(document.getElementById('root')!);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
