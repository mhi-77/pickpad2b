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

Nota importante sobre el ciclo de vida:
- El hook vive en AppContent que nunca se desmonta, por lo que el listener
  siempre está activo. El parámetro isAuthenticated controla si el listener
  debe actuar o ignorar el evento, evitando que funcione en la pantalla de login.

Nota importante sobre la Navigation API:
- El chequeo de autenticación debe hacerse ANTES de llamar a event.preventDefault()
  en el handler de Navigation API. Si se previene la navegación y luego se ignora
  el evento, el navegador queda bloqueado y no puede salir de la app en el login.
*/

import { useState, useEffect, useRef } from 'react';

/**
 * Hook useBackButton
 *
 * Intercepta el botón "Atrás" del navegador/dispositivo con lógica de dos niveles:
 *
 * 1. (botón atrás) + (sin usuario autenticado) → ignorar completamente,
 *    dejar que el navegador maneje la navegación normalmente
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
 * @param {boolean} isAuthenticated - Indica si hay un usuario autenticado.
 *   Cuando es false, el listener ignora todos los eventos de "atrás" y deja
 *   que el navegador los maneje normalmente (permite salir de la app en login).
 */
const useBackButton = (onFirstBack, isAuthenticated) => {
  const [showModal, setShowModal] = useState(false);

  // Ref para mantener siempre la versión actualizada del callback
  // sin necesidad de re-registrar los listeners
  const onFirstBackRef = useRef(onFirstBack);

  // Ref para mantener siempre el estado actualizado de autenticación
  // sin necesidad de re-registrar los listeners
  const isAuthenticatedRef = useRef(isAuthenticated);

  // Sincronizar la ref del callback cada vez que cambia
  useEffect(() => {
    onFirstBackRef.current = onFirstBack;
  }, [onFirstBack]);

  // Sincronizar la ref de autenticación cada vez que cambia.
  // Cuando el usuario hace logout, isAuthenticatedRef pasa a false
  // y el listener deja de actuar aunque siga registrado
  useEffect(() => {
    isAuthenticatedRef.current = isAuthenticated;
  }, [isAuthenticated]);

  useEffect(() => {
    // Agregar estado inicial al historial para poder interceptar el primer "atrás"
    window.history.pushState({ id: 1, custom: true }, "");

    /**
     * Lógica central de interceptación del botón "atrás"
     * Compartida entre popstate y Navigation API para evitar duplicación.
     * Solo se llama cuando ya se confirmó que hay usuario autenticado.
     */
    const handleBack = () => {
      // Reincorporar una entrada al historial para seguir interceptando
      // futuros eventos de "atrás"
      window.history.pushState({ id: Date.now(), custom: true }, "");

      // Evaluar el estado actual via callback
      const result = onFirstBackRef.current ? onFirstBackRef.current() : 'showModal';

      // 'ignore'  → doble seguro, no hacer nada
      // 'handled' → sidebar se abrió, no hacer nada
      if (result === 'ignore' || result === 'handled') {
        return;
      }

      // 'showModal' → sidebar ya estaba abierto, mostrar modal de cierre de sesión
      setShowModal(true);
    };

    // Listener para Chrome desktop y Chrome Android en modo navegador.
    // Si no hay usuario autenticado, ignorar sin manipular el historial
    // para que el navegador pueda salir de la app normalmente.
    const handlePopState = () => {
      if (!isAuthenticatedRef.current) {
        return;
      }
      handleBack();
    };

    window.addEventListener('popstate', handlePopState);

    // Listener adicional para PWA instalada en Android.
    // La Navigation API intercepta la navegación antes de que ocurra.
    // CRÍTICO: verificar autenticación ANTES de llamar a event.preventDefault(),
    // ya que si se previene la navegación sin manejarla, el navegador queda
    // bloqueado y no puede salir de la app desde el login.
    if (window.navigation) {
      const handleNavigate = (event) => {
        // Solo interceptar navegaciones hacia atrás (traverse hacia índice menor)
        if (
          event.navigationType === 'traverse' &&
          event.destination.index < window.navigation.currentEntry.index
        ) {
          // Verificar autenticación ANTES de prevenir la navegación nativa.
          // Si no hay usuario, dejar que el navegador maneje el "atrás" normalmente.
          if (!isAuthenticatedRef.current) {
            return;
          }

          // Cancelar la navegación nativa del sistema solo si hay usuario autenticado
          event.preventDefault();
          // Delegar a la misma lógica central
          handleBack();
        }
      };

      window.navigation.addEventListener('navigate', handleNavigate);

      // Cleanup: remover ambos listeners al desmontar
      return () => {
        window.removeEventListener('popstate', handlePopState);
        window.navigation.removeEventListener('navigate', handleNavigate);
      };
    }

    // Cleanup: solo popstate si Navigation API no está disponible
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []); // Sin dependencias intencional: las refs garantizan valores actualizados

  /**
   * Cancela el modal y vuelve a la aplicación sin hacer nada.
   * También se llama desde App.jsx antes del logout para limpiar
   * el estado del modal antes de que React desmonte el Dashboard.
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