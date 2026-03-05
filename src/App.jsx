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
 * - Agrega entrada al historial solo después del primer gesto del usuario
 *   y solo si está autenticado, para evitar que Chrome Android consuma
 *   entradas silenciosamente antes de que el usuario interactúe
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

  // Ref para saber si ya se agregó la entrada al historial tras el primer gesto.
  // Se resetea cuando el usuario hace logout para que al volver a loguearse
  // se agregue una nueva entrada al primer gesto.
  const historyPushedRef = useRef(false);

  // Registrar listener para el primer gesto del usuario (touch o click).
  // Chrome Android solo habilita el manejo de popstate después de un gesto,
  // por lo que el pushState debe hacerse en ese momento y no antes.
  // Solo se agrega la entrada si el usuario está autenticado, para no
  // interferir con la navegación nativa en la pantalla de login.
  useEffect(() => {
    const handleFirstGesture = () => {
      // Solo agregar entrada si hay usuario autenticado y no se agregó antes
      if (user && !historyPushedRef.current) {
        window.history.pushState({ id: Date.now(), custom: true }, "");
        historyPushedRef.current = true;
      }
      // Remover listeners después del primer gesto, ya no hacen falta
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

  // Resetear el flag de historial cuando el usuario cierra sesión,
  // para que al volver a loguearse se agregue una nueva entrada al historial
  useEffect(() => {
    if (!user) {
      historyPushedRef.current = false;
      setSidebarOpen(false);
      handleCancelExit();
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