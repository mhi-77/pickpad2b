import React from 'react';
import { CheckCircle, XCircle, Hash, User, Calendar, AlertCircle, Clock, X, MapPin } from 'lucide-react';

export default function FiscalizarResults({ results, isLoading, onMarcarVoto, isUpdating, showSuccessModal, setShowSuccessModal }) {
  const [showConfirmModal, setShowConfirmModal] = React.useState(false);
  const [selectedDocumento, setSelectedDocumento] = React.useState(null);
  const [selectedVotante, setSelectedVotante] = React.useState(null);

  const handleOpenConfirmModal = (documento, votante) => {
    setSelectedDocumento(documento);
    setSelectedVotante(votante);
    setShowConfirmModal(true);
  };

  const handleConfirmMarcarVoto = () => {
    if (selectedDocumento) {
      onMarcarVoto(selectedDocumento);
    }
    setShowConfirmModal(false);
    setSelectedDocumento(null);
    setSelectedVotante(null);
  };

  const handleCancelModal = () => {
    setShowConfirmModal(false);
    setSelectedDocumento(null);
    setSelectedVotante(null);
  };

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
            {/* Primera sección: Orden + Apellido/Nombre + Domicilio */}
            <div className="grid grid-cols-[auto_1fr] gap-2 mb-3">
              {/* Número de orden (ocupa 2 filas) */}
              <div className="row-span-2 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-xs text-gray-500 uppercase font-medium mb-1">ORDEN</p>
                  <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="font-bold text-2xl text-blue-800">{record.orden || '---'}</span>
                  </div>
                </div>
              </div>

              {/* Apellido y Nombre (primera fila) */}
              <div className="flex items-center space-x-2">
               {/*  <User className="w-4 h-4 text-gray-500" /> */}
                <div>
                  <p className="text-xs text-gray-500 uppercase">Apellido y Nombres</p>
                  <p className="font-semibold text-lg text-gray-900">
                    {record.apellido}, {record.nombre}
                  </p>
                </div>
              </div>

              {/* Domicilio (segunda fila) */}
              <div className="flex items-center space-x-2">
               {/*  <MapPin className="w-4 h-4 text-gray-500" /> */}
                <div>
                  <p className="text-xs text-gray-500 uppercase">Domicilio</p>
                  <p className="font-medium text-gray-700">
                    {record.domicilio || 'No especificado'}
                  </p>
                </div>
              </div>
            </div>

            {/* Segunda sección: Documento + Clase + Botón */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <div className="flex items-center space-x-6">
                <div>
                  <p className="text-xs text-gray-500 uppercase">Documento</p>
                  <p className="font-bold text-gray-900">{record.documento}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase">Clase</p>
                  <p className="font-medium text-gray-700 text-center">{record.clase || '---'}</p>
                </div>
              </div>

              {/* Botón de votó */}
              <div className="flex items-center space-x-3">
                {/* Mostrar emopick display si existe space-x-2 px-3 py-2 bg-yellow-50 border border-yellow-200 rounded-lg */}
                {record.emopicks?.dispay && (
                  <div className="flex items-center ">
                    <span className="text-xl">{record.emopicks.dispay}</span>
                  </div>
                )}
                
                {record.voto_emitido ? (
                  <div className="flex items-center space-x-2 px-4 py-2 bg-green-100 text-green-800 rounded-lg">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">Votó</span>
                  </div>
                ) : (
                  <button
                    onClick={() => handleOpenConfirmModal(record.documento, record)}
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

      {/* Modal de confirmación */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Confirmar voto
                  </h3>
                </div>
              </div>
              <button
                onClick={handleCancelModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <p className="text-yellow-800 font-medium mb-2">
                  ⚠️ Esta acción no se puede deshacer
                </p>
               
              </div>
              
              {selectedVotante && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Votante:</p>
                  <p className="font-semibold text-gray-900">
                    {selectedVotante.apellido}, {selectedVotante.nombre}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    DNI: {selectedVotante.documento}
                  </p>
                </div>
              )}
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleCancelModal}
                className="flex-1 px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancelar
              </button>
              
              <button
                onClick={handleConfirmMarcarVoto}
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Confirmar voto
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de éxito */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    ¡Éxito!
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setShowSuccessModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <p className="text-green-800 font-medium mb-2">
                  ✅ Voto registrado correctamente
                </p>
                <p className="text-green-700 text-sm">
                  El voto ha sido procesado y guardado en la base de datos exitosamente.
                </p>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={() => setShowSuccessModal(false)}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Continuar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}