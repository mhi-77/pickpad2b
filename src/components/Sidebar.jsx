import React from 'react';
import { Search, Calculator, ListChecks, FileText, FileStack, ScanEye, Settings, Menu, X, CheckCheck, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const menuItems = [
  { id: 'search', label: 'Búsqueda', icon: Search, maxRole: 5 },
  { id: 'fiscalizar', label: 'Fiscalizar', icon: ListChecks, maxRole: 4 },
  { id: 'testigo', label: 'Mesa Testigo', icon: ScanEye, maxRole: 4 },
  { id: 'stats', label: 'Estadísticas', icon: Calculator, maxRole: 3 },
  { id: 'gusers', label: 'Usuarios', icon: User, maxRole: 2 },
  { id: 'padrones', label: 'Padrones', icon: FileText, maxRole: 2 },
  { id: 'settings', label: 'Configuración', icon: Settings, maxRole: 5 },
];

export default function Sidebar({ isOpen, setIsOpen, activeView, setActiveView, appVersion }) {
  const { user } = useAuth();

  // Filter menu items based on user role
  const visibleMenuItems = menuItems.filter(item => 
    user?.usuario_tipo && user.usuario_tipo <= item.maxRole
  );

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <CheckCheck className="w-6 h-6 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-900">PickPad v{appVersion}</h1>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex flex-col h-full">
          <div className="flex-1 px-4 py-6">
            <div className="mb-8">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium">
                   {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user?.name} 
                  </p>
                  <p className="text-xs text-gray-500">{user?.roleDescription}</p>
                </div>
              </div>
            </div>

            <nav className="space-y-2">
              {visibleMenuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeView === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveView(item.id);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </div>
    </>
  );
}