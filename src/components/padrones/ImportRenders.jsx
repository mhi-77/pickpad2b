import React from 'react';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

/**
 * CompletionScreen - Pantalla final tras importación exitosa
 *
 * Props:
 * - importStats: { inserted, updated, deleted }
 * - deleteNonMatching: boolean
 * - onReset: vuelve al estado inicial
 */
export function CompletionScreen({ importStats, deleteNonMatching, onReset }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="max-w-3xl mx-auto space-y-6 text-center">
        <CheckCircle className="w-16 h-16 text-green-600 mx-auto" />
        <h3 className="text-2xl font-semibold text-gray-900">Importación Completada</h3>

        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className={`grid ${deleteNonMatching ? 'grid-cols-3' : 'grid-cols-2'} gap-6`}>
            <div>
              <p className="text-3xl font-bold text-green-600">{importStats.inserted}</p>
              <p className="text-gray-700">Registros Nuevos</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-orange-600">{importStats.updated}</p>
              <p className="text-gray-700">Registros Actualizados</p>
            </div>
            {deleteNonMatching && (
              <div>
                <p className="text-3xl font-bold text-red-600">{importStats.deleted || 0}</p>
                <p className="text-gray-700">Registros Eliminados</p>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={onReset}
          className="bg-blue-600 text-white py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Realizar Nueva Importación
        </button>
      </div>
    </div>
  );
}

/**
 * ConfirmationModal - Modal de confirmación antes de importar
 * Requiere que el usuario ingrese su email para confirmar la operación
 *
 * Props:
 * - isOpen: boolean
 * - recordCount: number — total de registros a importar
 * - deleteNonMatching: boolean
 * - toDeleteCount: number — registros que serán eliminados
 * - userEmail: string — email del usuario autenticado
 * - confirmEmail: string — valor del input de confirmación
 * - onEmailChange: (value: string) => void
 * - onConfirm: () => void
 * - onCancel: () => void
 */
export function ConfirmationModal({
  isOpen,
  recordCount,
  deleteNonMatching,
  toDeleteCount,
  userEmail,
  confirmEmail,
  onEmailChange,
  onConfirm,
  onCancel
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4">

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Confirmar Importación</h3>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XCircle className="w-6 h-6" />
          </button>
        </div>

        {/* Resumen */}
        <div className="mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-3">
            <h4 className="font-semibold text-blue-900 mb-2">Esta acción importará:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• {recordCount?.toLocaleString('es-AR')} registros en total</li>
              <li>• Los existentes serán actualizados completamente</li>
              <li>• Los nuevos serán insertados</li>
            </ul>
          </div>

          {/* Advertencia de eliminación */}
          {deleteNonMatching && (
            <div className="bg-red-50 border border-red-300 rounded-lg p-4 mb-3">
              <h4 className="font-semibold text-red-800 mb-1 flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4" />
                <span>Eliminación de registros</span>
              </h4>
              <p className="text-sm text-red-700">
                {toDeleteCount > 0
                  ? `Se eliminarán permanentemente ${toDeleteCount.toLocaleString('es-AR')} registros que no están en el archivo.`
                  : 'Se eliminarán los registros que no estén en el archivo.'}
              </p>
              <p className="text-xs text-red-600 mt-2 font-medium">⚠️ Esta acción NO SE PUEDE DESHACER</p>
            </div>
          )}

          {!deleteNonMatching && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
              <p className="text-sm text-yellow-800 font-medium">
                ⚠️ Esta acción NO SE PUEDE DESHACER
              </p>
            </div>
          )}

          {/* Confirmación por email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ingrese su correo electrónico para confirmar:
            </label>
            <input
              type="email"
              value={confirmEmail}
              onChange={(e) => onEmailChange(e.target.value)}
              placeholder={userEmail}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              autoFocus
            />
            <p className="text-xs text-gray-500 mt-1">
              Debe coincidir con: {userEmail}
            </p>
          </div>
        </div>

        {/* Acciones */}
        <div className="flex space-x-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={confirmEmail !== userEmail}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              deleteNonMatching ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            <CheckCircle className="w-5 h-5" />
            <span>Confirmar</span>
          </button>
        </div>
      </div>
    </div>
  );
}
