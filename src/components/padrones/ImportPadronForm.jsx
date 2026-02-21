import React, { useState, useEffect, useRef } from 'react';
import { Upload, AlertCircle, CheckCircle, XCircle, Loader2, Download, FileText, AlertTriangle, Info } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import {
  parseCSVFile,
  parseXLSXFile,
  validateRecordStructure,
  validateRecordIntegrity,
  checkDuplicateDocuments,
  normalizeRecord,
  downloadTemplate,
  downloadErrorReport,
  ALL_COLUMNS,
  REQUIRED_COLUMNS
} from '../../utils/importUtils';

/**
 * MODOS DE OPERACIÓN DEL COMPONENTE
 * Define los diferentes estados por los que pasa el proceso de importación
 */
const MODES = {
  SELECTION: 'selection',    // Selección de archivo
  VALIDATION: 'validation',  // Validación de datos
  IMPORTING: 'importing',    // Importación en progreso
  COMPLETED: 'completed'     // Importación completada
};

/**
 * ImportPadronForm - Componente principal para importación de padrón electoral
 * 
 * Funcionalidad:
 * 1. Permite subir archivos CSV o Excel con datos del padrón
 * 2. Valida la estructura y los datos antes de importar
 * 3. Importa en lotes (batch) para optimizar performance
 * 4. Actualiza estadísticas de mesas automáticamente
 * 5. Proporciona feedback visual del progreso
 * 
 * Flujo:
 * SELECTION → VALIDATION → IMPORTING → COMPLETED
 * 
 * Permisos: Solo usuarios tipo 1 (Admin) o tipo 2 (Coordinador)
 */
