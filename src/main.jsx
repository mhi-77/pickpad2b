/**
 * Punto de entrada principal de la aplicación
 * Renderiza el componente App dentro de StrictMode para detección de problemas
 */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);