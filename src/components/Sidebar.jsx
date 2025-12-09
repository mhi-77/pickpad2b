import React, { useState } from 'react';
import { Search, Calculator, ListChecks, FileText, FileStack, ScanEye, Settings, Menu, X, CheckCheck, User, SquarePen, UserCog, ClipboardList } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { FEATURES } from '../config/features';
import CreditsModal from './CreditsModal';

// Configuración de elementos del menú con permisos por rol
// maxRole define el nivel máximo de usuario que puede acceder (1=SUPERUSUARIO, 5=COLABORADOR)
// disabled: indica si la funcionalidad está temporalmente deshabilitada
const menuItems = [
  { id: 'search', label: 'Búsqueda', icon: Search, maxRole: 5, disabled: false },
  { id: 'fiscalizar', label: 'Fiscalizar', icon: ListChecks, maxRole: 4, disabled: false },
  { id: 'testigo', label: 'Mesa Testigo', icon: ScanEye, maxRole: 4, disabled: !FEATURES.MESA_TESTIGO_ENABLED },
  { id: 'gpicks', label: 'Picks', icon: SquarePen, maxRole: 3, disabled: false },
  { id: 'stats', label: 'Estadísticas', icon: Calculator, maxRole: 3, disabled: false },
  { id: 'control', label: 'Control', icon: ClipboardList, maxRole: 2, disabled: false },
  { id: 'gusers', label: 'Usuarios', icon: User, maxRole: 2, disabled: false },
  { id: 'padrones', label: 'Padrones', icon: FileText, maxRole: 2, disabled: false },
  { id: 'settings', label: 'Configuración', icon: Settings, maxRole: 2, disabled: false },
];

/**
 * Componente Sidebar - Barra lateral de navegación
 * 
 * Propósito: Proporciona navegación entre las diferentes secciones de la aplicación.
 * Incluye control de permisos basado en el rol del usuario y diseño responsivo.
 * 
 * Props:
 * - isOpen: boolean - Controla si el sidebar está abierto (importante para móviles)
 * - setIsOpen: function - Función para cambiar el estado de apertura
 * - activeView: string - Vista actualmente activa
 * - setActiveView: function - Función para cambiar la vista activa
 * - appVersion: string - Versión de la aplicación
 */
export default function Sidebar({ isOpen, setIsOpen, activeView, setActiveView, appVersion }) {
  // Obtener datos del usuario autenticado
  const { user } = useAuth();
  // Estado para controlar el modal de créditos
  const [showCreditsModal, setShowCreditsModal] = useState(false);

  /**
   * Filtrar elementos del menú basado en el rol del usuario
   * Solo muestra elementos donde el usuario_tipo sea menor o igual al maxRole
   */
  const visibleMenuItems = menuItems.filter(item => 
    user?.usuario_tipo && user.usuario_tipo <= item.maxRole
  );

  return (
    <>
      {/* Fondo oscuro para dispositivos móviles cuando el sidebar está abierto */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Contenedor principal del sidebar con animaciones de transición */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Header del sidebar con logo y botón de cierre */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <button
            onClick={() => setShowCreditsModal(true)}
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity cursor-pointer"
          >
            <CheckCheck className="w-6 h-6 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-900">
              PickPad <span className="text-sm text-gray-900">v{appVersion}</span>
            </h1>
          </button>
          {/* Botón de cierre solo visible en dispositivos móviles */}
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex flex-col h-full">
          <div className="flex-1 px-4 py-6">
            {/* Sección de información del usuario */}
            <div className="mb-8">
              <button
                onClick={() => {
                  if (user?.usuario_tipo && user.usuario_tipo <= 4) {
                    setActiveView('perfil');
                    setIsOpen(false);
                  }
                }}
                disabled={!(user?.usuario_tipo && user.usuario_tipo <= 4)}
                className={`w-full flex items-center space-x-3 p-3 bg-gray-50 rounded-lg transition-colors ${
                  user?.usuario_tipo && user.usuario_tipo <= 4
                    ? 'hover:bg-blue-50 cursor-pointer group'
                    : 'opacity-60 cursor-not-allowed'
                }`}
              >
                {/* Avatar del usuario */}
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <UserCog className="w-6 h-6 text-white" />
                </div>
                {/* Información del usuario - alineada a la izquierda */}
                <div className="flex-1 min-w-0 text-left">
                  <p className={`text-sm font-medium text-gray-900 truncate transition-colors ${
                    user?.usuario_tipo && user.usuario_tipo <= 4 ? 'group-hover:text-blue-600' : ''
                  }`}>
                    {user?.name}
                  </p>
                  <p className={`text-xs text-gray-500 transition-colors ${
                    user?.usuario_tipo && user.usuario_tipo <= 4 ? 'group-hover:text-blue-500' : ''
                  }`}>{user?.roleDescription}</p>
                </div>
              </button>
            </div>

            {/* Navegación principal */}
            <nav className="space-y-2">
              {visibleMenuItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = activeView === item.id;
                const isDisabled = item.disabled;

                // Identificar si es el primer ítem administrativo (Usuarios)
                const isFirstAdminItem = item.id === 'gusers';
                const isAdminItem = ['gusers', 'padrones', 'settings'].includes(item.id);

                // Renderizar ítem normal (sin contenedor)
                if (!isAdminItem) {
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        if (!isDisabled) {
                          setActiveView(item.id);
                          setIsOpen(false);
                        }
                      }}
                      disabled={isDisabled}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                        isDisabled
                          ? 'bg-gray-00 text-gray-400 cursor-not-allowed opacity-60'
                          : isActive
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      title={isDisabled ? 'Funcionalidad temporalmente deshabilitada' : ''}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  );
                }

                // Renderizar ítems administrativos dentro del contenedor
                if (isFirstAdminItem) {
                  // Obtener todos los ítems administrativos
                  const adminItems = visibleMenuItems.filter(i =>
                    ['gusers', 'padrones', 'settings'].includes(i.id)
                  );

                  return (
                    <div key="admin-section" className="pt-2 pb-2">
                      { /*
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 mb-3">
                      Administración
                      </p>   */ }
                      <div className="bg-gray-200 rounded-lg p-2 space-y-1">
                        {adminItems.map(adminItem => {
                          const AdminIcon = adminItem.icon;
                          const isAdminActive = activeView === adminItem.id;
                          const isAdminDisabled = adminItem.disabled;

                          return (
                            <button
                              key={adminItem.id}
                              onClick={() => {
                                if (!isAdminDisabled) {
                                  setActiveView(adminItem.id);
                                  setIsOpen(false);
                                }
                              }}
                              disabled={isAdminDisabled}
                              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                                isAdminDisabled
                                  ? 'bg-gray-00 text-gray-400 cursor-not-allowed opacity-60'
                                  : isAdminActive
                                  ? 'bg-blue-600 text-white shadow-md'
                                  : 'text-gray-700 hover:bg-gray-100'
                              }`}
                              title={isAdminDisabled ? 'Funcionalidad temporalmente deshabilitada' : ''}
                            >
                              <AdminIcon className="w-5 h-5" />
                              <span className="font-medium">{adminItem.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                }

                // No renderizar otros ítems administrativos individualmente
                return null;
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Modal de créditos */}
      <CreditsModal
        isOpen={showCreditsModal}
        onClose={() => setShowCreditsModal(false)}
        appVersion={appVersion}
      />
    </>
  );
}