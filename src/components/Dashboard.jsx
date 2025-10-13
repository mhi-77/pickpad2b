import React, { useState, useCallback, useEffect } from 'react';
import { Menu, LogOut } from 'lucide-react';
import Sidebar from './Sidebar';
import SearchForm from './SearchForm';
import SearchResults from './SearchResults';
import SessionWarningModal from './SessionWarningModal';
import FiscalizarView from './FiscalizarView';
import StatsView from './StatsView';
import GusersView from './GusersView';
import { useAuth } from '../context/AuthContext';
import { useAutoLogout } from '../hooks/useAutoLogout';
import { supabase } from '../lib/supabase';
import { FEATURES } from '../config/features';
import GpicksView from './GpicksView';
import TestigoView from './TestigoView';
import PadronesView from './PadronesView';
import SettingsView from './SettingsView';
import { loadEmopicksWithCount } from '../utils/emopicksUtils';

/**
 * Componente Dashboard - Panel principal de la aplicación
 * 
 * Propósito: Actúa como el contenedor principal de la aplicación una vez que el usuario
 * está autenticado. Maneja la navegación entre diferentes vistas, el auto-logout por
 * inactividad y la búsqueda en el padrón electoral.
 * 
 * Props:
 * - appVersion: string - Versión de la aplicación
 */
