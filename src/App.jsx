import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';
import packageJson from '../package.json';

function AppContent({ appVersion }) {
  const { user } = useAuth();
  
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