import { useState, useEffect } from 'react';

/**
 * Hook useInstallPWA
 *
 * Propósito: Gestiona el estado de visibilidad del modal de instalación PWA,
 * combinando dos comportamientos: aparición automática en el primer acceso
 * y apertura manual desde cualquier parte de la app.
 *
 * Retorna:
 * - isOpen     {boolean}  → true cuando el modal debe mostrarse
 * - openModal  {function} → abre el modal manualmente (ej: desde un botón)
 * - closeModal {function} → cierra el modal y registra que el usuario ya lo vio
 *
 * Comportamiento automático:
 * - Al montar, verifica si existe la clave 'pwa-install-seen' en localStorage
 * - Si NO existe (primer acceso), programa la apertura del modal con un delay
 *   de 1500ms para que la UI termine de renderizar antes de mostrarlo
 * - Si YA existe (accesos posteriores), no hace nada automáticamente
 *
 * Comportamiento manual:
 * - openModal() abre el modal en cualquier momento, independientemente
 *   de si el usuario ya lo vio antes (útil para botón "Instalar app")
 * - closeModal() cierra el modal Y persiste 'pwa-install-seen' en localStorage
 *   para que no vuelva a aparecer automáticamente en futuros accesos
 *
 * Nota: el cleanup del useEffect cancela el timer si el componente
 * se desmonta antes de que transcurran los 1500ms, evitando memory leaks.
 */
export function useInstallPWA() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const alreadySeen = localStorage.getItem('pwa-install-seen');
    if (!alreadySeen) {
      // Pequeño delay para que no aparezca antes de que cargue la UI
      const timer = setTimeout(() => setIsOpen(true), 1500);
      return () => clearTimeout(timer); // cleanup: cancela el timer si el componente se desmonta
    }
  }, []); // [] → se ejecuta solo una vez al montar el componente

  const openModal = () => setIsOpen(true);

  const closeModal = () => {
    localStorage.setItem('pwa-install-seen', 'true'); // persiste que el usuario ya vio el modal
    setIsOpen(false);
  };

  return { isOpen, openModal, closeModal };
}
