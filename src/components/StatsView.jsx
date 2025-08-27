import React, { useState } from 'react';
import { CheckCircle, XCircle, Clock, Users, FileText, AlertTriangle, BarChart3, TrendingUp, PieChart } from 'lucide-react';

export default function StatsView() {
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', label: 'General', icon: BarChart3 },
    { id: 'mesas', label: 'Por Mesa', icon: Users },
    { id: 'participacion', label: 'Participación', icon: TrendingUp },
    { id: 'reportes', label: 'Reportes', icon: FileText },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <Users className="w-8 h-8 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold text-blue-900">15,847</p>
                    <p className="text-sm text-blue-700">Total Empadronados</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold text-green-900">12,456</p>
                    <p className="text-sm text-green-700">Votos Emitidos</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <Clock className="w-8 h-8 text-yellow-600" />
                  <div>
                    <p className="text-2xl font-bold text-yellow-900">78.6%</p>
                    <p className="text-sm text-yellow-700">Participación</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <PieChart className="w-8 h-8 text-purple-600" />
                  <div>
                    <p className="text-2xl font-bold text-purple-900">245</p>
                    <p className="text-sm text-purple-700">Mesas Activas</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumen General</h3>
              <p className="text-gray-600 text-center py-8">
                Gráficos y estadísticas detalladas en desarrollo...
              </p>
            </div>
          </div>
        );
      
      case 'mesas':
        return (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <Users className="w-6 h-6 text-blue-600" />
                <div>
                  <h3 className="font-semibold text-blue-800">Estadísticas por Mesa</h3>
                  <p className="text-sm text-blue-700">Análisis detallado de participación por mesa electoral</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <p className="text-gray-600 text-center py-8">
                Estadísticas por mesa en desarrollo...
              </p>
            </div>
          </div>
        );
      
      case 'participacion':
        return (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <TrendingUp className="w-6 h-6 text-green-600" />
                <div>
                  <h3 className="font-semibold text-green-800">Análisis de Participación</h3>
                  <p className="text-sm text-green-700">Tendencias y patrones de participación electoral</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <p className="text-gray-600 text-center py-8">
                Análisis de participación en desarrollo...
              </p>
            </div>
          </div>
        );
      
      case 'reportes':
        return (
          <div className="space-y-4">
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <FileText className="w-6 h-6 text-purple-600" />
                <div>
                  <h3 className="font-semibold text-purple-800">Reportes y Exportaciones</h3>
                  <p className="text-sm text-purple-700">Generación de reportes detallados</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <p className="text-gray-600 text-center py-8">
                Sistema de reportes en desarrollo...
              </p>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Estadísticas Electorales</h2>
            <p className="text-gray-600 mt-1">
              Análisis y métricas del proceso electoral
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">Dashboard</span>
          </div>
        </div>

        {/* Tabs */}
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

      {/* Tab Content */}
      {renderTabContent()}
    </div>
  );
}