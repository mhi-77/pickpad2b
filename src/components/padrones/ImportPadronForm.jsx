import React, { useState, useEffect, useRef } from 'react';
import { Upload, AlertCircle, CheckCircle, XCircle, Loader2, Info } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import {
  parseCSVFile,
  parseXLSXFile,
  validateRecordStructure,
  validateRecordIntegrity,
  checkDuplicateDocuments,
  normalizeRecord,
  downloadErrorReport,
  REQUIRED_COLUMNS
} from '../../utils/importUtils';

import FileSelector from './FileSelector';
import { ValidationPanel, ImportProgressPanel } from './ImportModes';
import { CompletionScreen, ConfirmationModal } from './ImportRenders';

/**
 * MODOS DE OPERACIÓN
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
 * Responsabilidad: solo estado, lógica y coordinación.
 * El render está delegado a:
 *   - FileSelector      → selección y preview del archivo
 *   - ValidationPanel   → resultados de validación
 *   - ImportProgressPanel → barra de progreso durante importación
 *   - CompletionScreen  → pantalla de éxito
 *   - ConfirmationModal → modal de confirmación por email
 *
 * Flujo: SELECTION → VALIDATION → (modal) → IMPORTING → COMPLETED
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
  const [userEmail, setUserEmail] = useState('');

  // Modal de confirmación
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmEmail, setConfirmEmail] = useState('');

  // Opción eliminar no incluidos
  const [deleteNonMatching, setDeleteNonMatching] = useState(false);
  const [toDeleteCount, setToDeleteCount] = useState(0);

  const fileInputRef = useRef(null);

  // ── Efectos ─────────────────────────────────────────────────────────────────

  useEffect(() => {
    checkUserPermissions();
  }, []);

  // ── Permisos ─────────────────────────────────────────────────────────────────

  const checkUserPermissions = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setUserPermissions(false); return; }

      setUserEmail(user.email || '');

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('usuario_tipo')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      // Solo Superusuario (1) o Administrador (2)) tienen permisos
      setUserPermissions(profile.usuario_tipo <= 2);
    } catch (error) {
      console.error('Error checking permissions:', error);
      setUserPermissions(false);
    }
  };

  // ── Drag & drop ──────────────────────────────────────────────────────────────

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e) => { e.preventDefault(); setIsDragging(false); };
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

  // ── Selección y parseo de archivo ────────────────────────────────────────────

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
    const isValidType =
      validTypes.includes(file.type) ||
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
      const result = file.name.endsWith('.csv')
        ? await parseCSVFile(file)
        : await parseXLSXFile(file);

      const missingColumns = REQUIRED_COLUMNS.filter(col => !result.headers.includes(col));
      if (missingColumns.length > 0) {
        setMessage({ type: 'error', text: `Columnas faltantes: ${missingColumns.join(', ')}` });
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

  // ── Validación ───────────────────────────────────────────────────────────────

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
          setMessage({ type: 'info', text: `Validando... ${i + 1} de ${records.length} registros` });
        }
      }

      // Validar duplicados de documento dentro del archivo
      const duplicateErrors = checkDuplicateDocuments(records);
      allErrors.push(...duplicateErrors);

      const errorRows = new Set(allErrors.map(e => e.row)).size;
      const validRecords = records.length - errorRows;

      setValidationResults({
        totalRecords: records.length,
        validRecords,
        errorRecords: errorRows,
        errors: allErrors,
        isValid: allErrors.length === 0
      });

      // Si está activa la opción de eliminar, calcular cuántos se eliminarían
      if (allErrors.length === 0) {
        const incomingDocs = new Set(records.map(r => Number(r.documento)));

        // Paginar para evitar el límite de 1000 filas de Supabase
        let allExistingDocs = [];
        let from = 0;
        const PAGE_SIZE = 1000;
        while (true) {
          const { data: page } = await supabase
            .from('padron')
            .select('documento')
            .range(from, from + PAGE_SIZE - 1);
          if (!page || page.length === 0) break;
          allExistingDocs = allExistingDocs.concat(page.map(r => Number(r.documento)));
          if (page.length < PAGE_SIZE) break;
          from += PAGE_SIZE;
        }

        const toDelete = allExistingDocs.filter(doc => !incomingDocs.has(doc));
        setToDeleteCount(toDelete.length);
      }

      setMessage(
        allErrors.length === 0
          ? { type: 'success', text: `Validación exitosa. Todos los ${records.length} registros son válidos.` }
          : { type: 'error', text: `Se encontraron ${allErrors.length} errores en ${errorRows} registros.` }
      );
    } catch (error) {
      setMessage({ type: 'error', text: `Error durante la validación: ${error.message}` });
    } finally {
      setIsProcessing(false);
    }
  };

  // ── Confirmación por email ───────────────────────────────────────────────────

  /**
   * Abre el modal de confirmación (reemplaza al window.confirm anterior)
   */
  const handleStartImportRequest = () => {
    if (!validationResults?.isValid) return;
    setConfirmEmail('');
    setShowConfirmModal(true);
  };

  const handleConfirmModalCancel = () => {
    setShowConfirmModal(false);
    setConfirmEmail('');
  };

  const handleConfirmModalConfirm = () => {
    setShowConfirmModal(false);
    setConfirmEmail('');
    startImport();
  };

  // ── Importación ──────────────────────────────────────────────────────────────

  const startImport = async () => {
    if (!validationResults?.isValid) return;

    setMode(MODES.IMPORTING);
    setIsProcessing(true);
    setImportProgress({ current: 0, total: parsedData.records.length, percentage: 0 });
    setImportStats({ inserted: 0, updated: 0, deleted: 0 });

    try {
      // Normalizar todos los registros (convertir tipos, limpiar datos)
      const normalizedRecords = parsedData.records.map(normalizeRecord);
      const BATCH_SIZE = 500;
      const totalBatches = Math.ceil(normalizedRecords.length / BATCH_SIZE);

      let totalInserted = 0;
      let totalUpdated = 0;

      // Procesar por lotes
      for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
        const start = batchIndex * BATCH_SIZE;
        const end = Math.min(start + BATCH_SIZE, normalizedRecords.length);
        const batch = normalizedRecords.slice(start, end);

        // Detectar qué documentos ya existen para contabilizar correctamente
        const { data: existing } = await supabase
          .from('padron')
          .select('documento')
          .in('documento', batch.map(r => r.documento));

        const existingSet = new Set(existing?.map(e => e.documento) || []);

        // UPSERT: Insert si no existe, Update si existe
        // onConflict: 'documento' define que documento es la clave para el conflicto
        const { error } = await supabase
          .from('padron')
          .upsert(batch, { onConflict: 'documento' });

        if (error) throw new Error(`Error en lote ${batchIndex + 1}: ${error.message}`);

        // Contabilizar inserts vs updates
        batch.forEach(record => {
          if (existingSet.has(record.documento)) totalUpdated++;
          else totalInserted++;
        });

        const percentage = Math.round((end / normalizedRecords.length) * 100);
        setImportProgress({ current: end, total: normalizedRecords.length, percentage });
        setImportStats({ inserted: totalInserted, updated: totalUpdated });

        // Pausa breve entre lotes para no sobrecargar la BD
        if (batchIndex < totalBatches - 1) {
          await new Promise(resolve => setTimeout(resolve, 200));
        }
      }

      // Eliminar registros no incluidos en el archivo si la opción está activa
      let totalDeleted = 0;
      if (deleteNonMatching) {
        const incomingDocs = new Set(normalizedRecords.map(r => Number(r.documento)));

        // Paginar para evitar el límite de 1000 filas de Supabase
        let allExistingDocs = [];
        let from = 0;
        const PAGE_SIZE = 1000;
        while (true) {
          const { data: page, error: pageError } = await supabase
            .from('padron')
            .select('documento')
            .range(from, from + PAGE_SIZE - 1);
          if (pageError) throw new Error(`Error leyendo padron: ${pageError.message}`);
          if (!page || page.length === 0) break;
          allExistingDocs = allExistingDocs.concat(page.map(r => Number(r.documento)));
          if (page.length < PAGE_SIZE) break;
          from += PAGE_SIZE;
        }

        const docsToDelete = allExistingDocs.filter(doc => !incomingDocs.has(doc));

        if (docsToDelete.length > 0) {
          const DELETE_BATCH = 500;
          for (let i = 0; i < docsToDelete.length; i += DELETE_BATCH) {
            const batch = docsToDelete.slice(i, i + DELETE_BATCH);
            const { error: deleteError } = await supabase
              .from('padron')
              .delete()
              .in('documento', batch);
            if (deleteError) throw new Error(`Error eliminando registros: ${deleteError.message}`);
            totalDeleted += batch.length;
            setImportStats({ inserted: totalInserted, updated: totalUpdated, deleted: totalDeleted });
          }
        }
      }

      // Actualizar estadísticas de mesas después de todos los cambios (upsert + delete)
      await updateStatistics();

      // Importación completada
      setMode(MODES.COMPLETED);
      setMessage({
        type: 'success',
        text: `Importación completada: ${totalInserted} nuevos, ${totalUpdated} actualizados${deleteNonMatching ? `, ${totalDeleted} eliminados` : ''}`
      });
    } catch (error) {
      setMessage({ type: 'error', text: `Error durante la importación: ${error.message}` });
      setMode(MODES.VALIDATION); // Volver a validación para reintentar
    } finally {
      setIsProcessing(false);
    }
  };

  
  
  // ── Estadísticas de mesas ─────────────────────────────────────────────────────

  const updateStatistics = async () => {
    try {
      // Obtener todas las mesas
      const { data: mesas } = await supabase.from('mesas').select('numero');
      if (!mesas?.length) return;

      for (const mesa of mesas) {
        const { count: totalEmpadronados } = await supabase
          .from('padron')
          .select('documento', { count: 'exact', head: true })
          .eq('mesa_numero', mesa.numero);

        const { count: totalVotaron } = await supabase
          .from('padron')
          .select('documento', { count: 'exact', head: true })
          .eq('mesa_numero', mesa.numero)
          .eq('voto_emitido', true);

        await supabase
          .from('mesas')
          .update({ total_empadronados: totalEmpadronados || 0, total_votaron: totalVotaron || 0 })
          .eq('numero', mesa.numero);
      }
    } catch (error) {
      console.error('Error updating statistics:', error);
      // No lanzar error, es un proceso secundario
    }
  };

  // ── Reset ────────────────────────────────────────────────────────────────────

  const resetForm = () => {
    setMode(MODES.SELECTION);
    setSelectedFile(null);
    setParsedData(null);
    setValidationResults(null);
    setImportProgress({ current: 0, total: 0, percentage: 0 });
    setImportStats({ inserted: 0, updated: 0, deleted: 0 });
    setMessage({ type: '', text: '' });
    setDeleteNonMatching(false);
    setToDeleteCount(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // ── Renders condicionales de permisos ────────────────────────────────────────

  if (userPermissions === null) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (userPermissions === false) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center space-x-3">
          <XCircle className="w-6 h-6 text-red-600" />
          <div>
            <h3 className="font-semibold text-red-800">Acceso Denegado</h3>
            <p className="text-sm text-red-700">
              Solo superusuarios y administradores pueden importar datos al padrón.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── Render principal ─────────────────────────────────────────────────────────

  return (
    <div className="space-y-4">

      {/* Header */}
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

      {/* SELECTION */}
      {mode === MODES.SELECTION && (
        <FileSelector
          selectedFile={selectedFile}
          parsedData={parsedData}
          isDragging={isDragging}
          isProcessing={isProcessing}
          deleteNonMatching={deleteNonMatching}
          onDeleteNonMatchingChange={setDeleteNonMatching}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onFileSelect={handleFileInputChange}
          onValidate={startValidation}
          onReset={resetForm}
          fileInputRef={fileInputRef}
        />
      )}

      {/* VALIDATION */}
      {mode === MODES.VALIDATION && validationResults && (
        <ValidationPanel
          validationResults={validationResults}
          deleteNonMatching={deleteNonMatching}
          toDeleteCount={toDeleteCount}
          isProcessing={isProcessing}
          onStartImport={handleStartImportRequest}
          onReset={resetForm}
          onDownloadErrors={() => downloadErrorReport(validationResults.errors)}
        />
      )}

      {/* IMPORTING */}
      {mode === MODES.IMPORTING && (
        <ImportProgressPanel
          importProgress={importProgress}
          importStats={importStats}
          deleteNonMatching={deleteNonMatching}
        />
      )}

      {/* COMPLETED */}
      {mode === MODES.COMPLETED && (
        <CompletionScreen
          importStats={importStats}
          deleteNonMatching={deleteNonMatching}
          onReset={resetForm}
        />
      )}

      {/* Modal de confirmación */}
      <ConfirmationModal
        isOpen={showConfirmModal}
        recordCount={parsedData?.records?.length}
        deleteNonMatching={deleteNonMatching}
        toDeleteCount={toDeleteCount}
        userEmail={userEmail}
        confirmEmail={confirmEmail}
        onEmailChange={setConfirmEmail}
        onConfirm={handleConfirmModalConfirm}
        onCancel={handleConfirmModalCancel}
      />

      {/* Mensajes de feedback */}
      {message.text && (
        <div className={`flex items-center space-x-2 p-4 rounded-lg ${
          message.type === 'success' ? 'bg-green-50 border border-green-200' :
          message.type === 'error'   ? 'bg-red-50 border border-red-200' :
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
            message.type === 'error'   ? 'text-red-700' :
                                         'text-blue-700'
          }>
            {message.text}
          </p>
        </div>
      )}
    </div>
  );
}