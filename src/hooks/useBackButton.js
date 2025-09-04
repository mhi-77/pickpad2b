/* En aplicaciones web de una sola página (SPA), el botón "Atrás" del navegador o del sistema operativo móvil navega hacia atrás en el historial. Si no hay una página anterior, puede cerrar la aplicación o pestaña.
Esto es especialmente problemático en móviles donde los usuarios frecuentemente usan el botón "Atrás" del sistema
La solución implica manipular el historial del navegador para evitar que el botón "Atrás" cierre la aplicación:
- Agregar una entrada al historial al cargar la aplicación
- Escuchar el evento popstate
- Mostrar una confirmación antes de salir
- Manejar adecuadamente la navegación
*/

// hooks/useBackButton.js
import { useState, useEffect, useRef } from 'react';

const useBackButton = (customHandler) => {
  const [showModal, setShowModal] = useState(false);
  const historyCount = useRef(1);

  useEffect(() => {
    // Agregar estado inicial al historial
    window.history.pushState({ id: 1, custom: true }, "");

    const handlePopState = (event) => {
      if (customHandler && typeof customHandler === 'function') {
        const shouldPreventDefault = customHandler();
        if (shouldPreventDefault === false) {
          window.history.pushState({ id: Date.now(), custom: true }, "");
          historyCount.current++;
        }
      } else {
        // Comportamiento por defecto
        if (event.state && event.state.custom) {
          historyCount.current--;
          
          if (historyCount.current === 0) {
            setShowModal(true);
            window.history.pushState({ id: Date.now(), custom: true }, "");
            historyCount.current = 1;
          }
        } else {
          setShowModal(true);
          window.history.pushState({ id: Date.now(), custom: true }, "");
          historyCount.current = 1;
        }
      }
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [customHandler]);

  const handleConfirmExit = () => {
    window.history.go(-historyCount.current);
    window.location.href = 'about:blank';
  };

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