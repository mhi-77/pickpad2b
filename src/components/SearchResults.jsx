import React from 'react';
import { FileText, User, MapPin, Download, Eye, Hash, Users } from 'lucide-react';

const getSexoColor = (sexo) => {
  switch (sexo) {
    case 'M':
      return 'bg-blue-100 text-blue-800';
    case 'F':
      return 'bg-pink-100 text-pink-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default function SearchResults({ results, isLoading }) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-600">Buscando en padrón electoral...</p>
          </div>
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No se encontraron resultados
          </h3>
          <p className="text-gray-600">
            Intenta modificar los criterios de búsqueda para obtener resultados.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">
          Padrón Electoral - Resultados ({results.length})
        </h3>
        <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
          <Download className="w-4 h-4" />
          <span>Exportar</span>
        </button>
      </div>

      <div className="space-y-4">
        {results.map((record) => (
          <div
            key={record.DOCUMENTO}
            className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  {record.APELLIDO}, {record.NOMBRE}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <Hash className="w-4 h-4" />
                    <span>DNI: {record.DOCUMENTO}</span>
                  </div>
                  {record.CLASE && (
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4" />
                      <span>Clase: {record.CLASE}</span>
                    </div>
                  )}
                  {record.MESA && (
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4" />
                      <span>Mesa: {record.MESA}</span>
                    </div>
                  )}
                  {record.LOCALIDAD && (
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4" />
                      <span>{record.LOCALIDAD}</span>
                    </div>
                  )}
                  {record.CIRCUITO && (
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4" />
                      <span>Circuito: {record.CIRCUITO}</span>
                    </div>
                  )}
                  {record.ORDEN && (
                    <div className="flex items-center space-x-2">
                      <Hash className="w-4 h-4" />
                      <span>Orden: {record.ORDEN}</span>
                    </div>
                  )}
                  </div>
              </div>
              
              <div className="flex items-center space-x-3 ml-4">
                {record.SEXO && (
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getSexoColor(record.SEXO)}`}>
                    {record.SEXO === 'M' ? 'Masculino' : record.SEXO === 'F' ? 'Femenino' : record.SEXO}
                  </span>
                )}
                {record.VOTO !== null && (
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    record.VOTO ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {record.VOTO ? 'Votó' : 'No votó'}
                  </span>
                )}
              </div>
            </div>

            {(record.OBSERVACIONES || record.TEAM) && (
              <div className="mb-4">
                {record.TEAM && (
                  <p className="text-sm text-gray-700 mb-1">
                    <strong>Equipo:</strong> {record.TEAM}
                  </p>
                )}
                {record.OBSERVACIONES && (
                  <p className="text-sm text-gray-700">
                    <strong>Observaciones:</strong> {record.OBSERVACIONES}
                  </p>
                )}
              </div>
            )}

            <div className="flex items-center justify-end space-x-2">
              <button className="flex items-center space-x-1 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                <Eye className="w-4 h-4" />
                <span className="text-sm">Ver Detalles</span>
              </button>
              <button className="flex items-center space-x-1 px-3 py-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                <Download className="w-4 h-4" />
                <span className="text-sm">Descargar</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}