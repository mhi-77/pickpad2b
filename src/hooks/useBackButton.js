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
 * 1. (botón atrás) + (sin usuario autenticado) → ignorar, no hacer nada
 * 2. (botón atrás) + (usuario autenticado) + (sidebar cerrado) → abrir sidebar
 * 3. (botón atrás) + (usuario autenticado) + (sidebar abierto) → mostrar modal
 *
 * Cubre dos contextos:
 * - Chrome desktop y Chrome Android: via evento popstate
 * - PWA instalada en Android: via Navigation API (window.navigation),
 *   ya que el botón "atrás" del sistema no siempre dispara popstate en PWAs
 *
 * El callback retorna tres valores posibles:
 * - 'ignore'    → no hay usuario autenticado, no hacer nada
 * - 'handled'   → sidebar estaba cerrado y se abrió, no mostrar modal
 * - 'showModal' → sidebar ya estaba abierto, mostrar modal de cierre de sesión
 *
 * @param {Function} onFirstBack - Callback que evalúa el estado actual y retorna
 *   'ignore', 'handled' o 'showModal'
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

      // Evaluar el estado actual via callback
      const result = onFirstBackRef.current ? onFirstBackRef.current() : 'showModal';

      // 'ignore'  → pantalla de login, no hacer nada
      // 'handled' → sidebar se abrió, no hacer nada
      if (result === 'ignore' || result === 'handled') {
        return;
      }

      // 'showModal' → sidebar ya estaba abierto, mostrar modal de cierre de sesión
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
   * Cancela el modal y vuelve a la aplicación sin hacer nada
   * También se llama desde App.jsx antes del logout para limpiar
   * el estado del modal antes de que React desmonte el Dashboard
   */
  const handleCancelExit = () => {
    setShowModal(false);
  };

  return {
    showModal,
    handleCancelExit
  };
};

export default useBackButton;