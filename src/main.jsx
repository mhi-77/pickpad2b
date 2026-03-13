/**
 * Punto de entrada principal de la aplicación
 * Renderiza el componente App dentro de StrictMode para detección de problemas
 */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { registerSW } from 'virtual:pwa-register';

// Registrar el Service Worker con callback de actualización.
// Con registerType: 'autoUpdate' en vite.config.js, el SW nuevo se descarga
// e instala en segundo plano. Cuando está listo, se muestra un banner
// para que el usuario actualice manualmente cuando lo desee.
let updateSW;

// Inyectar un banner en el DOM cuando hay una nueva versión disponible.
// El usuario decide cuándo recargar tocando el banner.
function showUpdateBanner() {
  const banner = document.createElement('div');
  banner.id = 'update-banner';
  banner.style.cssText = `
    position: fixed;
    top: 0; left: 0; right: 0;
    background: #2563EA;
    color: white;
    text-align: center;
    padding: 10px;
    font-size: 14px;
    z-index: 9999;
    cursor: pointer;
  `;
  banner.textContent = '🔄 Nueva versión disponible — Tocá para actualizar';
  banner.onclick = () => updateSW(true);
  document.body.appendChild(banner);
}

// onNeedRefresh: se dispara cuando el SW nuevo está listo para tomar control.
// En lugar de recargar automáticamente, muestra el banner para no interrumpir al usuario.
updateSW = registerSW({
  onNeedRefresh() {                        console.log('🔄 onNeedRefresh disparado');
    showUpdateBanner();
  },
  onOfflineReady() {                        console.log('✅ onOfflineReady disparado');
    // App lista para funcionar sin conexión (archivos pre-cacheados)
    console.log('PickPad lista para uso offline');
  },
  onRegistered(r) {
    console.log('📦 SW registrado:', r);
  },
  onRegisterError(error) {
    console.error('❌ Error registrando SW:', error);
  }
});
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);