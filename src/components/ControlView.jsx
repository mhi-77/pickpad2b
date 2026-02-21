import React, { useState, useEffect } from 'react';
import { Grid3x3, UserCheck } from 'lucide-react';
import MesasView from './control/MesasView';
import FiscalesList from './gusers/FiscalesList';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

/**
 * Componente ControlView - Vista de control electoral
 *
 * Propósito: Proporciona herramientas para gestionar la operación electoral,
 * incluyendo administración de mesas y fiscales.
 *
 * Funcionalidades principales:
 * - Gestión de mesas electorales
 * - Administración de fiscales y asignación de mesas
 * - Control de acceso basado en tipos de usuario
 * - Dos pestañas: Mesas y Fiscales
 *
 * Características:
 * - Carga dinámica de tipos de usuario desde la base de datos
 * - Filtrado de tipos de usuario según permisos del usuario actual
 * - Integración con componentes especializados (MesasView, FiscalesList)
 * - Estados de carga y manejo de errores
 */
export default function ControlView() {
  const { user: currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('mesas');
  const [userTypes, setUserTypes] = useState([]);
  const [loadingUserTypes, setLoadingUserTypes] = useState(true);

  const filteredUserTypes = currentUser?.usuario_tipo
    ? userTypes.filter(type => type.tipo >= currentUser.usuario_tipo)
    : [];

  useEffect(() => {
    fetchUserTypes();
  }, []);

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

  const tabs = [
    { id: 'mesas', label: 'Mesas', icon: Grid3x3 },
    { id: 'fiscales', label: 'Fiscales', icon: UserCheck },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'mesas':
        return <MesasView />;

      case 'fiscales':
        return (
          <div className="space-y-4">
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <UserCheck className="w-6 h-6 text-orange-600" />
                <div>
                  <h3 className="font-semibold text-orange-800">Gestionar Fiscales</h3>
                  <p className="text-sm text-orange-700">
                    Administra la asignación de mesas
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-2">
              {loadingUserTypes ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Cargando tipos de usuario...</p>
                </div>
              ) : (
                <FiscalesList userTypes={filteredUserTypes} />
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Control Electoral</h2>
            <p className="text-gray-600 mt-1">
              Gestiona mesas y fiscales de tu operación
            </p>
          </div>
        </div>

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

      {renderTabContent()}
    </div>
  );
}
