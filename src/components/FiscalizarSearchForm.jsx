import React, { useState } from 'react';
import { Search, RefreshCw, Hash, Users } from 'lucide-react';

export default function FiscalizarSearchForm({ onSearch, isLoading, mesaNumero, totalRegistros }) {
  const [documento, setDocumento] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(documento);
  };

  const handleReset = () => {
    setDocumento('');
    onSearch(''); // Buscar todos los registros de la mesa
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Fiscalización Electoral</h2>
          <div className="flex items-center space-x-4 mt-2">
            <div className="flex items-center space-x-2 text-blue-600">
              <Users className="w-4 h-4" />
              <span className="text-sm font-medium">Mesa N° {mesaNumero}</span>
            </div>
            <div className="text-sm text-gray-600">
              Total empadronados: {totalRegistros}
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <div className="flex items-center space-x-2">
              <Hash className="w-4 h-4" />
              <span>Buscar por Documento</span>
            </div>
          </label>
          <div className="flex space-x-3">
            <input
              type="number"
              value={documento}
              onChange={(e) => setDocumento(e.target.value)}
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              placeholder="Ingrese número de documento"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <Search className="w-5 h-5" />
              )}
              <span>Buscar</span>
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center space-x-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200"
            >
              <RefreshCw className="w-5 h-5" />
              <span>Ver Todos</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
