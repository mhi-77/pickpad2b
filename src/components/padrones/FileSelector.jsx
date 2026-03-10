import React from 'react';
import { Upload, Download, FileText, AlertTriangle, Info, Loader2, Trash2 } from 'lucide-react';
import { downloadTemplate } from '../../utils/importUtils';

/**
 * FileSelector - Selección, drag&drop y preview del archivo a importar
 *
 * Props:
 * - selectedFile: File | null
 * - parsedData: { headers, records } | null
 * - isDragging: boolean
 * - isProcessing: boolean
 * - deleteNonMatching: boolean — si true, se eliminarán registros no incluidos en el archivo
 * - onDeleteNonMatchingChange: (value: boolean) => void
 * - onDragOver / onDragLeave / onDrop: handlers drag&drop
 * - onFileSelect: handler para input file onChange
 * - onValidate: inicia validación completa
 * - onReset: limpia el formulario
 * - fileInputRef: ref al input file oculto
 */
export default function FileSelector({
  selectedFile,
  parsedData,
  isDragging,
  isProcessing,
  deleteNonMatching,
  onDeleteNonMatchingChange,
  onDragOver,
  onDragLeave,
  onDrop,
  onFileSelect,
  onValidate,
  onReset,
  fileInputRef
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Panel informativo */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-3">
            <Info className="w-5 h-5 text-blue-600" />
            <h4 className="font-semibold text-blue-900">Información Importante</h4>
          </div>
          <ul className="text-sm text-blue-700 space-y-2 ml-7">
            <li>Los registros existentes serán actualizados completamente</li>
            <li>Se validará el archivo antes de permitir la importación</li>
            <li>El archivo debe contener todas las columnas requeridas</li>
            <li>Tamaño máximo: 100MB o 2 millones de registros</li>
          </ul>
        </div>

        {/* Opción eliminar no incluidos */}
        <div
          className={`border rounded-lg p-4 cursor-pointer transition-colors ${
            deleteNonMatching
              ? 'bg-red-50 border-red-300'
              : 'bg-gray-50 border-gray-200 hover:border-gray-300'
          }`}
          onClick={() => onDeleteNonMatchingChange(!deleteNonMatching)}
        >
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="deleteNonMatching"
              checked={deleteNonMatching}
              onChange={(e) => onDeleteNonMatchingChange(e.target.checked)}
              onClick={(e) => e.stopPropagation()}
              className="mt-0.5 w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
            />
            <div>
              <label htmlFor="deleteNonMatching" className={`font-medium cursor-pointer ${deleteNonMatching ? 'text-red-800' : 'text-gray-700'}`}>
                <Trash2 className="w-4 h-4 inline mr-1 mb-0.5" />
                Eliminar registros no incluidos en el archivo
              </label>
              <p className={`text-sm mt-1 ${deleteNonMatching ? 'text-red-700' : 'text-gray-500'}`}>
                {deleteNonMatching
                  ? '⚠️ Los registros existentes en la BD que NO estén en el archivo serán eliminados permanentemente.'
                  : 'Los registros existentes que no estén en el archivo se mantendrán sin cambios.'}
              </p>
            </div>
          </div>
        </div>

        {/* Descargar plantilla */}
        <div className="flex justify-center">
          <button
            onClick={downloadTemplate}
            className="flex items-center space-x-2 px-6 py-3 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors border border-blue-300"
          >
            <Download className="w-5 h-5" />
            <span>Descargar Plantilla CSV</span>
          </button>
        </div>

        {/* Zona drag & drop */}
        <div
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragging
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 bg-white hover:border-gray-400'
          }`}
        >
          <Upload className={`w-12 h-12 mx-auto mb-4 ${isDragging ? 'text-blue-600' : 'text-gray-400'}`} />
          <p className="text-gray-600 mb-2">
            Arrastra y suelta un archivo aquí o haz clic para seleccionar
          </p>
          <p className="text-sm text-gray-500 mb-4">
            Formatos soportados: CSV, XLS, XLSX
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xls,.xlsx"
            onChange={onFileSelect}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessing}
            className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Seleccionar Archivo
          </button>
        </div>

        {/* Info archivo seleccionado */}
        {selectedFile && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FileText className="w-6 h-6 text-gray-600" />
                <div>
                  <p className="font-medium text-gray-900">{selectedFile.name}</p>
                  <p className="text-sm text-gray-600">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              {!isProcessing && (
                <button
                  onClick={onReset}
                  className="text-red-600 hover:text-red-700 text-sm font-medium"
                >
                  Cambiar archivo
                </button>
              )}
            </div>
          </div>
        )}

        {/* Vista previa + botón validar */}
        {parsedData && (
          <div className="space-y-4">
            <div className="bg-white border border-gray-300 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3">Vista Previa (primeras 5 filas)</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      {parsedData.headers.slice(0, 8).map((header, i) => (
                        <th key={i} className="px-3 py-2 text-left font-medium text-gray-700 border-b">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {parsedData.records.slice(0, 5).map((record, i) => (
                      <tr key={i} className="border-b">
                        {parsedData.headers.slice(0, 8).map((header, j) => (
                          <td key={j} className="px-3 py-2 text-gray-700">
                            {record[header] || '-'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-gray-600 mt-3">
                Mostrando {Math.min(5, parsedData.records.length)} de {parsedData.records.length} registros
              </p>
            </div>

            <button
              onClick={onValidate}
              disabled={isProcessing}
              className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg hover:bg-orange-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Validando...</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-5 h-5" />
                  <span>Validar Archivo Completo (Modo Simulación)</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
