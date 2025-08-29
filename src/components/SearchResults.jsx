import React from 'react';
import { FileText, User, MapPin, Hash, Users, Sparkles, XCircle, CheckCircle } from 'lucide-react';

export default function SearchResults({ results, isLoading, userRole }) {
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
          <span>
            -> {results.length < 50 ? `Resultados (${results.length}) <-` : 'Al menos 50 resultados. Refine la búsqueda <-'}
          </span>
        </h3>
      </div>

      <div className="space-y-4">
        {results.map((record) => (
          <div
            key={record.documento}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
          >
            {/* Nivel 1: Apellido, Nombre */}
            <div className="mb-3">
              <h4 className="text-lg font-semibold text-gray-900">
                {record.apellido}, {record.nombre}
              </h4>
            </div>

            {/* Nivel 2: Domicilio */}
            <div className="mb-3">
              <div className="flex items-center space-x-2 text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>{record.domicilio || 'No especificado'}</span>
              </div>
            </div>

            {/* Nivel 3: Documento / Clase */}
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div className="flex items-center space-x-2 font-medium text-gray-600">
               {/* <Hash className="w-4 h-4" /> */}
                <span>DNI: {record.documento}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                {/* <FileText className="w-4 h-4" /> */}
                <span>Clase: {record.clase || '---'}</span>
              </div>
            </div>

            {/* Nivel 4: Localidad / Mesa */}
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div className="flex items-center space-x-2 font-medium text-gray-600">
                <Users className="w-4 h-4" />
                <span>Mesa: {record.mesa_numero || '---'}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                {/* <MapPin className="w-4 h-4" /> */}
                <span> {record.mesas?.establecimientos?.circuitos?.localidad || 'No especificada'}</span>
              </div>
            </div>

            {/* Nivel 5: da_es_nuevo / da_voto_obligatorio / voto_emitido */}
            <div className="grid grid-cols-3 gap-4 mb-3">
              <div className="flex items-center justify-center">
                {record.da_es_nuevo && (
                  <span className="flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                    {/* <Sparkles className="w-3 h-3" /> */} 
                    <span>NUEVO</span>
                  </span>
                )}
              </div>
              <div className="flex items-center justify-center">
                {record.da_voto_obligatorio === false ? (
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
              {/* <span className="flex items-center space-x-1 text-gray-600 text-xs font-medium">
                    <XCircle className="w-3 h-3" /> */} 
                    <span>NO.OBLIGADO</span>
                  </span>
                ) : record.da_voto_obligatorio === true ? (
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  {/* <span className="flex items-center space-x-1 text-green-600 text-sm font-medium">
                    <CheckCircle className="w-3 h-3" /> */} 
                    <span>OBLIGATORIO</span>
                  </span>
                ) : null}
              </div>
              <div className="flex items-center justify-center">
                {record.voto_emitido !== null && (
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    record.voto_emitido ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {record.voto_emitido ? 'Votó' : 'No votó'}
                  </span>
                )}
              </div>
            </div>

            {/* Nivel 6: Solo visible para usuarios tipo 3 o inferior */}
            {userRole && userRole <= 3 && (
              <div className="grid grid-cols-3 gap-4 pt-3 border-t border-gray-100">
                <div className="text-xs text-gray-600 text-center">
                  <span className="font-medium"> </span>
                  <p className="mt-1"> {record.da_texto_libre || ''}</p>
                </div>
                <div className="text-sm text-gray-600 text-center">
                  <span className="font-medium"> </span>
                  <div className="mt-1">
                    {record.emopicks?.dispay ? (
                      <span className="px-2 py-2 bg-yellow-100 text-yellow-800 rounded-full text-xl font-medium">
                        {record.emopicks.dispay}
                      </span>
                    ) : (
                      <span className="text-gray-500 text-sm"> </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-end">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                    MARCAR
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}