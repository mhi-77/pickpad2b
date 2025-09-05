import React, { useState } from 'react';
import { UserPlus, Users, Settings, BarChart3, UserCheck, UserCog } from 'lucide-react';
import { useEffect } from 'react';
import { supabase } from '../lib/supabase';
import SignupForm from './SignupForm';
import UsersList from './UsersList';
import FiscalesList from './FiscalesList';

/**
 * Componente GusersView - Vista principal para la gestión de usuarios
 * 
 * Propósito: Proporciona una interfaz con pestañas para gestionar usuarios del sistema.
 * Incluye funcionalidades para crear nuevos usuarios y administrar usuarios existentes.
 * 
 * Funcionalidades:
 * - Pestaña "Altas": Permite crear nuevos usuarios mediante SignupForm
 * - Pestaña "Gestión": Permite administrar usuarios existentes mediante UsersList
 * - Pestaña "Configuración": Reservada para futuras configuraciones de usuarios
 */
export default function GusersView() {
  // Estado para controlar qué pestaña está activa
  const [activeTab, setActiveTab] = useState('altas');
  
  // Estado para almacenar los tipos de usuario desde la base de datos
  const [userTypes, setUserTypes] = useState([]);
  const [loadingUserTypes, setLoadingUserTypes] = useState(true);

  // Configuración de las pestañas disponibles
  const tabs = [
    { id: 'altas', label: 'Altas', icon: UserPlus },
    { id: 'gestion', label: 'Gestión', icon: Users },
    { id: 'fiscales', label: 'Fiscales', icon: Settings },
  ];
  
  /**
   * Efecto para cargar los tipos de usuario al montar el componente
   */
  useEffect(() => {
    fetchUserTypes();
  }, []);

  /**
   * Obtiene los tipos de usuario desde la tabla usuariost
   */
  const fetchUserTypes = async () => {
    setLoadingUserTypes(true);
    try {
      const { data, error } = await supabase
        .from('usuariost')
        .select('tipo, descripcion')
        .order('tipo', { ascending: true });

      if (error) {
        console.error('Error fetching user types:', error);
        setUserTypes([]);
      } else {
        setUserTypes(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
      setUserTypes([]);
    } finally {
      setLoadingUserTypes(false);
    }
  };

  /**
   * Renderiza el contenido de la pestaña activa
   * Cada pestaña muestra diferentes componentes y funcionalidades
   */
  const renderTabContent = () => {
    switch (activeTab) {
      case 'altas':
        return (
          <div className="space-y-4">
            {/* Panel informativo para la sección de altas */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <UserPlus className="w-6 h-6 text-blue-600" />
                <div>
                  <h3 className="font-semibold text-blue-800">Crear Nuevos Usuarios</h3>
                  <p className="text-sm text-blue-700">
                    Registra nuevos usuarios con sus respectivos roles
                  </p>
                </div>
              </div>
            </div>
            
            {/* Contenedor principal para el formulario de registro */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="max-w-2xl mx-auto">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Formulario de Registro
                </h3>
                {/* Componente SignupForm para crear nuevos usuarios con tipos dinámicos */}
                {loadingUserTypes ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Cargando tipos de usuario...</p>
                  </div>
                ) : (
                  <SignupForm userTypes={userTypes} />
                )}
              </div>
            </div>
          </div>
        );
      
      case 'gestion':
        return (
          <div className="space-y-4">
            {/* Panel informativo para la sección de gestión */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <UserCheck className="w-6 h-6 text-green-600" />
                <div>
                  <h3 className="font-semibold text-green-800">Administrar Usuarios</h3>
                  <p className="text-sm text-green-700">
                    Visualiza, edita y elimina sobre la base de datos
                  </p>
                </div>
              </div>
            </div>
            
            {/* Contenedor principal para la lista de usuarios */}
            <div className="bg-white border border-gray-200 rounded-lg">
              {/* AQUÍ ESTÁ EL CAMBIO IMPORTANTE - Pasar userTypes como prop */}
              {loadingUserTypes ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Cargando tipos de usuario...</p>
                </div>
              ) : (
                <UsersList userTypes={userTypes} />
              )}
            </div>
          </div>
        );
      
     case 'fiscales':
        return (
          <div className="space-y-4">
            {/* Panel informativo para la sección de fiscales */}
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <Settings className="w-6 h-6 text-orange-600" />
                <div>
                  <h3 className="font-semibold text-orange-800">Gestión de Fiscales</h3>
                  <p className="text-sm text-orange-700">
                    Administra la asignación de mesas para fiscales
                  </p>
                </div>
              </div>
            </div>
            
            {/* Contenedor para la lista de fiscales */}
            <div className="bg-white border border-gray-200 rounded-lg p-2">
              {/* Componente FiscalesList para gestionar fiscales */}
              <FiscalesList userTypes={userTypes} />
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Encabezado principal del componente */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Gestión de Usuarios</h2>
            <p className="text-gray-600 mt-1">
              Administra usuarios, roles y permisos del sistema
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">Panel de Control</span>
          </div>
        </div>

        {/* Navegación por pestañas */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    isActive
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Contenido de la pestaña activa */}
      {renderTabContent()}
    </div>
  );
}