export default function ImportPadronForm() {
  // ====== ESTADO PRINCIPAL ======
  
  /**
   * Modo actual de operación (SELECTION, VALIDATION, IMPORTING, COMPLETED)
   */
  const [mode, setMode] = useState(MODES.SELECTION);
  
  /**
   * Archivo seleccionado por el usuario
   * @type {File | null}
   */
  const [selectedFile, setSelectedFile] = useState(null);
  
  /**
   * Datos parseados del archivo
   * @type {{ headers: string[], records: Object[] } | null}
   */
  const [parsedData, setParsedData] = useState(null);
  
  /**
   * Resultados de la validación
   * @type {{
   *   totalRecords: number,
   *   validRecords: number,
   *   errorRecords: number,
   *   errors: Array<{row: number, field: string, value: any, error: string}>,
   *   isValid: boolean
   * } | null}
   */
  const [validationResults, setValidationResults] = useState(null);
  
  /**
   * Progreso de la importación
   * @type {{ current: number, total: number, percentage: number }}
   */
  const [importProgress, setImportProgress] = useState({ current: 0, total: 0, percentage: 0 });
  
  /**
   * Estadísticas de la importación
   * @type {{ inserted: number, updated: number }}
   */
  const [importStats, setImportStats] = useState({ inserted: 0, updated: 0 });
  
  /**
   * Mensaje de feedback para el usuario
   * @type {{ type: 'success' | 'error' | 'info' | '', text: string }}
   */
  const [message, setMessage] = useState({ type: '', text: '' });
  
  /**
   * Indica si hay un proceso en curso (parsing, validación, importación)
   */
  const [isProcessing, setIsProcessing] = useState(false);
  
  /**
   * Indica si el usuario está arrastrando un archivo sobre la zona de drop
   */
  const [isDragging, setIsDragging] = useState(false);
  
  /**
   * Permisos del usuario actual (null: cargando, true: tiene permisos, false: sin permisos)
   * @type {boolean | null}
   */
  const [userPermissions, setUserPermissions] = useState(null);
  
  /**
   * Referencia al input file oculto
   */
  const fileInputRef = useRef(null);

  // ====== EFECTOS ======
  
  /**
   * Verifica los permisos del usuario al montar el componente
   */
  useEffect(() => {
    checkUserPermissions();
  }, []);

  // ====== FUNCIONES DE PERMISOS ======
  
  /**
   * Verifica si el usuario actual tiene permisos para importar
   * Solo usuarios tipo 1 (Admin) o 2 (Coordinador) pueden importar
   */
  const checkUserPermissions = async () => {
    try {
      // Obtener usuario autenticado
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setUserPermissions(false);
        return;
      }

      // Obtener perfil con tipo de usuario
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('usuario_tipo')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      // Solo Admin (1) o Coordinador (2) tienen permisos
      setUserPermissions(profile.usuario_tipo <= 2);
    } catch (error) {
      console.error('Error checking permissions:', error);
      setUserPermissions(false);
    }
  };

  // ====== FUNCIONES DE DRAG & DROP ======
  
  /**
   * Maneja el evento dragover para permitir el drop
   * @param {DragEvent} e 
   */
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  /**
   * Maneja el evento dragleave cuando el cursor sale de la zona
   * @param {DragEvent} e 
   */
  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  /**
   * Maneja el evento drop cuando se suelta un archivo
   * @param {DragEvent} e 
   */
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  /**
   * Maneja el cambio en el input file
   * @param {Event} e 
   */
  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) handleFileSelect(file);
  };

  // ====== FUNCIONES DE ARCHIVO ======
  
  /**
   * Procesa la selección de un archivo
   * Valida tamaño y tipo antes de parsear
   * 
   * @param {File} file - Archivo seleccionado
   */
  const handleFileSelect = (file) => {
    // Validar tamaño (máximo 100MB)
    const maxSize = 100 * 1024 * 1024;
    if (file.size > maxSize) {
      setMessage({ type: 'error', text: 'El archivo excede el tamaño máximo de 100MB' });
      return;
    }

    // Validar tipo de archivo
    const validTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];

    const isValidType = validTypes.includes(file.type) ||
                       file.name.endsWith('.csv') ||
                       file.name.endsWith('.xls') ||
                       file.name.endsWith('.xlsx');

    if (!isValidType) {
      setMessage({ type: 'error', text: 'Formato de archivo no válido. Use CSV o Excel (XLS/XLSX)' });
      return;
    }

    // Archivo válido, proceder a parsear
    setSelectedFile(file);
    setMessage({ type: '', text: '' });
    parseFile(file);
  };

  /**
   * Parsea el archivo seleccionado según su tipo
   * Valida que contenga todas las columnas requeridas
   * 
   * @param {File} file - Archivo a parsear
   */
  const parseFile = async (file) => {
    setIsProcessing(true);
    setMessage({ type: 'info', text: 'Leyendo archivo...' });

    try {
      let result;
      
      // Parsear según tipo de archivo
      if (file.name.endsWith('.csv')) {
        result = await parseCSVFile(file);
      } else {
        result = await parseXLSXFile(file);
      }

      // Verificar que estén todas las columnas requeridas
      const missingColumns = REQUIRED_COLUMNS.filter(col => !result.headers.includes(col));

      if (missingColumns.length > 0) {
        setMessage({
          type: 'error',
          text: `Columnas faltantes en el archivo: ${missingColumns.join(', ')}`
        });
        setIsProcessing(false);
        return;
      }

      // Archivo parseado exitosamente
      setParsedData(result);
      setMessage({
        type: 'success',
        text: `Archivo leído correctamente. ${result.records.length} registros encontrados.`
      });
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setIsProcessing(false);
    }
  };

  // ====== FUNCIONES DE VALIDACIÓN ======
  
  /**
   * Inicia el proceso de validación completa del archivo
   * 
   * Valida:
   * 1. Estructura de cada registro (tipos de datos, campos requeridos)
   * 2. Integridad referencial (existencia de FKs en BD)
   * 3. Duplicados de documento dentro del archivo
   * 
   * Modo: VALIDATION
   */
  const startValidation = async () => {
    if (!parsedData || parsedData.records.length === 0) {
      setMessage({ type: 'error', text: 'No hay datos para validar' });
      return;
    }

    setMode(MODES.VALIDATION);
    setIsProcessing(true);
    setMessage({ type: 'info', text: 'Validando archivo...' });

    try {
      // Obtener datos de referencia para validación de integridad
      // Carga todas las mesas, emopicks y profiles válidos
      const { data: mesasData } = await supabase.from('mesas').select('numero');
      const { data: emopicksData } = await supabase.from('emopicks').select('id');
      const { data: profilesData } = await supabase.from('profiles').select('id');

      const referenceData = {
        mesas: mesasData?.map(m => m.numero) || [],
        emopicks: emopicksData?.map(e => e.id) || [],
        profiles: profilesData?.map(p => p.id) || []
      };

      const allErrors = [];
      const records = parsedData.records;

      // Validar cada registro
      for (let i = 0; i < records.length; i++) {
        const rowNumber = i + 2; // +2 porque fila 1 es header, y contamos desde 1
        const record = records[i];

        // Validación de estructura (tipos, requeridos, formatos)
        const structureErrors = validateRecordStructure(record, rowNumber);
        allErrors.push(...structureErrors);

        // Si no hay errores de estructura, validar integridad referencial
        if (structureErrors.length === 0) {
          const integrityErrors = validateRecordIntegrity(record, rowNumber, referenceData);
          allErrors.push(...integrityErrors);
        }

        // Actualizar mensaje cada 1000 registros para dar feedback
        if ((i + 1) % 1000 === 0) {
          setMessage({
            type: 'info',
            text: `Validando... ${i + 1} de ${records.length} registros`
          });
        }
      }

      // Validar duplicados de documento dentro del archivo
      const duplicateErrors = checkDuplicateDocuments(records);
      allErrors.push(...duplicateErrors);

      // Calcular registros válidos (sin errores)
      const validRecords = records.length - new Set(allErrors.map(e => e.row)).size;

      // Guardar resultados de validación
      setValidationResults({
        totalRecords: records.length,
        validRecords: validRecords,
        errorRecords: records.length - validRecords,
        errors: allErrors,
        isValid: allErrors.length === 0
      });

      // Mensaje final según resultado
      if (allErrors.length === 0) {
        setMessage({
          type: 'success',
          text: `Validación exitosa. Todos los ${records.length} registros son válidos.`
        });
      } else {
        setMessage({
          type: 'error',
          text: `Se encontraron ${allErrors.length} errores en ${records.length - validRecords} registros. Corrija los errores antes de importar.`
        });
      }
    } catch (error) {
      setMessage({ type: 'error', text: `Error durante la validación: ${error.message}` });
    } finally {
      setIsProcessing(false);
    }
  };

  // ====== FUNCIONES DE IMPORTACIÓN ======
  
  /**
   * Inicia el proceso de importación de datos validados
   * 
   * Proceso:
   * 1. Confirmar con el usuario (operación destructiva)
   * 2. Normalizar todos los registros
   * 3. Importar en lotes (BATCH_SIZE = 500)
   * 4. Determinar si cada registro es INSERT o UPDATE
   * 5. Usar upsert de Supabase para la operación
   * 6. Actualizar estadísticas de mesas
   * 
   * Modo: IMPORTING → COMPLETED
   */
  const startImport = async () => {
    // Verificar que no haya errores de validación
    if (!validationResults?.isValid) {
      setMessage({ type: 'error', text: 'No se puede importar. Hay errores de validación.' });
      return;
    }

    // Confirmar operación destructiva
    const confirmMessage = `¿Está seguro de importar ${parsedData.records.length} registros?\n\nEsto actualizará TODOS los campos de los registros existentes.\n\nEsta acción no se puede deshacer.`;

    if (!window.confirm(confirmMessage)) {
      return;
    }

    // Iniciar importación
    setMode(MODES.IMPORTING);
    setIsProcessing(true);
    setImportProgress({ current: 0, total: parsedData.records.length, percentage: 0 });
    setImportStats({ inserted: 0, updated: 0 });

    try {
      // Normalizar todos los registros (convertir tipos, limpiar datos)
      const normalizedRecords = parsedData.records.map(normalizeRecord);
      
      // Configuración de lotes
      const BATCH_SIZE = 500; // Registros por lote
      const totalBatches = Math.ceil(normalizedRecords.length / BATCH_SIZE);

      let totalInserted = 0;
      let totalUpdated = 0;

      // Procesar por lotes
      for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
        const start = batchIndex * BATCH_SIZE;
        const end = Math.min(start + BATCH_SIZE, normalizedRecords.length);
        const batch = normalizedRecords.slice(start, end);

        // Determinar qué registros ya existen para contabilizar correctamente
        const existingDocs = batch.map(r => r.documento);
        const { data: existing } = await supabase
          .from('padron')
          .select('documento')
          .in('documento', existingDocs);

        const existingSet = new Set(existing?.map(e => e.documento) || []);

        // UPSERT: Insert si no existe, Update si existe
        // onConflict: 'documento' define que documento es la clave para el conflicto
        const { error } = await supabase
          .from('padron')
          .upsert(batch, { onConflict: 'documento' });

        if (error) {
          throw new Error(`Error en lote ${batchIndex + 1}: ${error.message}`);
        }

        // Contabilizar inserts vs updates
        batch.forEach(record => {
          if (existingSet.has(record.documento)) {
            totalUpdated++;
          } else {
            totalInserted++;
          }
        });

        // Actualizar progreso
        const current = end;
        const percentage = Math.round((current / normalizedRecords.length) * 100);

        setImportProgress({ current, total: normalizedRecords.length, percentage });
        setImportStats({ inserted: totalInserted, updated: totalUpdated });

        // Pausa breve entre lotes para no sobrecargar la BD
        if (batchIndex < totalBatches - 1) {
          await new Promise(resolve => setTimeout(resolve, 200));
        }
      }

      // Actualizar estadísticas de todas las mesas afectadas
      await updateStatistics();

      // Importación completada
      setMode(MODES.COMPLETED);
      setMessage({
        type: 'success',
        text: `Importación completada: ${totalInserted} nuevos, ${totalUpdated} actualizados`
      });
    } catch (error) {
      setMessage({ type: 'error', text: `Error durante la importación: ${error.message}` });
      setMode(MODES.VALIDATION); // Volver a validación para reintentar
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * Actualiza las estadísticas de todas las mesas
   * 
   * Recalcula:
   * - total_empadronados: cantidad de registros en padron por mesa
   * - total_votaron: cantidad de registros con voto_emitido = true
   * 
   * Esto es necesario después de cada importación para mantener
   * las estadísticas sincronizadas
   */
  const updateStatistics = async () => {
    try {
      // Obtener todas las mesas
      const { data: mesas } = await supabase.from('mesas').select('numero');

      if (mesas && mesas.length > 0) {
        // Actualizar estadísticas de cada mesa
        for (const mesa of mesas) {
          // Contar total de empadronados
          const { count: totalEmpadronados } = await supabase
            .from('padron')
            .select('documento', { count: 'exact', head: true })
            .eq('mesa_numero', mesa.numero);

          // Contar total de votantes
          const { count: totalVotaron } = await supabase
            .from('padron')
            .select('documento', { count: 'exact', head: true })
            .eq('mesa_numero', mesa.numero)
            .eq('voto_emitido', true);

          // Actualizar mesa con nuevos totales
          await supabase
            .from('mesas')
            .update({
              total_empadronados: totalEmpadronados || 0,
              total_votaron: totalVotaron || 0
            })
            .eq('numero', mesa.numero);
        }
      }
    } catch (error) {
      console.error('Error updating statistics:', error);
      // No lanzar error, es un proceso secundario
    }
  };

  // ====== FUNCIONES DE UTILIDAD ======
  
  /**
   * Resetea el formulario a su estado inicial
   * Vuelve al modo SELECTION
   */
  const resetForm = () => {
    setMode(MODES.SELECTION);
    setSelectedFile(null);
    setParsedData(null);
    setValidationResults(null);
    setImportProgress({ current: 0, total: 0, percentage: 0 });
    setImportStats({ inserted: 0, updated: 0 });
    setMessage({ type: '', text: '' });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // ====== RENDERS CONDICIONALES ======
  
  /**
   * Estado: Cargando permisos
   */
  if (userPermissions === null) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  /**
   * Estado: Sin permisos
   * Solo Admin y Coordinador pueden acceder
   */
  if (userPermissions === false) {
    return (
      <div className="space-y-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <XCircle className="w-6 h-6 text-red-600" />
            <div>
              <h3 className="font-semibold text-red-800">Acceso Denegado</h3>
              <p className="text-sm text-red-700">
                Solo administradores y coordinadores pueden importar datos al padrón
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ====== RENDER PRINCIPAL ======
  
  return (
    <div className="space-y-4">
      {/* Header informativo */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center space-x-3">
          <Upload className="w-6 h-6 text-green-600" />
          <div>
            <h3 className="font-semibold text-green-800">Importar Padrón</h3>
            <p className="text-sm text-green-700">
              Carga archivos de padrón electoral en formato CSV o Excel
            </p>
          </div>
        </div>
      </div>

      {/* MODO: SELECTION - Selección y carga de archivo */}
      {mode === MODES.SELECTION && (
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

            {/* Botón descargar plantilla */}
            <div className="flex justify-center">
              <button
                onClick={downloadTemplate}
                className="flex items-center space-x-2 px-6 py-3 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors border border-blue-300"
              >
                <Download className="w-5 h-5" />
                <span>Descargar Plantilla CSV</span>
              </button>
            </div>

            {/* Zona de drag & drop */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
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
                onChange={handleFileInputChange}
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

            {/* Información del archivo seleccionado */}
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
                      onClick={resetForm}
                      className="text-red-600 hover:text-red-700 text-sm font-medium"
                    >
                      Cambiar archivo
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Vista previa de datos y botón de validación */}
            {parsedData && (
              <div className="space-y-4">
                {/* Tabla de vista previa */}
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

                {/* Botón iniciar validación */}
                <button
                  onClick={startValidation}
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
      )}

      {/* MODO: VALIDATION - Resultados de validación */}
      {mode === MODES.VALIDATION && validationResults && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Panel de resumen de validación */}
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
              {/* Estadísticas de validación */}
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

            {/* Panel de errores detallados (solo si hay errores) */}
            {!validationResults.isValid && validationResults.errors.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-gray-900">
                    Detalle de Errores ({validationResults.errors.length})
                  </h4>
                  <button
                    onClick={() => downloadErrorReport(validationResults.errors)}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm"
                  >
                    <Download className="w-4 h-4" />
                    <span>Descargar Reporte de Errores</span>
                  </button>
                </div>

                {/* Tabla de errores con scroll */}
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
                  {/* Mensaje si hay más de 100 errores */}
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
                onClick={resetForm}
                className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancelar
              </button>
              {/* Botón de importación solo si la validación fue exitosa */}
              {validationResults.isValid && (
                <button
                  onClick={startImport}
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
      )}

      {/* MODO: IMPORTING - Progreso de importación */}
      {mode === MODES.IMPORTING && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Indicador visual de proceso */}
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Importando Padrón...</h3>
              <p className="text-gray-600">Por favor no cierre esta ventana</p>
            </div>

            {/* Panel de progreso detallado */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
              {/* Contador de progreso */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-blue-700 font-medium">
                  Procesando {importProgress.current.toLocaleString('es-AR')} de {importProgress.total.toLocaleString('es-AR')} registros
                </span>
                <span className="text-blue-600 font-bold">
                  {importProgress.percentage}%
                </span>
              </div>
              
              {/* Barra de progreso */}
              <div className="w-full bg-blue-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-blue-600 h-3 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${importProgress.percentage}%` }}
                ></div>
              </div>

              {/* Estadísticas de importación */}
              <div className="grid grid-cols-2 gap-4 pt-3 border-t border-blue-300">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{importStats.inserted}</p>
                  <p className="text-sm text-blue-700">Nuevos</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-600">{importStats.updated}</p>
                  <p className="text-sm text-blue-700">Actualizados</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODO: COMPLETED - Importación completada */}
      {mode === MODES.COMPLETED && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="max-w-3xl mx-auto space-y-6 text-center">
            {/* Ícono de éxito */}
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto" />
            <h3 className="text-2xl font-semibold text-gray-900">Importación Completada</h3>

            {/* Resumen de resultados */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-3xl font-bold text-green-600">{importStats.inserted}</p>
                  <p className="text-gray-700">Registros Nuevos</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-orange-600">{importStats.updated}</p>
                  <p className="text-gray-700">Registros Actualizados</p>
                </div>
              </div>
            </div>

            {/* Botón para nueva importación */}
            <button
              onClick={resetForm}
              className="bg-blue-600 text-white py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Realizar Nueva Importación
            </button>
          </div>
        </div>
      )}

      {/* MENSAJES DE FEEDBACK - Se muestra en todos los modos */}
      {message.text && (
        <div className={`flex items-center space-x-2 p-4 rounded-lg ${
          message.type === 'success' ? 'bg-green-50 border border-green-200' :
          message.type === 'error' ? 'bg-red-50 border border-red-200' :
          'bg-blue-50 border border-blue-200'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
          ) : message.type === 'error' ? (
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          ) : (
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />
          )}
          <p className={
            message.type === 'success' ? 'text-green-700' :
            message.type === 'error' ? 'text-red-700' :
            'text-blue-700'
          }>
            {message.text}
          </p>
        </div>
      )}
    </div>
  );
}
