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
    <div className="bg-white rounded-xl shadow-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
 
          <span className="text-2xl font-bold text-gray-900">Fiscalización Mesa N° {mesaNumero}</span>
          <div className="flex items-center space-x-4 mt-2">
            <div className="flex items-center space-x-2 text-blue-600">
              
            </div>
            
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
         <div>
         
          <div className="flex items-center justify-between mb-4">
            <input
              type="number"
              value={documento}
              onChange={(e) => setDocumento(e.target.value)}
              className="w-full px-2 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              placeholder="Ingrese número de documento"
            />
          </div>
          <div className="flex w-full gap-3">
            <button
              type="submit"
              disabled={isLoading}
              className="w-1/2 flex items-center justify-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
              className="w-1/2 flex items-center justify-center space-x-2 px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200"
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
