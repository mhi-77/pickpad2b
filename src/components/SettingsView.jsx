import React, { useState } from 'react';
import { Settings, MapPin, Building2, Save, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

/**
 * Componente SettingsView - Configuración del sistema electoral
 *
 * Propósito: Proporciona una interfaz para administrar la configuración general
 * del sistema electoral, incluyendo datos del comicio y organización de circuitos/mesas.
 *
 * Funcionalidades principales:
 * - Configuración de datos del comicio (nombre, fecha, descripción)
 * - Gestión de circuitos electorales y localidades
 * - Administración de establecimientos y mesas de votación
 * - Dos pestañas organizadas: Comicio y Circuitos & Mesas
 * - Formularios con validación para cada tipo de configuración
 *
 * Nota: Actualmente en modo vista previa con formularios de ejemplo.
 * La funcionalidad completa de persistencia debe ser implementada.
 */
export default function SettingsView() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('comicio');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const tabs = [
    { id: 'comicio', label: 'Comicio', icon: Building2 },
    { id: 'circuitos', label: 'Circuitos & Mesas', icon: MapPin },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'comicio':
        return (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <Building2 className="w-6 h-6 text-blue-600" />
                <div>
                  <h3 className="font-semibold text-blue-800">Configuración del Comicio</h3>
                  <p className="text-sm text-blue-700">
                    Gestiona los datos generales del evento electoral
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="max-w-2xl mx-auto space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre del Comicio
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Elecciones Generales 2025"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha del Comicio
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción
                  </label>
                  <textarea
                    rows="4"
                    placeholder="Descripción del evento electoral"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hora de Apertura
                    </label>
                    <input
                      type="time"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hora de Cierre
                    </label>
                    <input
                      type="time"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ubicación / Jurisdicción
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Ciudad Autónoma de Buenos Aires"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <div>
                      <p className="font-medium text-gray-900">Comicio Activo</p>
                      <p className="text-sm text-gray-600">
                        Habilitar funcionalidades relacionadas con este comicio
                      </p>
                    </div>
                  </label>
                </div>

                {saveMessage && (
                  <div
                    className={`p-3 rounded-lg text-sm ${
                      saveMessage.includes('Error')
                        ? 'bg-red-50 text-red-700 border border-red-200'
                        : 'bg-green-50 text-green-700 border border-green-200'
                    }`}
                  >
                    {saveMessage}
                  </div>
                )}

                <button
                  onClick={() => {
                    setIsSaving(true);
                    setTimeout(() => {
                      setSaveMessage('Configuración guardada correctamente');
                      setIsSaving(false);
                      setTimeout(() => setSaveMessage(''), 3000);
                    }, 1000);
                  }}
                  disabled={isSaving}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? 'Guardando...' : 'Guardar Configuración'}</span>
                </button>
              </div>
            </div>
          </div>
        );

      case 'circuitos':
        return (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <MapPin className="w-6 h-6 text-green-600" />
                <div>
                  <h3 className="font-semibold text-green-800">Gestión de Circuitos y Mesas</h3>
                  <p className="text-sm text-green-700">
                    Administra los circuitos electorales y mesas de votación
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="max-w-2xl mx-auto space-y-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">
                      Configuración de Circuitos
                    </h4>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Número de Circuito
                        </label>
                        <input
                          type="text"
                          placeholder="Ej: 1, 2A, 3B"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nombre del Circuito
                        </label>
                        <input
                          type="text"
                          placeholder="Ej: Circuito Norte"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Zona / Región
                        </label>
                        <input
                          type="text"
                          placeholder="Ej: Zona Centro"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2">
                        <Save className="w-4 h-4" />
                        <span>Agregar Circuito</span>
                      </button>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">
                      Configuración de Mesas
                    </h4>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Número de Mesa
                        </label>
                        <input
                          type="text"
                          placeholder="Ej: 1234"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Circuito Asignado
                        </label>
                        <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                          <option value="">Seleccionar circuito</option>
                          <option value="1">Circuito 1</option>
                          <option value="2">Circuito 2</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Ubicación / Escuela
                        </label>
                        <input
                          type="text"
                          placeholder="Ej: Escuela Nº 123 - Av. Principal 456"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Cantidad de Electores
                          </label>
                          <input
                            type="number"
                            placeholder="Ej: 350"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Estado
                          </label>
                          <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                            <option value="activa">Activa</option>
                            <option value="inactiva">Inactiva</option>
                          </select>
                        </div>
                      </div>

                      <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
                        <Save className="w-4 h-4" />
                        <span>Agregar Mesa</span>
                      </button>
                    </div>
                  </div>
                </div>

                {saveMessage && (
                  <div
                    className={`p-3 rounded-lg text-sm ${
                      saveMessage.includes('Error')
                        ? 'bg-red-50 text-red-700 border border-red-200'
                        : 'bg-green-50 text-green-700 border border-green-200'
                    }`}
                  >
                    {saveMessage}
                  </div>
                )}
              </div>
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
            <h2 className="text-2xl font-bold text-gray-900">Configuración del Sistema</h2>
            <p className="text-gray-600 mt-1">
              Administra los parámetros generales del sistema electoral
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Shield className="w-6 h-6 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">{user?.roleDescription}</span>
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
