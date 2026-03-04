/* En aplicaciones web de una sola página (SPA), el botón "Atrás" del navegador o del sistema operativo móvil navega hacia atrás en el historial. Si no hay una página anterior, puede cerrar la aplicación o pestaña.
Esto es especialmente problemático en móviles donde los usuarios frecuentemente usan el botón "Atrás" del sistema.
La solución implica manipular el historial del navegador para evitar que el botón "Atrás" cierre la aplicación:
- Agregar una entrada al historial al cargar la aplicación
- Escuchar el evento popstate
- Mostrar una confirmación antes de salir
- Manejar adecuadamente la navegación

Contextos cubiertos:
- Chrome desktop: usa popstate normalmente
- Chrome Android (navegador): usa popstate pero con comportamiento distinto
- PWA instalada en Android: el botón "atrás" del sistema puede no disparar popstate,
  por lo que se usa adicionalmente la Navigation API cuando está disponible
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
 * Cubre dos contextos:
 * - Chrome desktop y Chrome Android: via evento popstate
 * - PWA instalada en Android: via Navigation API (window.navigation),
 *   ya que el botón "atrás" del sistema no siempre dispara popstate en PWAs
 *
 * El estado del sidebar se lee desde una ref para evitar closures desactualizados,
 * ya que el listener se registra una sola vez.
 *
 * @param {Function} onFirstBack - Callback que evalúa el estado del sidebar:
 *   - Retorna true si el sidebar estaba cerrado y lo abrió (evento manejado)
 *   - Retorna false si el sidebar ya estaba abierto (proceder con modal de salida)
 */
const useBackButton = (onFirstBack) => {
  const [showModal, setShowModal] = useState(false);

  // Ref para mantener siempre la versión actualizada del callback
  // sin necesidad de re-registrar los listeners
  const onFirstBackRef = useRef(onFirstBack);

  // Sincronizar la ref cada vez que el callback cambia
  useEffect(() => {
    onFirstBackRef.current = onFirstBack;
  }, [onFirstBack]);

  useEffect(() => {
    // Agregar estado inicial al historial para poder interceptar el primer "atrás"
    window.history.pushState({ id: 1, custom: true }, "");

    /**
     * Lógica central de interceptación del botón "atrás"
     * Compartida entre popstate y Navigation API para evitar duplicación
     */
    const handleBack = () => {
      // Reincorporar una entrada al historial para seguir interceptando
      // futuros eventos de "atrás"
      window.history.pushState({ id: Date.now(), custom: true }, "");

      // Si el callback maneja el evento (sidebar estaba cerrado y se abrió),
      // no hacer nada más. El próximo "atrás" volverá a pasar por aquí
      // y como sidebarOpen será true, retornará false y mostrará el modal.
      if (onFirstBackRef.current && onFirstBackRef.current()) {
        return;
      }

      // Sidebar ya estaba abierto: mostrar modal de confirmación de salida
      setShowModal(true);
    };

    // Listener para Chrome desktop y Chrome Android en modo navegador
    window.addEventListener('popstate', handleBack);

    // Listener adicional para PWA instalada en Android
    // La Navigation API intercepta la navegación antes de que ocurra,
    // permitiendo cancelarla con event.preventDefault() y manejarla manualmente
    if (window.navigation) {
      const handleNavigate = (event) => {
        // Solo interceptar navegaciones hacia atrás (traverse hacia índice menor)
        if (
          event.navigationType === 'traverse' &&
          event.destination.index < window.navigation.currentEntry.index
        ) {
          // Cancelar la navegación nativa del sistema
          event.preventDefault();
          // Delegar a la misma lógica central
          handleBack();
        }
      };

      window.navigation.addEventListener('navigate', handleNavigate);

      // Cleanup: remover ambos listeners al desmontar
      return () => {
        window.removeEventListener('popstate', handleBack);
        window.navigation.removeEventListener('navigate', handleNavigate);
      };
    }

    // Cleanup: solo popstate si Navigation API no está disponible
    return () => {
      window.removeEventListener('popstate', handleBack);
    };
  }, []); // Sin dependencias intencional: la ref garantiza valores actualizados

  /**
   * Confirma la salida: navega hacia atrás en el historial y redirige
   * a una página en blanco para cerrar la sesión y salir de la app
   */
  const handleConfirmExit = () => {
    //window.history.go(-1);
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