export default function Dashboard({ appVersion }) {
  // Obtener datos del usuario y función de logout del contexto de autenticación
  const { user, logout } = useAuth();
  
  // Estados locales para el manejo de la UI
  const [sidebarOpen, setSidebarOpen] = useState(false);

  /**
   * Obtiene las iniciales del tipo de usuario
   * Si hay dos o más palabras, toma la primera letra de las dos primeras
   * Si hay una sola palabra, toma solo la primera letra
   */
  const getUserInitials = (roleDescription) => {
    if (!roleDescription) return '';
    
    const words = roleDescription.trim().split(/\s+/);
    
    if (words.length >= 2) {
      return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
    } else {
      return words[0].charAt(0).toUpperCase();
    }
  };

  // Estado para controlar qué vista está activa (search, fiscalizar, stats, etc.)
  const [activeView, setActiveView] = useState('search');

  // Efecto para prevenir navegación a vistas deshabilitadas
  useEffect(() => {
    if (activeView === 'testigo' && !FEATURES.MESA_TESTIGO_ENABLED) {
      // Si el usuario intenta acceder a testigo y está deshabilitado, redirigir a search
      setActiveView('search');
    }
  }, [activeView]);
  // Estado para almacenar los resultados de búsqueda en el padrón
  const [searchResults, setSearchResults] = useState([]);
  // Estado para indicar si se está realizando una búsqueda
  const [isSearching, setIsSearching] = useState(false);
  // Estado para saber si ya se realizó al menos una búsqueda
  const [hasSearched, setHasSearched] = useState(false);
  // Estado para controlar la visibilidad del modal de advertencia de sesión
  const [showWarning, setShowWarning] = useState(false);

  // Estado para almacenar las localidades disponibles
  const [availableLocalities, setAvailableLocalities] = useState([]);
  // Estado para almacenar los emopicks disponibles
  const [availableEmopicks, setAvailableEmopicks] = useState([]);

  // Estado para manejar el intervalo de advertencia de sesión
  const [warningInterval, setWarningInterval] = useState(null);
  
  /**
   * Callback para manejar la advertencia de sesión por inactividad
   * Se ejecuta cuando el usuario ha estado inactivo por un tiempo determinado
   */
  const handleWarningCallback = useCallback(() => {
    setShowWarning(true);
  }, []);
  
  /**
   * Carga las localidades disponibles desde la base de datos
   * Idem con los emojis de la tabla emopics
   * Se ejecuta una vez al montar el componente para poblar el dropdown
   */
  useEffect(() => {
    fetchLocalities();
    fetchEmopicks();
  }, []);

  /**
   * Obtiene la lista de localidades únicas desde la tabla circuitos
   */
  const fetchLocalities = async () => {
    try {
      const { data, error } = await supabase
        .from('circuitos')
        .select('localidad')
        .not('localidad', 'is', null)
        .order('localidad');

      if (error) {
        console.error('Error fetching localities:', error);
        return;
      }

      // Extraer localidades únicas
      const uniqueLocalities = [...new Set(data.map(item => item.localidad))];
      setAvailableLocalities(uniqueLocalities);
    } catch (error) {
      console.error('Error loading localities:', error);
    }
  };

  /**
   * Obtiene la lista de emopicks disponibles desde la base de datos
   */
  const fetchEmopicks = async () => {
    try {
      const data = await loadEmopicksWithCount();
      setAvailableEmopicks(data || []);
    } catch (error) {
      console.error('Error loading emopicks:', error);
    }
  };

  /**
   * Hook personalizado para manejar el auto-logout por inactividad
   * Configuración:
   * - 15 minutos de inactividad total antes del logout
   * - Advertencia 1 minutos antes del logout
   */
  const { resetTimer, getRemainingTime, warningMinutes } = useAutoLogout({
    timeoutMinutes: 15,
    warningMinutes: 1,
    onWarning: handleWarningCallback
  });

  /**
   * Maneja la extensión de la sesión cuando el usuario responde a la advertencia
   * Oculta el modal de advertencia y reinicia el timer de inactividad
   */
  const handleExtendSession = () => {
    setShowWarning(false);
    if (warningInterval) {
      clearInterval(warningInterval);
      setWarningInterval(null);
    }
    resetTimer();
  };

  /**
   * Maneja el logout desde el modal de advertencia
   * Limpia los intervalos y ejecuta el logout
   */
  const handleWarningLogout = () => {
    setShowWarning(false);
    if (warningInterval) {
      clearInterval(warningInterval);
      setWarningInterval(null);
    }
    logout();
  };

  /**
   * Maneja la búsqueda en el padrón electoral
   * 
   * Flujo:
   * 1. Activa el estado de carga
   * 2. Construye la consulta a Supabase basada en los filtros
   * 3. Aplica filtros específicos según el tipo de dato
   * 4. Limita los resultados a 50 para mejor rendimiento
   * 5. Actualiza el estado con los resultados
   * 
   * @param {Object} filters - Objeto con los filtros de búsqueda
   */
  const handleSearch = async (filters) => {
    setIsSearching(true);
    setHasSearched(true);
    
    try {
      // Inicializar consulta base a la tabla padron
      let query = supabase.from('padron').select(`
        *,
        emopicks(
          id,
          display
        ),
        mesas!inner(
          numero,
          establecimientos!inner(
            id,
            nombre,
            circuitos!inner(
              codigo,
              localidad
            )
          )
        )
      `);
      
      // Aplicar filtros específicos según los datos proporcionados
      if (filters.documento) {
        // El documento es bigint - intentar conversión a número para búsqueda exacta
        const docNumber = parseInt(filters.documento);
        if (!isNaN(docNumber)) {
          query = query.eq('documento', docNumber);
        } else {
          // Si no es un número válido, realizar búsqueda parcial como texto
          query = query.ilike('documento', `%${filters.documento}%`);
        }
      }
      
      if (filters.apellido) {
        // Apellido es texto - búsqueda parcial insensible a mayúsculas/minúsculas
        query = query.ilike('apellido', `%${filters.apellido}%`);
      }
      
      if (filters.nombre) {
        // Nombre es texto - búsqueda parcial insensible a mayúsculas/minúsculas
        query = query.ilike('nombre', `%${filters.nombre}%`);
      }

      if (filters.localidad) {
        query = query.ilike('mesas.establecimientos.circuitos.localidad', `%${filters.localidad}%`);
      }
      
      if (filters.circuito) {
        query = query.ilike('mesas.establecimientos.circuitos.codigo', `%${filters.circuito}%`);
      }
      
      if (filters.mesa_numero) {
        // Mesa es bigint - búsqueda exacta por número
        const mesaNumber = parseInt(filters.mesa_numero);
        if (!isNaN(mesaNumber)) {
          query = query.eq('mesa_numero', mesaNumber);
        }
      }
      
      if (filters.clase) {
        // Clase (año de nacimiento) es entero - búsqueda exacta
        const claseNumber = parseInt(filters.clase);
        if (!isNaN(claseNumber)) {
          query = query.eq('clase', claseNumber);
        }
      }
      
      // Limitar resultados a 50 para optimizar rendimiento y UX
     // query = query.order('apellido', { ascending: true }).order('nombre', { ascending: true }).limit(50);
      query = query.order('orden', { ascending: true }).limit(50);
      
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

  /**
   * Renderiza el contenido principal basado en la vista activa
   * Utiliza un switch para determinar qué componente mostrar
   */
  const renderContent = () => {
    switch (activeView) {
      case 'search':
        return (
          <div className="space-y-10">
            <SearchForm 
              onSearch={handleSearch} 
              isLoading={isSearching}
              availableLocalities={availableLocalities}
            />
            {hasSearched && (
              <SearchResults 
                results={searchResults} 
                isLoading={isSearching} 
                userRole={user?.usuario_tipo}
                availableEmopicks={availableEmopicks}
              />
            )}
          </div>
        );
      case 'fiscalizar':
        return (
          <FiscalizarView />
        );
      case 'stats':
        return (
          <StatsView />
        );
      case 'gpicks':
        return (
          <GpicksView />
        );
      case 'testigo':
        return (
          <TestigoView />
        );
      case 'gusers':
        return (
          <GusersView />
        );
      case 'padrones':
        return (
          <PadronesView />
        );
      case 'settings':
        return (
          <SettingsView />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar de navegación */}
      <Sidebar 
        isOpen={sidebarOpen} 
        setIsOpen={setSidebarOpen}
        activeView={activeView}
        setActiveView={setActiveView}
        appVersion={appVersion}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header principal con botón de menú móvil y botón de logout */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Botón de menú para dispositivos móviles */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-500 hover:text-gray-700 transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>
              {/* Círculo con inicial del tipo de usuario y nombre */}
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-lg">
                    {getUserInitials(user?.roleDescription)}
                  </span>
                </div>
                <h1 className="text-xm font-semibold text-gray-900">
                  {user?.name}
                </h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Botón de cerrar sesión */}
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

        {/* Contenido principal que cambia según la vista activa */}
        <main className="flex-1 overflow-auto p-4">
          {renderContent()}
        </main>
      </div>
      
      {/* Modal de advertencia de sesión por inactividad */}
      <SessionWarningModal
        isOpen={showWarning}
        warningMinutes={warningMinutes}
        onExtendSession={handleExtendSession}
        onLogout={handleWarningLogout}
      />
    </div>
  );
}