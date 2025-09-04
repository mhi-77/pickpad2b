import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';
import useBackButton from './hooks/useBackButton'; // Importa el hook corregido
import packageJson from '../package.json';

// Componente para mostrar el modal de confirmación
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
            style={{
                  padding: '10px 20px',
                  backgroundColor: '#0066ff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
          >
            Cancelar
          </button>
          
        </div>
      </div>
    </div>
  );
}

function AppContent({ appVersion }) {
  const { user } = useAuth();
  
  // Usa el hook corregido
  const { showModal, handleConfirmExit, handleCancelExit } = useBackButton();
  
  return (
    <>
      {user ? <Dashboard appVersion={appVersion} /> : <LoginForm appVersion={appVersion} />}
      
      {/* Modal de confirmación para salir */}
      {showModal && (
        <ExitConfirmationModal 
          onConfirm={handleConfirmExit} 
          onCancel={handleCancelExit} 
        />
      )}
    </>
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