/* En aplicaciones web de una sola página (SPA), el botón "Atrás" del navegador o del sistema operativo móvil navega hacia atrás en el historial. Si no hay una página anterior, puede cerrar la aplicación o pestaña.
Esto es especialmente problemático en móviles donde los usuarios frecuentemente usan el botón "Atrás" del sistema
La solución implica manipular el historial del navegador para evitar que el botón "Atrás" cierre la aplicación:
- Agregar una entrada al historial al cargar la aplicación
- Escuchar el evento popstate
- Mostrar una confirmación antes de salir
- Manejar adecuadamente la navegación

*/

import { useState, useEffect, useRef } from 'react';

/**
 * Hook useBackButton
 *
 * Intercepta el botón "Atrás" del navegador/dispositivo con lógica de dos niveles:
 *
 * 1. (botón atrás) + (sidebar cerrado) → abre el sidebar, no muestra modal
 * 2. (botón atrás) + (sidebar abierto) → muestra modal de confirmación de salida
 *
 * El estado del sidebar se lee desde una ref para evitar closures desactualizados,
 * ya que el listener de popstate se registra una sola vez.
 *
 * @param {Function} onFirstBack - Callback que evalúa el estado del sidebar:
 *   - Retorna true si el sidebar estaba cerrado y lo abrió (evento manejado)
 *   - Retorna false si el sidebar ya estaba abierto (proceder con modal de salida)
 */
const useBackButton = (onFirstBack) => {
  const [showModal, setShowModal] = useState(false);

  // Ref para mantener siempre la versión actualizada del callback
  // sin necesidad de re-registrar el listener de popstate
  const onFirstBackRef = useRef(onFirstBack);

  // Sincronizar la ref cada vez que el callback cambia
  useEffect(() => {
    onFirstBackRef.current = onFirstBack;
  }, [onFirstBack]);

  useEffect(() => {
    // Agregar estado inicial al historial para poder interceptar el primer "atrás"
    window.history.pushState({ id: 1, custom: true }, "");

    const handlePopState = () => {
      // Siempre reincorporar una entrada al historial para seguir interceptando
      // futuros eventos de "atrás"
          // Diferir el pushState para que Chrome Android lo registre
          // como una entrada real, fuera del contexto del evento popstate
          setTimeout(() => {
          window.history.pushState({ id: Date.now(), custom: true }, "");
      }, 0);

      // Si el callback maneja el evento (sidebar estaba cerrado y se abrió),
      // no hacer nada más. El próximo "atrás" volverá a pasar por aquí
      // y como sidebarOpen ya será true, retornará false y mostrará el modal.
      if (onFirstBackRef.current && onFirstBackRef.current()) {
        return;
      }

      // Sidebar ya estaba abierto: mostrar modal de confirmación de salida
      setShowModal(true);
    };

    // Registrar el listener una sola vez (sin dependencias)
    // La ref garantiza que siempre se use el callback más reciente
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []); // Sin dependencias intencional: ver comentario arriba

  /**
   * Confirma la salida: navega hacia atrás en el historial y redirige
   * a una página en blanco para cerrar la sesión y salir de la app
   */
  const handleConfirmExit = () => {
    window.history.go(-1);
    window.location.href = 'about:blank';
  };

  /**
   * Cancela el modal de salida y vuelve a la aplicación
   */
  const handleCancelExit = () => {
    setShowModal(false);
  };

  return {
    showModal,
    handleConfirmExit,
    handleCancelExit
  };
};

export default useBackButton;