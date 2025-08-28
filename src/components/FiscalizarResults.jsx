import React from 'react';
import { CheckCircle, XCircle, Hash, User, Calendar, AlertCircle, Clock } from 'lucide-react';

export default function FiscalizarResults({ results, isLoading, onMarcarVoto, isUpdating }) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-600">Cargando padrón de la mesa...</p>
          </div>
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="text-center py-12">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No se encontraron registros
          </h3>
          <p className="text-gray-600">
            No hay registros que coincidan con la búsqueda.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">
          En padrón: {results.length} registro{results.length !== 1 ? 's' : ''}
        </h3>
      </div>

      <div className="space-y-3">
        {results.map((record) => (
          <div
            key={record.documento}
            className={`border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200 ${
              record.voto_emitido ? 'bg-green-50' : ''
            }`}
          >
            <div className="flex items-center justify-between">
              {/* Información del votante */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                {/* N ORDEN */}
                <div className="flex items-center space-x-2">
                  <Hash className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Orden</p>
                    <p className="font-bold text-lg">{record.orden || '---'}</p>
                  </div>
                </div>

                {/* Nombre completo */}
                <div className="flex items-center space-x-2 md:col-span-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Apellido y Nombres</p>
                    <p className="font-semibold text-gray-900">
                      {record.apellido}, {record.nombre}
                    </p>
                  </div>
                </div>

                {/* Documento y año */}
                <div className="flex items-center space-x-4">
                  <div>
                    <p className="text-xs text-gray-500 uppercase">DOC:</p>
                    <p className="font-medium">{record.documento}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500 uppercase">DNI</p>
                    <p className="text-xs text-gray-600">---</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Clase</p>
                    <p className="font-medium">{record.clase || '---'}</p>
                  </div>
                </div>
              </div>

              {/* Botón de votó */}
              <div className="ml-6 flex items-center space-x-3">
                {record.voto_emitido ? (
                  <div className="flex items-center space-x-2 px-4 py-2 bg-green-100 text-green-800 rounded-lg">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">Votó</span>
                  </div>
                ) : (
                  <button
                    onClick={() => onMarcarVoto(record.documento)}
                    disabled={isUpdating}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUpdating ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : null}
                    <span className="font-medium">No votó</span>
                  </button>
                )}
              </div>
            </div>

            {/* Información adicional si existe */}
            {(record.pick_nota || record.voto_pick_at) && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                {record.pick_nota && (
                  <p className="text-sm text-gray-600 mb-1">
                    <strong>Nota:</strong> {record.pick_nota}
                  </p>
                )}
                {record.voto_pick_at && (
                  <p className="text-xs text-gray-500">
                    <strong>Registrado:</strong> {new Date(record.voto_pick_at).toLocaleString('es-AR')}
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}