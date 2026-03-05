import React, { useState, useCallback, useRef, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';
import useBackButton from './hooks/useBackButton';
import packageJson from '../package.json';
import { useInstallPWA } from './hooks/useInstallPWA';
import InstallPWAModal from './components/InstallPWAModal';

/**
 * Componente App - Raíz de la aplicación electoral
 *
 * Propósito: Componente principal que gestiona el flujo de autenticación
 * y la navegación entre las vistas de login y dashboard.
 *
 * Características:
 * - Envuelve la aplicación en AuthProvider para contexto global de autenticación
 * - Muestra LoginForm o Dashboard según estado de autenticación
 * - Implementa modal de confirmación de cierre de sesión
 * - Gestiona el comportamiento del botón "atrás" del navegador/dispositivo:
 *     · En login: ignora completamente el evento, permite salir de la app
 *     · Primer atrás en dashboard: abre el sidebar si está cerrado
 *     · Segundo atrás en dashboard: muestra modal de confirmación de cierre de sesión
 * - Agrega entrada al historial al autenticarse Y al primer gesto del usuario,
 *   usando un flag para que solo se ejecute una vez. Esto cubre dos casos:
 *     · Usuario que presiona "atrás" sin tocar la pantalla tras loguearse
 *     · Usuario que toca la pantalla antes de que Chrome habilite popstate
 * - Al hacer logout, limpia el historial acumulado durante la sesión para que
 *   el primer "atrás" en el login pueda salir de la app directamente
 * - Pasa la versión de la aplicación desde package.json
 * - Muestra modal de instalación PWA en el primer acceso y bajo demanda
 */

/**
 * Modal de confirmación de cierre de sesión
 * Se muestra cuando el usuario presiona "atrás" con el sidebar ya abierto.
 * Ofrece dos opciones: confirmar el logout o cancelar y volver a la app.
 */
function ExitConfirmationModal({ onConfirm, onCancel }) {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        maxWidth: '400px',
        width: '90%',
        textAlign: 'center'
      }}>
        <h2><strong>Cerrar Sesión</strong></h2>
        <p style={{ marginTop: '10px' }}>¿Confirmás que deseas cerrar sesión?</p>
        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
          {/* Botón cancelar: vuelve a la app sin hacer nada */}
          <button
            onClick={onCancel}
            aria-label="Cancelar y volver a la aplicación"
            style={{
              padding: '10px 20px',
              backgroundColor: '#6b7280',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              minHeight: '48px',
              minWidth: '48px'
            }}
          >
            Cancelar
          </button>
          {/* Botón confirmar: ejecuta el logout */}
          <button
            onClick={onConfirm}
            aria-label="Confirmar cierre de sesión"
            style={{
              padding: '10px 20px',
              backgroundColor: '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              minHeight: '48px',
              minWidth: '48px'
            }}
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Componente AppContent
 *
 * Propósito: Gestiona la lógica de renderizado condicional según autenticación
 * y coordina los modales de la app (cierre de sesión, instalación PWA).
 *
 * Props:
 * - appVersion {string} → versión de la app leída desde package.json
 */
