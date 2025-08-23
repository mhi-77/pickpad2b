import React, { useState } from 'react';
import { Search, Filter, RefreshCw, User, MapPin, Hash } from 'lucide-react';

export default function SearchForm({ onSearch, isLoading }) {
  const [filters, setFilters] = useState({});
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(filters);
  };

  const handleReset = () => {
    setFilters({});
    //onSearch({});
  };

  const updateFilter = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value || undefined
    }));
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Búsqueda en Padrón Electoral</h2>
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
        >
          <Filter className="w-5 h-5" />
          <span className="text-sm font-medium">
            {showAdvanced ? 'Búsqueda Simple' : 'Búsqueda Avanzada'}
          </span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Búsqueda principal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center space-x-2">
                <Hash className="w-4 h-4" />
                <span>Número de Documento</span>
              </div>
            </label>
            <input
              type="text"
              value={filters.documento || ''}
              onChange={(e) => updateFilter('documento', e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              placeholder="Ej: 12345678"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span>Apellido</span>
              </div>
            </label>
            <input
              type="text"
              value={filters.apellido || ''}
              onChange={(e) => updateFilter('apellido', e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              placeholder="Apellido del votante"
            />
          </div>
        </div>

        {/* Filtros avanzados */}
        {showAdvanced && (
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900">Filtros Avanzados</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>Nombre</span>
                  </div>
                </label>
                <input
                  type="text"
                  value={filters.nombre || ''}
                  onChange={(e) => updateFilter('nombre', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="Nombre del votante"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4" />
                    <span>Localidad</span>
                  </div>
                </label>
                <input
                  type="text"
                  value={filters.localidad || ''}
                  onChange={(e) => updateFilter('localidad', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="Localidad"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Circuito
                </label>
                <input
                  type="text"
                  value={filters.circuito || ''}
                  onChange={(e) => updateFilter('circuito', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="Circuito electoral"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mesa
                </label>
                <input
                  type="number"
                  value={filters.mesa || ''}
                  onChange={(e) => updateFilter('mesa', e.target.value ? parseInt(e.target.value) : undefined)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="Número de mesa"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Clase (Año)
                </label>
                <input
                  type="number"
                  value={filters.clase || ''}
                  onChange={(e) => updateFilter('clase', e.target.value ? parseInt(e.target.value) : undefined)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="Año de nacimiento"
                />
              </div>
            </div>
          </div>
        )}

        {/* Botones de acción */}
        <div className="flex flex-wrap gap-3">
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
            <span>Limpiar</span>
          </button>
        </div>
      </form>
    </div>
  );
}