import React from 'react';
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
 * - Implementa modal de confirmación para salida de la aplicación
 * - Gestiona el comportamiento del botón "atrás" del navegador/dispositivo
 * - Pasa la versión de la aplicación desde package.json
 * - Muestra modal de instalación PWA en el primer acceso y bajo demanda
 */

/**
 * Modal de confirmación para salir de la aplicación
 * Se muestra cuando el usuario intenta retroceder desde la vista principal
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
        <h2><strong>SALIR DE LA APLICACIÓN</strong></h2>
        <p>Vuelva a presionar ATRAS para cerrar sesión y salir</p>
        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
          <button
            onClick={onCancel}
            aria-label="Cancelar y volver a la aplicación"
            style={{
              padding: '10px 20px',
              backgroundColor: '#0066ff',
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
        </div>
      </div>
    </div>
  );
}

/**
 * Componente AppContent
 *
 * Propósito: Gestiona la lógica de renderizado condicional según autenticación
 * y coordina los tres modales de la app (salida, instalación PWA).
 *
 * Props:
 * - appVersion {string} → versión de la app leída desde package.json
 */
function AppContent({ appVersion }) {
  const { user } = useAuth();
  const { showModal, handleConfirmExit, handleCancelExit } = useBackButton();

  // Desestructura el hook renombrando para evitar colisión con otros estados:
  // - installOpen  → controla si el modal de instalación está visible
  // - openInstall  → función para abrirlo manualmente (se pasa al LoginForm)
  // - closeInstall → función para cerrarlo (la usa el propio modal al confirmar/cancelar)
  const { isOpen: installOpen, openModal: openInstall, closeModal: closeInstall } = useInstallPWA();

  return (
    // Punto de referencia principal para accesibilidad (lectores de pantalla)
    <main>
      {user
        // Si está autenticado muestra el Dashboard
        ? <Dashboard appVersion={appVersion} />
        // Si no está autenticado muestra el Login y le pasa openInstall
        // para que pueda abrir el modal desde el botón "Instalá PickPad"
        : <LoginForm appVersion={appVersion} onInstallClick={openInstall} />
      }

      {/* Modal de confirmación de salida (botón atrás del dispositivo) */}
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
