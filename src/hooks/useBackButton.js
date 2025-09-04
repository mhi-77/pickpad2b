/* En aplicaciones web de una sola página (SPA), el botón "Atrás" del navegador o del sistema operativo móvil navega hacia atrás en el historial. Si no hay una página anterior, puede cerrar la aplicación o pestaña.
Esto es especialmente problemático en móviles donde los usuarios frecuentemente usan el botón "Atrás" del sistema
La solución implica manipular el historial del navegador para evitar que el botón "Atrás" cierre la aplicación:
- Agregar una entrada al historial al cargar la aplicación
- Escuchar el evento popstate
- Mostrar una confirmación antes de salir
- Manejar adecuadamente la navegación

*/
import { useEffect } from 'react';

const useBackButtonHandler = (callback) => {
  useEffect(() => {
    window.history.pushState({ backButtonPressed: false, from: 'react-app' }, "");

    const handlePopState = (event) => {
      if (callback && typeof callback === 'function') {
        callback();
      } else {
        const confirmExit = window.confirm("¿Estás seguro de que quieres salir?");
        
        if (confirmExit) {
          window.history.back();
        } else {
          window.history.pushState({ backButtonPressed: true, from: 'react-app' }, "");
        }
      }
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [callback]);
};

export default useBackButtonHandler;