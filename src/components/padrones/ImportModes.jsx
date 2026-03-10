import React from 'react';
import { Upload, Download, CheckCircle, XCircle, Loader2, AlertTriangle } from 'lucide-react';

/**
 * ValidationPanel - Muestra resultados de validación y acciones post-validación
 *
 * Props:
 * - validationResults: { totalRecords, validRecords, errorRecords, errors, isValid }
 * - deleteNonMatching: boolean
 * - toDeleteCount: number — registros que serán eliminados si deleteNonMatching está activo
 * - isProcessing: boolean
 * - onStartImport: inicia la importación real
 * - onReset: vuelve a selección
 * - onDownloadErrors: descarga reporte de errores
 */
export function ValidationPanel({
  validationResults,
  deleteNonMatching,
  toDeleteCount,
  isProcessing,
  onStartImport,
  onReset,
  onDownloadErrors
}) {
  if (!validationResults) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Resumen */}
        <div className={`border rounded-lg p-4 ${
          validationResults.isValid
            ? 'bg-green-50 border-green-200'
            : 'bg-red-50 border-red-200'
        }`}>
          <div className="flex items-center space-x-3 mb-4">
            {validationResults.isValid ? (
              <CheckCircle className="w-6 h-6 text-green-600" />
            ) : (
              <XCircle className="w-6 h-6 text-red-600" />
            )}
            <h3 className={`font-semibold ${
              validationResults.isValid ? 'text-green-800' : 'text-red-800'
            }`}>
              {validationResults.isValid ? 'Validación Exitosa' : 'Errores Encontrados'}
            </h3>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-gray-900">{validationResults.totalRecords}</p>
              <p className="text-sm text-gray-600">Total Registros</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">{validationResults.validRecords}</p>
              <p className="text-sm text-gray-600">Válidos</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">{validationResults.errorRecords}</p>
              <p className="text-sm text-gray-600">Con Errores</p>
            </div>
          </div>
        </div>

        {/* Aviso de eliminación si está activa la opción */}
        {deleteNonMatching && validationResults.isValid && (
          <div className="bg-red-50 border border-red-300 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-red-800">Se eliminarán registros de la base de datos</p>
                <p className="text-sm text-red-700 mt-1">
                  {toDeleteCount > 0
                    ? `${toDeleteCount.toLocaleString('es-AR')} registros existentes NO están en el archivo y serán eliminados permanentemente.`
                    : 'Calculando registros a eliminar...'}
                </p>
                <p className="text-xs text-red-600 mt-2 font-medium">⚠️ Esta acción no se puede deshacer.</p>
              </div>
            </div>
          </div>
        )}

        {/* Tabla de errores */}
        {!validationResults.isValid && validationResults.errors.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-gray-900">
                Detalle de Errores ({validationResults.errors.length})
              </h4>
              <button
                onClick={onDownloadErrors}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm"
              >
                <Download className="w-4 h-4" />
                <span>Descargar Reporte de Errores</span>
              </button>
            </div>

            <div className="bg-white border border-gray-300 rounded-lg max-h-96 overflow-y-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-100 sticky top-0">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium text-gray-700 border-b">Fila</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-700 border-b">Campo</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-700 border-b">Valor</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-700 border-b">Error</th>
                  </tr>
                </thead>
                <tbody>
                  {validationResults.errors.slice(0, 100).map((error, i) => (
                    <tr key={i} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-2 text-gray-700">{error.row}</td>
                      <td className="px-4 py-2 text-gray-700 font-mono text-xs">{error.field}</td>
                      <td className="px-4 py-2 text-gray-700">{error.value || '-'}</td>
                      <td className="px-4 py-2 text-red-600">{error.error}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {validationResults.errors.length > 100 && (
                <div className="p-3 text-center text-sm text-gray-600 bg-gray-50 border-t">
                  Mostrando 100 de {validationResults.errors.length} errores. Descargue el reporte completo.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Botones de acción */}
        <div className="flex space-x-4">
          <button
            onClick={onReset}
            className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancelar
          </button>
          {validationResults.isValid && (
            <button
              onClick={onStartImport}
              disabled={isProcessing}
              className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <Upload className="w-5 h-5" />
              <span>Iniciar Importación</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * ImportProgressPanel - Muestra el progreso durante la importación
 *
 * Props:
 * - importProgress: { current, total, percentage }
 * - importStats: { inserted, updated, deleted }
 * - deleteNonMatching: boolean
 */
export function ImportProgressPanel({ importProgress, importStats, deleteNonMatching }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Indicador visual */}
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Importando Padrón...</h3>
          <p className="text-gray-600">Por favor no cierre esta ventana</p>
        </div>

        {/* Barra de progreso */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-blue-700 font-medium">
              Procesando {importProgress.current.toLocaleString('es-AR')} de {importProgress.total.toLocaleString('es-AR')} registros
            </span>
            <span className="text-blue-600 font-bold">
              {importProgress.percentage}%
            </span>
          </div>

          <div className="w-full bg-blue-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${importProgress.percentage}%` }}
            />
          </div>

          <div className={`grid ${deleteNonMatching ? 'grid-cols-3' : 'grid-cols-2'} gap-4 pt-3 border-t border-blue-300`}>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{importStats.inserted}</p>
              <p className="text-sm text-blue-700">Nuevos</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">{importStats.updated}</p>
              <p className="text-sm text-blue-700">Actualizados</p>
            </div>
            {deleteNonMatching && (
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">{importStats.deleted || 0}</p>
                <p className="text-sm text-blue-700">Eliminados</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
