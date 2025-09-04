import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';
import useBackButton from './hooks/useBackButton'; // Importa el hook personalizado
import packageJson from '../package.json';

function AppContent({ appVersion }) {
  const { user } = useAuth();
  
  // Usa el hook personalizado para manejar el botón Atrás
  useBackButton(() => {
    // Lógica personalizada al presionar el botón Atrás
    const confirmExit = window.confirm("¿Estás seguro de que quieres salir?");
    return !confirmExit; // Prevenir el comportamiento por defecto si el usuario cancela
  });
  
  return user ? <Dashboard appVersion={appVersion} /> : <LoginForm appVersion={appVersion} />;
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