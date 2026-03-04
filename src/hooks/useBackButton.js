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
 * Intercepta el botón "Atrás" del navegador/dispositivo con dos niveles:
 * - Primer atrás: ejecuta onFirstBack (ej: abrir sidebar). Si retorna true,
 *   considera el evento manejado y no muestra el modal de salida.
 * - Segundo atrás (o primero si onFirstBack retorna false): muestra el modal
 *   de confirmación de salida.
 *
 * Usa useRef para almacenar el callback onFirstBack en lugar de usarlo como
 * dependencia del useEffect. Esto permite que el listener de popstate se
 * registre una sola vez pero siempre lea el valor actualizado del callback,
 * evitando el problema de closures desactualizados.
 *
 * @param {Function} onFirstBack - Callback opcional para el primer "atrás".
 *   Debe retornar true si manejó el evento, false si no.
 */
const useBackButton = (onFirstBack) => {
  const [showModal, setShowModal] = useState(false);
  const historyCount = useRef(1);
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

    const handlePopState = (event) => {
      if (event.state && event.state.custom) {
        historyCount.current--;

        if (historyCount.current === 0) {
          // Reincorporar entrada al historial para seguir interceptando
          window.history.pushState({ id: Date.now(), custom: true }, "");
          historyCount.current = 1;

          // Usar la ref para leer siempre el valor actualizado de sidebarOpen
          // Si el callback maneja el evento, no mostrar el modal de salida
          if (onFirstBackRef.current && onFirstBackRef.current()) {
            // El callback abrió el sidebar: agregamos una entrada EXTRA
            // para que el próximo "atrás" también sea interceptado
            historyCount.current = 2;
            return;
          }

          // Si no fue manejado, mostrar modal de salida
          setShowModal(true);
        }
      } else {
        // Estado inesperado: restaurar y evaluar igual
        window.history.pushState({ id: Date.now(), custom: true }, "");
        historyCount.current = 1;

        if (onFirstBackRef.current && onFirstBackRef.current()) {
          window.history.pushState({ id: Date.now(), custom: true }, "");
          historyCount.current = 2;
          return;
        }

        setShowModal(true);
      }
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
    window.history.go(-historyCount.current);
    window.location.href = 'about:blank';
  };

  /**
   * Cancela el modal de salida y vuelve a la aplicación
   */
  const handleCancelExit = () => {
    setShowModal(false);
  };

  return {
    showModal, handleConfirmExit, handleCancelExit
  };
};

export default useBackButton;