function AppContent({ appVersion }) {
  const { user, logout } = useAuth();

  // Estado del sidebar compartido entre AppContent y Dashboard
  // Se maneja aquí para que useBackButton pueda abrirlo al presionar "atrás"
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Ref que espeja el estado del sidebar
  // Permite que handleFirstBack siempre lea el valor actual sin necesidad
  // de recrearse cuando sidebarOpen cambia, evitando closures desactualizados
  const sidebarOpenRef = useRef(sidebarOpen);
  useEffect(() => {
    sidebarOpenRef.current = sidebarOpen;
  }, [sidebarOpen]);

  // Flag para garantizar que el pushState al historial se ejecute
  // una sola vez por sesión, sin importar cuál de los dos disparadores
  // (autenticación o primer gesto) ocurra primero.
  // Se resetea al hacer logout para que la próxima sesión funcione igual.
  const historyPushedRef = useRef(false);

  /**
   * Disparador 1: agregar entrada al historial al autenticarse.
   * Cubre el caso donde el usuario presiona "atrás" inmediatamente
   * después de loguearse, sin tocar ninguna otra parte de la pantalla.
   */
  useEffect(() => {
    if (user && !historyPushedRef.current) {
      window.history.pushState({ id: Date.now(), custom: true }, "");
      historyPushedRef.current = true;
    }
  }, [user]);

  /**
   * Disparador 2: agregar entrada al historial al primer gesto del usuario.
   * Cubre el caso donde el usuario toca la pantalla antes de loguearse,
   * activando el manejo de popstate en Chrome Android. El flag evita que
   * se agregue una segunda entrada si el disparador 1 ya lo hizo.
   * Los listeners se remueven después del primer gesto, ya no hacen falta.
   */
  useEffect(() => {
    const handleFirstGesture = () => {
      if (user && !historyPushedRef.current) {
        window.history.pushState({ id: Date.now(), custom: true }, "");
        historyPushedRef.current = true;
      }
      document.removeEventListener('touchstart', handleFirstGesture);
      document.removeEventListener('mousedown', handleFirstGesture);
    };

    document.addEventListener('touchstart', handleFirstGesture);
    document.addEventListener('mousedown', handleFirstGesture);

    return () => {
      document.removeEventListener('touchstart', handleFirstGesture);
      document.removeEventListener('mousedown', handleFirstGesture);
    };
  }, [user]);

  /**
   * Limpieza al hacer logout:
   * - Resetea el flag de historial para que la próxima sesión funcione igual
   * - Cierra el sidebar y el modal por si quedaron abiertos
   * - Limpia todas las entradas que agregamos al historial durante la sesión
   *   (pushState inicial + aperturas del sidebar) para que en el login
   *   el primer "atrás" pueda salir de la app directamente sin consumir
   *   entradas acumuladas
   */
  useEffect(() => {
    if (!user) {
      historyPushedRef.current = false;
      setSidebarOpen(false);
      handleCancelExit();
      // Retroceder todas las entradas del historial acumuladas durante la sesión
      // window.history.length - 1 indica cuántas entradas hay por encima del origen
      if (window.history.length > 1) {
        window.history.go(-(window.history.length - 1));
      }
    }
  }, [user]);

  /**
   * Callback para el botón "atrás", retorna tres valores posibles:
   *
   * - 'ignore'    → no hay usuario autenticado (doble seguro, ya filtrado en el hook)
   * - 'handled'   → sidebar estaba cerrado, se abrió correctamente
   * - 'showModal' → sidebar ya estaba abierto, useBackButton mostrará el modal
   *
   * Usa una ref para leer sidebarOpen sin necesidad de recrear el callback,
   * evitando que onFirstBackRef en useBackButton se desincronice.
   */
  const handleFirstBack = useCallback(() => {
    if (!user) return 'ignore'; // doble seguro, el hook ya filtra por isAuthenticated

    if (!sidebarOpenRef.current) {
      setSidebarOpen(true);
      // Agregar entrada al historial para garantizar que el próximo
      // "atrás" sea interceptado por el listener de popstate
      window.history.pushState({ id: Date.now(), custom: true }, "");
      return 'handled'; // sidebar abierto, no mostrar modal
    }

    return 'showModal'; // sidebar ya abierto, mostrar modal de cierre de sesión
  }, [user]);

  // Pasar !!user como isAuthenticated para que el hook ignore eventos
  // de "atrás" cuando no hay usuario autenticado, incluso si el listener
  // sigue registrado (AppContent nunca se desmonta)
  const { showModal, handleCancelExit } = useBackButton(handleFirstBack, !!user);

  /**
   * Ejecuta el logout cuando el usuario confirma en el modal.
   * Cierra el modal primero para evitar que quede visible durante
   * la transición al login.
   * En PWA y Chrome Android no es posible cerrar la ventana programáticamente,
   * por lo que el comportamiento correcto es cerrar sesión y volver al login.
   */
  const handleConfirmExit = () => {
    handleCancelExit(); // cerrar modal antes del logout
    logout();
  };

  // Desestructura el hook renombrando para evitar colisión con otros estados:
  // - installOpen  → controla si el modal de instalación está visible
  // - openInstall  → función para abrirlo manualmente (se pasa al LoginForm)
  // - closeInstall → función para cerrarlo (la usa el propio modal al confirmar/cancelar)
  const {
    isOpen: installOpen,
    openModal: openInstall,
    closeModal: closeInstall,
    canNativeInstall
  } = useInstallPWA();

  return (
    // Punto de referencia principal para accesibilidad (lectores de pantalla)
    <main>
      {user
        // Si está autenticado muestra el Dashboard, pasándole el estado
        // del sidebar para que useBackButton pueda controlarlo
        ? <Dashboard
            appVersion={appVersion}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />
        // Si no está autenticado muestra el Login y le pasa openInstall
        // para que pueda abrir el modal desde el botón "Instalá PickPad"
        : <LoginForm
            appVersion={appVersion}
            onInstallClick={openInstall}
            canNativeInstall={canNativeInstall}
          />
      }

      {/* Modal de confirmación de cierre de sesión
          Se activa cuando el usuario presiona "atrás" con el sidebar abierto */}
      {showModal && (
        <ExitConfirmationModal
          onConfirm={handleConfirmExit}
          onCancel={handleCancelExit}
        />
      )}

      {/* Modal de instrucciones de instalación PWA
          - Se activa automáticamente en el primer acceso (via useInstallPWA)
          - Se activa manualmente cuando el usuario toca el botón en LoginForm */}
      <InstallPWAModal isOpen={installOpen} onClose={closeInstall} />
    </main>
  );
}

function App() {
  return (
    <AuthProvider>
      <div className="font-sans antialiased">
        <AppContent appVersion={packageJson.version} />
      </div>
    </AuthProvider>
  );
}

export default App;