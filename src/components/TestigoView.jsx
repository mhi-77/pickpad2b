import React, { useState } from 'react';
import { ScanEye, BarChart3, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import MuestreoTestigo from './testigo/MuestreoTestigo';
import ResultadosTestigo from './testigo/ResultadosTestigo';

/**
 * Componente TestigoView - Vista principal para Mesa Testigo
 * 
 * Propósito: Contenedor principal que maneja las dos sub-vistas de Mesa Testigo:
 * - Muestreo: Para usuarios tipo 3 y 4 (fiscales)
 * - Resultados: Para usuarios tipo 2 o inferior (administradores)
 */
export default function TestigoView() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('muestreo');

  // Configuración de pestañas con permisos
  const tabs = [
    { 
      id: 'muestreo', 
      label: 'Muestreo', 
      icon: ScanEye, 
      minRole: 3, // Usuarios tipo 3 y 4
      maxRole: 4 
    },
    { 
      id: 'resultados', 
      label: 'Resultados', 
      icon: BarChart3, 
      minRole: 1, // Usuarios tipo 1 y 2
      maxRole: 2 
    },
  ];

  // Verificar permisos generales
  if (!user || user.usuario_tipo > 4) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="text-center py-12">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Sin permisos</h3>
          <p className="text-red-600">No tiene permisos para acceder a Mesa Testigo</p>
        </div>
      </div>
    );
  }

  // Filtrar pestañas según permisos del usuario
  const visibleTabs = tabs.filter(tab => 
    user.usuario_tipo >= tab.minRole && user.usuario_tipo <= tab.maxRole
  );

  // Si no hay pestañas visibles, mostrar mensaje de sin permisos
  if (visibleTabs.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="text-center py-12">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Sin permisos</h3>
          <p className="text-red-600">No tiene permisos para ninguna sección de Mesa Testigo</p>
        </div>
      </div>
    );
  }

  // Asegurar que la pestaña activa sea válida para el usuario
  React.useEffect(() => {
    if (!visibleTabs.find(tab => tab.id === activeTab)) {
      setActiveTab(visibleTabs[0].id);
    }
  }, [visibleTabs, activeTab]);

  /**
   * Renderiza el contenido de la pestaña activa
   */
  const renderTabContent = () => {
    switch (activeTab) {
      case 'muestreo':
        return <MuestreoTestigo />;
      case 'resultados':
        return <ResultadosTestigo />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header principal */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Mesa Testigo</h2>
            <p className="text-gray-600 mt-1">
              Control y seguimiento de muestras electorales
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <ScanEye className="w-6 h-6 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">Control Electoral</span>
          </div>
        </div>

        {/* Navegación por pestañas */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {visibleTabs.map((tab) => {
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