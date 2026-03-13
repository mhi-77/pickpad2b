/**
 * Punto de entrada principal de la aplicación
 * Renderiza el componente App dentro de StrictMode para detección de problemas
 */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Registrar el Service Worker y escuchar actualizaciones con la API nativa del navegador,
// evitando dependencia de virtual:pwa-register que no se resuelve correctamente.
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').then(registration => {

    // Cada vez que el SW detecta un archivo nuevo, 'updatefound' se dispara
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;

      newWorker.addEventListener('statechange', () => {
        // Cuando el SW nuevo está instalado y listo para activarse
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          showUpdateBanner();
        }
      });
    });

  }).catch(err => {
    if (import.meta.env.DEV) return; // ignorar en desarrollo/Bolt
    console.error('SW registration failed:', err);
  });
}

// Mostrar banner no intrusivo para que el usuario decida cuándo actualizar
function showUpdateBanner() {
  const banner = document.createElement('div');
  banner.id = 'update-banner';
  banner.style.cssText = `
    position: fixed;
    top: 0; left: 0; right: 0;
    background: #04C0B9;
    color: white;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 16px;
    z-index: 9999;
  `;
  
  const text = document.createElement('span');
  text.style.cssText = 'flex: 1; text-align: center; cursor: pointer; line-height: 1.5;';
  text.innerHTML = `
    <div style="font-size: 15px; font-weight: 600;">
    <svg style="display:inline; vertical-align: middle; margin-right: 6px;" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"   stroke-linecap="round" stroke-linejoin="round">
      <polyline points="23 4 23 10 17 10"></polyline>
      <polyline points="1 20 1 14 7 14"></polyline>
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
    </svg>
    Nueva versión disponible
    </div>
    <div style="font-size: 13px; opacity: 0.9;">Tocá para actualizar y reiniciar</div>
  `;
  text.onclick = () => window.location.reload();

  const closeBtn = document.createElement('button');
  closeBtn.textContent = '✕';
  closeBtn.style.cssText = `
    background: none;
    border: none;
    color: white;
    font-size: 18px;
    cursor: pointer;
    padding: 0 0 0 12px;
    line-height: 1;
    opacity: 0.8;
  `;
  closeBtn.onclick = () => banner.remove();

  banner.appendChild(text);
  banner.appendChild(closeBtn);
  document.body.appendChild(banner);
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);