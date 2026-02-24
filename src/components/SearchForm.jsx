import React, { useState } from 'react';
import { Search, Filter, RefreshCw, User, Users, MapPin, Hash } from 'lucide-react';

/**
 * Componente SearchForm - Formulario de búsqueda en el padrón electoral
 * 
 * Propósito: Proporciona una interfaz para buscar registros en el padrón electoral
 * con opciones de búsqueda simple (por documento) y avanzada (múltiples campos).
 * 
 * Props:
 * - onSearch: function - Callback que se ejecuta cuando se realiza una búsqueda
 * - isLoading: boolean - Indica si se está procesando una búsqueda
 * - availableLocalities: array - Lista de localidades disponibles para el dropdown
 */
export default function SearchForm({ onSearch, isLoading, availableLocalities = [], onClear }) {
  // Estado para almacenar todos los filtros de búsqueda
  const [filters, setFilters] = useState({});
  // Estado para controlar si se muestra la búsqueda avanzada o simple
  const [showAdvanced, setShowAdvanced] = useState(false);

  /**
   * Maneja el envío del formulario de búsqueda
   * Previene el comportamiento por defecto y ejecuta el callback onSearch
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(filters);
  };

  /**
   * Resetea todos los filtros de búsqueda
   * Limpia el estado de filtros y lo devuelve a un objeto vacío
   * Notifica al componente padre para que limpie los resultados
   */
  const handleReset = () => {
    setFilters({});
    if (onClear) {
      onClear();
    }
  };

  /**
   * Alterna entre búsqueda simple y avanzada
   * Limpia los campos específicos de cada modo para evitar conflictos
   */
  const toggleAdvanced = () => {
    const newShowAdvanced = !showAdvanced;
    setShowAdvanced(newShowAdvanced);
    
    if (newShowAdvanced) {
      // Al activar búsqueda avanzada, limpiar el campo documento simple
      setFilters(prev => {
        const { documento, ...rest } = prev;
        return rest;
      });
    } else {
      // Al desactivar búsqueda avanzada, limpiar todos los campos avanzados
      setFilters(prev => {
        const { apellido, nombre, localidad, mesa_numero, clase, ...rest } = prev;
        return rest;
      });
    }
  };

  /**
   * Actualiza un filtro específico en el estado
   * Si el valor está vacío, elimina la propiedad del objeto de filtros
   *
   * @param {string} key - La clave del filtro a actualizar
   * @param {string|number} value - El nuevo valor del filtro
   */
  const updateFilter = (key, value) => {
    setFilters(prev => {
      const newFilters = { ...prev };

      if (!value || value === '') {
        delete newFilters[key];
      } else {
        newFilters[key] = value;
      }

      return newFilters;
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-3">
      {/* Header del formulario con título y botón para alternar modo de búsqueda */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Buscar en Padrón</h2>
        <button
          onClick={toggleAdvanced}
          className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 transition-colors"
        >
          <Filter className="w-5 h-5" />
          <span className="text-sm font-medium">
            {showAdvanced ? 'Búsqueda Simple' : 'Usar Filtros'}
          </span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Modo de búsqueda simple - Solo campo de documento */}
        {!showAdvanced && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              <div className="flex items-center space-x-2">
                <Hash className="w-4 h-4" />
                <span>Número de Documento</span>
              </div>
            </label>
            <input
              type="number"
              value={filters.documento || ''}
              onChange={(e) => updateFilter('documento', e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              placeholder="Ej: 12345678"
            />
          </div>
        )}

        {/* Modo de búsqueda avanzada - Múltiples campos de filtro */}
        {showAdvanced && (
          <div className="space-y-3 p-3 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900">Búsqueda Avanzada</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {/* Campo de apellido */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
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

              {/* Campo de nombre */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
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

              {/* Campo de localidad */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4" />
                    <span>Localidad</span>
                  </div>
                </label>
                <select
                  value={filters.localidad || ''}
                  onChange={(e) => updateFilter('localidad', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                >
                  <option value="">Todas las localidades</option>
                  {availableLocalities.map((localidad) => (
                    <option key={localidad} value={localidad}>
                      {localidad}
                    </option>
                  ))}
                </select>
              </div>

              {/* Campos de Mesa y Clase en una sola fila */}
              <div className="grid grid-cols-2 gap-3 md:col-span-2 lg:col-span-3">
                {/* Campo de número de mesa */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4" />
                      <span>Mesa</span>
                    </div>
                  </label>
                  <input
                    type="number"
                    value={filters.mesa_numero || ''}
                    onChange={(e) => updateFilter('mesa_numero', e.target.value ? parseInt(e.target.value) : undefined)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder="N° de mesa"
                  />
                </div>

                {/* Campo de clase (año de nacimiento) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Clase (Año)
                  </label>
                  <input
                    type="number"
                    value={filters.clase || ''}
                    onChange={(e) => updateFilter('clase', e.target.value ? parseInt(e.target.value) : undefined)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder="Ej: 1977"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Botones de acción - Limpiar y Buscar */}
        <div className={`flex flex-wrap gap-2 ${showAdvanced ? 'pl-3' : ''}`}>
          {/* Botón para limpiar todos los filtros */}
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center space-x-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200"
          >
            <RefreshCw className="w-5 h-5" />
            <span>Limpiar</span>
          </button>

          {/* Botón para ejecutar la búsqueda */}
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              // Mostrar spinner cuando se está procesando la búsqueda
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              <Search className="w-5 h-5" />
            )}
            <span>Buscar</span>
          </button>
        </div>
      </form>
    </div>
  );
}