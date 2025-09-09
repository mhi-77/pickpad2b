import React, { useState } from 'react';
import { BarChart3, TrendingUp, FileText } from 'lucide-react';
// Import the new components
import RealtimeStats from './stats/RealtimeStats';
import GeneralStats from './stats/GeneralStats';
import ReportsStats from './stats/ReportsStats.jsx';

export default function StatsView() {
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', label: 'General', icon: BarChart3 },
    { id: 'realtime', label: 'Tiempo Real', icon: TrendingUp },
    { id: 'reports', label: 'Reportes', icon: FileText },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return <GeneralStats />;
      case 'realtime':
        return <RealtimeStats />;
      case 'reports':
        return <ReportsStats />;
      
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
          { /*
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">Dashboard</span>
          </div>
          */ }
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-5">
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

      {/* Tab Content - Now renders the separate components */}
      {renderTabContent()}
    </div>
  );
}