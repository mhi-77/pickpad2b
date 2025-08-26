import React, { useState, useCallback } from 'react';
import { Menu, LogOut } from 'lucide-react';
import Sidebar from './Sidebar';
import SearchForm from './SearchForm';
import SearchResults from './SearchResults';
import SessionWarningModal from './SessionWarningModal';
import { useAuth } from '../context/AuthContext';
import { useAutoLogout } from '../hooks/useAutoLogout';
import { supabase } from '../lib/supabase';

export default function Dashboard({ appVersion }) {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState('search');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  const [warningInterval, setWarningInterval] = useState(null);
  const handleWarningCallback = useCallback(() => {
    setShowWarning(true);
    // timeoutMinutes: 2, // Cambiado a 2 minutos para pruebas
    // warningMinutes: 1, // Advertencia 1 minuto antes
  }, []);
  // Auto logout después de 2 minutos de inactividad, advertencia a 1 minuto antes
  const { resetTimer, getRemainingTime, warningMinutes } = useAutoLogout({
    timeoutMinutes: 3, // Minutos de inactividad para auto logout
    warningMinutes: 1, // Advertencia 1 minuto antes del logout
      
      // Actualizar contador cada segundo
      // const interval = setInterval(() => {
      //   const newRemaining = getRemainingTime();
      //   const seconds = Math.floor(newRemaining / 1000);
      //   setWarningSeconds(seconds);
        
      //   if (seconds <= 0) {
      //     clearInterval(interval);
      //     setShowWarning(false);
      //     logout();
      //   }
      // }, 1000);
      
      // setWarningInterval(interval);
    onWarning: handleWarningCallback
  });

  const handleExtendSession = () => {
    setShowWarning(false);
    if (warningInterval) {
      clearInterval(warningInterval);
      setWarningInterval(null);
    }
    resetTimer();
  };

  const handleWarningLogout = () => {
    setShowWarning(false);
    if (warningInterval) {
      clearInterval(warningInterval);
      setWarningInterval(null);
    }
    logout();
  };

  const handleSearch = async (filters) => {
    setIsSearching(true);
    setHasSearched(true);
    
    try {
      let query = supabase.from('bd_padron').select('*');
      
      // Aplicar filtros con tipos correctos
      if (filters.documento) {
        // p_documento es bigint - convertir a número y búsqueda exacta
        const docNumber = parseInt(filters.documento);
        if (!isNaN(docNumber)) {
          query = query.eq('p_documento', docNumber);
        } else {
          // Si no es un número válido, buscar como texto
          query = query.ilike('p_documento', `%${filters.documento}%`);
        }
      }
      
      if (filters.apellido) {
        // APELLIDO es text - búsqueda parcial case-insensitive
        query = query.ilike('p_apellido', `%${filters.apellido}%`);
      }
      
      if (filters.nombre) {
        // NOMBRE es text - búsqueda parcial case-insensitive
        query = query.ilike('p_nombre', `%${filters.nombre}%`);
      }

      //! OJO ESTOS FILTROS QUE NO ESTAN MAS O HAY QUE VER BIENNNN
      if (filters.localidad) {
        // LOCALIDAD es text - búsqueda parcial case-insensitive
        query = query.ilike('LOCALIDAD', `%${filters.localidad}%`);
      }
      
      if (filters.circuito) {
        // CIRCUITO es text - búsqueda parcial case-insensitive
        query = query.ilike('CIRCUITO', `%${filters.circuito}%`);
      }
      //! ///////////////////////////////////////////////////////
      
      if (filters.mesa) {
        // MESA es bigint - búsqueda exacta
        const mesaNumber = parseInt(filters.mesa);
        if (!isNaN(mesaNumber)) {
          query = query.eq('mesa_nro', mesaNumber);
        }
      }
      
      if (filters.clase) {
        // CLASE es bigint - búsqueda exacta
        const claseNumber = parseInt(filters.clase);
        if (!isNaN(claseNumber)) {
          query = query.eq('p_clase', claseNumber);
        }
      }
      
      // Limitar resultados para mejor rendimiento
      query = query.limit(50);
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error searching padron:', error);
        setSearchResults([]);
      } else {
        setSearchResults(data || []);
      }
    } catch (error) {
      console.error('Error during search:', error);
      setSearchResults([]);
    }
    
    setIsSearching(false);
  };

  const renderContent = () => {
    switch (activeView) {
      case 'search':
        return (
          <div className="space-y-6">
            <SearchForm onSearch={handleSearch} isLoading={isSearching} />
            {hasSearched && (
              <SearchResults results={searchResults} isLoading={isSearching} />
            )}
          </div>
        );
      case 'fiscalizar':
        return (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Gestión del Fiscal</h2>
            <p className="text-gray-600">Funcionalidad de gestión en desarrollo.</p>
          </div>
        );
      case 'stats':
        return (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Estadísticas</h2>
            <p className="text-gray-600">Funcionalidad de estadística en desarrollo.</p>
          </div>
        );
      case 'gusers':
        return (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Gestión de Usuarios</h2>
            <p className="text-gray-600">Funcionalidad de gestión de usuarios en desarrollo.</p>
          </div>
        );
      case 'padrones':
        return (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Gestión de Padrones</h2>
            <p className="text-gray-600">Funcionalidad de gestión de padrones en desarrollo.</p>
          </div>
        );
      case 'settings':
        return (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Configuración</h2>
            <p className="text-gray-600">Panel de configuración del sistema.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        isOpen={sidebarOpen} 
        setIsOpen={setSidebarOpen}
        activeView={activeView}
        setActiveView={setActiveView}
        appVersion={appVersion}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-500 hover:text-gray-700 transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>
              <h1 className="text-xl font-semibold text-gray-900">
                {user?.name}
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={logout}
                className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:bg-red-50 hover:text-red-700 rounded-lg transition-all duration-200"
                title="Cerrar Sesión"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden sm:inline">Cerrar Sesión</span>
              </button>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-auto p-6">
          {renderContent()}
        </main>
      </div>
      
      <SessionWarningModal
        isOpen={showWarning}
        warningMinutes={warningMinutes}
        onExtendSession={handleExtendSession}
        onLogout={handleWarningLogout}
      />
    </div>
  );
}