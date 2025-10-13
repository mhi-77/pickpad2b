import React, { useState } from 'react';
import { FileText, Upload, Download, Search, Database } from 'lucide-react';
import ExportPadronForm from './padrones/ExportPadronForm';

export default function PadronesView() {
  const [activeTab, setActiveTab] = useState('consulta');

  const tabs = [
    { id: 'consulta', label: 'Consulta', icon: Search },
    { id: 'importar', label: 'Importar', icon: Upload },
    { id: 'exportar', label: 'Exportar', icon: Download },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'consulta':
        return (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <Search className="w-6 h-6 text-blue-600" />
                <div>
                  <h3 className="font-semibold text-blue-800">Consultar Padrón Electoral</h3>
                  <p className="text-sm text-blue-700">
                    Busca información de votantes registrados en el padrón
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="max-w-2xl mx-auto space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Número de Documento
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ingrese el número de documento"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Apellido y Nombre
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ingrese apellido y nombre"
                  />
                </div>

                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                  Buscar
                </button>

                <div className="mt-6 p-4 bg-gray-50 rounded-lg text-center text-gray-600">
                  Los resultados de búsqueda se mostrarán aquí
                </div>
              </div>
            </div>
          </div>
        );

      case 'importar':
        return (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <Upload className="w-6 h-6 text-green-600" />
                <div>
                  <h3 className="font-semibold text-green-800">Importar Padrón</h3>
                  <p className="text-sm text-green-700">
                    Carga archivos de padrón electoral en formato CSV o Excel
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="max-w-2xl mx-auto">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">
                    Arrastra y suelta un archivo aquí o haz clic para seleccionar
                  </p>
                  <p className="text-sm text-gray-500">
                    Formatos soportados: CSV, XLS, XLSX
                  </p>
                  <button className="mt-4 bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors">
                    Seleccionar Archivo
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'exportar':
        return <ExportPadronForm />;

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Gestión de Padrones</h2>
            <p className="text-gray-600 mt-1">
              Administra el padrón electoral y consulta información de votantes
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Database className="w-6 h-6 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">Base de Datos</span>
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
