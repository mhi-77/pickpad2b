import { useState, useEffect } from 'react';

/**
 * Hook useInstallPWA
 *
 * Propósito: Gestiona la instalación de la app como PWA combinando dos estrategias:
 * - Instalación nativa con un toque (Android/Chrome, PC/Edge) via beforeinstallprompt
 * - Modal con instrucciones manuales como fallback (iOS Safari y navegadores sin soporte)
 *
 * Retorna:
 * - isOpen          {boolean}  → true cuando el modal de instrucciones debe mostrarse
 * - canNativeInstall {boolean} → true cuando el navegador soporta instalación nativa
 * - openModal       {function} → lógica inteligente: instala nativamente si es posible,
 *                                muestra el modal de instrucciones si no
 * - closeModal      {function} → cierra el modal y registra que el usuario ya lo vio
 *
 * Estrategia de instalación:
 *
 * 1. INSTALACIÓN NATIVA (Android/Chrome, PC/Edge):
 *    - El navegador dispara 'beforeinstallprompt' antes de mostrar su propio banner
 *    - El hook captura y guarda ese evento (deferredPrompt)
 *    - Al llamar openModal(), se invoca deferredPrompt.prompt() que muestra
 *      el diálogo nativo del navegador directamente
 *    - El usuario acepta o rechaza en ese diálogo nativo (sin modal propio)
 *
 * 2. MODAL DE INSTRUCCIONES (iOS Safari, Firefox, otros):
 *    - Si no hay deferredPrompt disponible, openModal() abre el modal
 *      con instrucciones paso a paso para la plataforma detectada
 *    - En el primer acceso, el modal aparece automáticamente tras 1500ms
 *
 * Comportamiento automático:
 * - Al montar, verifica 'pwa-install-seen' en localStorage
 * - Si NO existe Y el navegador no soporta instalación nativa → abre modal automáticamente
 *   (en Android/Chrome no es necesario porque el navegador ya muestra su propio banner)
 * - Si YA existe → no hace nada automáticamente
 *
 * Nota: el cleanup del useEffect cancela listeners y timers si el componente
 * se desmonta, evitando memory leaks.
 */
export function useInstallPWA() {
  const [isOpen, setIsOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null); // evento nativo capturado
  const [canNativeInstall, setCanNativeInstall] = useState(false); // true si hay prompt nativo

  useEffect(() => {
    // Escucha el evento del navegador que indica que la app es instalable
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault(); // evita que el navegador muestre su banner automático
      setDeferredPrompt(e); // guarda el evento para usarlo después
      setCanNativeInstall(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Escucha cuando la app ya fue instalada (limpia el estado)
    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setCanNativeInstall(false);
      localStorage.setItem('pwa-install-seen', 'true');
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    // Mostrar modal automáticamente en el primer acceso solo si no hay instalación nativa
    // (en Android/Chrome no es necesario porque el navegador ya gestiona su propio flujo)
    const alreadySeen = localStorage.getItem('pwa-install-seen');
    let timer;
    if (!alreadySeen && !canNativeInstall) {
      timer = setTimeout(() => setIsOpen(true), 1500);
    }

    // Cleanup: remueve listeners y cancela timer al desmontar
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      clearTimeout(timer);
    };
  }, []); // [] → se ejecuta solo una vez al montar el componente

  /**
   * openModal - Lógica inteligente de apertura:
   * - Si hay prompt nativo disponible → muestra diálogo nativo del navegador
   * - Si no → abre el modal con instrucciones manuales (fallback para iOS etc.)
   */
  const openModal = async () => {
    if (deferredPrompt) {
      // Instalación nativa: muestra el diálogo del navegador
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        // El usuario aceptó instalar — limpia el estado
        setDeferredPrompt(null);
        setCanNativeInstall(false);
        localStorage.setItem('pwa-install-seen', 'true');
      }
      // Si rechazó, deja el estado como está para poder intentar de nuevo
    } else {
      // Fallback: abre el modal con instrucciones manuales
      setIsOpen(true);
    }
  };

  const closeModal = () => {
    localStorage.setItem('pwa-install-seen', 'true'); // persiste que el usuario ya vio el modal
    setIsOpen(false);
  };

  return { isOpen, canNativeInstall, openModal, closeModal };
}
