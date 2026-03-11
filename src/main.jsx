/**
 * Punto de entrada principal de la aplicación
 * Renderiza el componente App dentro de StrictMode para detección de problemas
 */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { registerSW } from 'virtual:pwa-register';

// Registrar el Service Worker con callback de actualización automática.
// Con registerType: 'autoUpdate' en vite.config.js, el SW nuevo se descarga
// e instala en segundo plano. Este callback se ejecuta cuando ya está listo
// y fuerza la recarga de la página para que el usuario vea la versión nueva
// sin necesidad de cerrar y volver a abrir la app manualmente.
registerSW({
  onNeedRefresh() {
    // Nueva versión disponible y activada: recargar para aplicarla
    updateSW(true);
  },
  onOfflineReady() {
    // App lista para funcionar sin conexión (archivos pre-cacheados)
    console.log('PickPad lista para uso offline');
  },
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);