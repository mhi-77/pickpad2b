import React, { useState, useEffect } from 'react';
import { Download, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import {
  processExtendedBasicData,
  convertRawToCSV,
  downloadFile,
  generateFileName,
  exportToExcelWithFormat
} from '../../utils/exportUtils';
import { loadEmopicksWithCount, formatEmopickDisplay } from '../../utils/emopicksUtils';

/**
 * Componente ExportPadronForm - Exportación de datos del padrón electoral
 *
 * Propósito: Proporciona una interfaz completa para exportar datos del padrón electoral
 * con múltiples opciones de filtrado y formatos de salida (CSV y Excel).
 *
 * Funcionalidades principales:
 * - Exportación completa o filtrada del padrón electoral
 * - Dos modos de exportación: Básico (todos los campos) y Extendido (campos personalizados)
 * - Filtros por: estado de voto, emopick, rango de mesas, rango de clases (años)
 * - Soporte para grandes volúmenes de datos con procesamiento por lotes
 * - Exportación a formatos CSV y Excel con formato personalizado
 * - Indicador de progreso en tiempo real
 * - Contador de registros que serán exportados según filtros aplicados
 *
 * Características técnicas:
 * - Procesamiento por lotes de 5000 registros para evitar problemas de memoria
 * - Generación de nombres de archivo automáticos con timestamp
 * - Validación de rangos de filtros
 * - Feedback visual del progreso de exportación
 */
export default function ExportPadronForm() {
  const [isBasicMode, setIsBasicMode] = useState(false);
  const [voteStatus, setVoteStatus] = useState('all');
  const [selectedEmopick, setSelectedEmopick] = useState('all');
  const [mesaDesde, setMesaDesde] = useState('');
  const [mesaHasta, setMesaHasta] = useState('');
  const [claseDesde, setClaseDesde] = useState('');
  const [claseHasta, setClaseHasta] = useState('');

  const [emopicks, setEmopicks] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [recordCount, setRecordCount] = useState(null);
  const [exportProgress, setExportProgress] = useState({ current: 0, total: 0, percentage: 0 });

  useEffect(() => {
    loadEmopicks();
  }, []);

  useEffect(() => {
    loadRecordCount();
  }, [isBasicMode, voteStatus, selectedEmopick, mesaDesde, mesaHasta, claseDesde, claseHasta]);

  /**
   * Carga la lista de emopicks (listas electorales) disponibles
   * Incluye el conteo de registros por cada emopick
   */
  const loadEmopicks = async () => {
    try {
      const data = await loadEmopicksWithCount();
      setEmopicks(data || []);
    } catch (error) {
      console.error('Error loading emopicks:', error);
    }
  };

  /**
   * Obtiene el conteo de registros que coinciden con los filtros actuales
   * Se actualiza automáticamente cada vez que cambian los filtros
   */
  const loadRecordCount = async () => {
    try {
      let query = supabase
        .from('padron')
        .select('documento', { count: 'exact', head: true });

      if (isBasicMode) {
        query = applyFilters(query);
      }

      const { count, error } = await query;

      if (error) throw error;
      setRecordCount(count);
    } catch (error) {
      console.error('Error loading record count:', error);
      setRecordCount(null);
    }
  };

  /**
   * Aplica los filtros seleccionados a una consulta de Supabase
   * Filtra por estado de voto, emopick, rangos de mesa y clase
   *
   * @param {SupabaseQueryBuilder} query - Consulta de Supabase a la que aplicar filtros
   * @returns {SupabaseQueryBuilder} Consulta con filtros aplicados
   */
  const applyFilters = (query) => {
    if (voteStatus === 'voted') {
      query = query.eq('voto_emitido', true);
    } else if (voteStatus === 'not_voted') {
      query = query.eq('voto_emitido', false);
    }

    if (selectedEmopick !== 'all') {
      query = query.eq('emopick_id', parseInt(selectedEmopick));
    }

    if (mesaDesde && !isNaN(parseInt(mesaDesde))) {
      query = query.gte('mesa_numero', parseInt(mesaDesde));
    }

    if (mesaHasta && !isNaN(parseInt(mesaHasta))) {
      query = query.lte('mesa_numero', parseInt(mesaHasta));
    }

    if (claseDesde && !isNaN(parseInt(claseDesde))) {
      query = query.gte('clase', parseInt(claseDesde));
    }

    if (claseHasta && !isNaN(parseInt(claseHasta))) {
      query = query.lte('clase', parseInt(claseHasta));
    }

    return query;
  };

  /**
   * Obtiene los datos del padrón desde la base de datos aplicando filtros
   * Procesa los datos en lotes de 5000 registros para optimizar memoria
   * Actualiza el progreso en tiempo real durante la exportación
   *
   * @returns {Promise<Array>} Array con todos los registros filtrados
   */
  const fetchPadronData = async () => {
    let query = supabase
      .from('padron')
      .select(`
        *,
        emopicks(id, display),
        voto_pick_user_profile:profiles!padron_voto_pick_user_fkey(full_name),
        emopick_user_profile:profiles!padron_emopick_user_fkey(full_name),
        pick_check_user_profile:profiles!padron_pick_check_user_fkey(full_name),
        mesas(
          numero,
          establecimientos(
            nombre,
            circuitos(
              localidad
            )
          )
        )
      `)
      .order('mesa_numero', { ascending: true })
      .order('orden', { ascending: true });

    query = applyFilters(query);

    const { data, error } = await query;

    if (error) throw error;
    return data;
  };

  const fetchAllPadronDataPaginated = async (totalRecords, isRawMode = false) => {
    const BATCH_SIZE = 1000;
    const totalBatches = Math.ceil(totalRecords / BATCH_SIZE);
    let allData = [];

    for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
      const from = batchIndex * BATCH_SIZE;
      const to = from + BATCH_SIZE - 1;

      let query;

      if (isRawMode) {
        query = supabase
          .from('padron')
          .select('*')
          .order('mesa_numero', { ascending: true })
          .order('orden', { ascending: true })
          .range(from, to);
      } else {
        query = supabase
          .from('padron')
          .select(`
            *,
            emopicks(id, display),
            voto_pick_user_profile:profiles!padron_voto_pick_user_fkey(full_name),
            emopick_user_profile:profiles!padron_emopick_user_fkey(full_name),
            pick_check_user_profile:profiles!padron_pick_check_user_fkey(full_name),
            mesas(
              numero,
              establecimientos(
                nombre,
                circuitos(
                  localidad
                )
              )
            )
          `)
          .order('mesa_numero', { ascending: true })
          .order('orden', { ascending: true })
          .range(from, to);

        query = applyFilters(query);
      }

      const { data, error } = await query;

      if (error) {
        console.error(`Error fetching batch ${batchIndex + 1}:`, error);
        throw error;
      }

      allData = allData.concat(data);

      const currentRecords = Math.min((batchIndex + 1) * BATCH_SIZE, totalRecords);
      const percentage = Math.round((currentRecords / totalRecords) * 100);

      setExportProgress({
        current: currentRecords,
        total: totalRecords,
        percentage: percentage
      });
    }

    return allData;
  };

  const handleExport = async () => {
    if (recordCount === 0) {
      setMessage({
        type: 'error',
        text: 'No hay registros para exportar con los filtros aplicados'
      });
      return;
    }

    if (recordCount > 350000) {
      setMessage({
        type: 'error',
        text: `El límite máximo de exportación es 350,000 registros. Actualmente hay ${recordCount.toLocaleString('es-AR')} registros con los filtros aplicados. Por favor, aplique más filtros para reducir la cantidad.`
      });
      return;
    }

    if (recordCount > 50000) {
      const confirm = window.confirm(
        `Se exportarán ${recordCount.toLocaleString('es-AR')} registros. Esto puede tomar varios minutos. ¿Desea continuar?`
      );
      if (!confirm) return;
    }

    setIsLoading(true);
    setMessage({ type: '', text: '' });
    setExportProgress({ current: 0, total: recordCount, percentage: 0 });

    try {
      let rawData;

      if (isBasicMode) {
        rawData = await fetchAllPadronDataPaginated(recordCount, false);

        if (!rawData || rawData.length === 0) {
          setMessage({
            type: 'error',
            text: 'No se encontraron datos para exportar con los filtros aplicados'
          });
          setIsLoading(false);
          setExportProgress({ current: 0, total: 0, percentage: 0 });
          return;
        }

        const processedData = processExtendedBasicData(rawData);

        try {
          const filename = generateFileName('xlsx', true);
          await exportToExcelWithFormat(processedData, filename);

          setMessage({
            type: 'success',
            text: `Se exportaron ${processedData.length.toLocaleString('es-AR')} registros correctamente en formato Excel`
          });
        } catch (excelError) {
          console.error('Error generating Excel file:', excelError);
          setMessage({
            type: 'error',
            text: 'Error al generar el archivo Excel. Intente nuevamente o contacte al administrador.'
          });
        }
      } else {
        rawData = await fetchAllPadronDataPaginated(recordCount, true);

        if (!rawData || rawData.length === 0) {
          setMessage({
            type: 'error',
            text: 'No se encontraron datos para exportar'
          });
          setIsLoading(false);
          setExportProgress({ current: 0, total: 0, percentage: 0 });
          return;
        }

        const csvContent = convertRawToCSV(rawData);
        const filename = generateFileName('csv', false);
        downloadFile(csvContent, filename, 'text/csv;charset=utf-8;');

        setMessage({
          type: 'success',
          text: `Se exportaron ${rawData.length.toLocaleString('es-AR')} registros correctamente en formato CSV`
        });
      }
    } catch (error) {
      console.error('Error exporting data:', error);
      setMessage({
        type: 'error',
        text: `Error al exportar los datos: ${error.message || 'Intente nuevamente'}`
      });
    } finally {
      setIsLoading(false);
      setExportProgress({ current: 0, total: 0, percentage: 0 });
    }
  };


  return (
    <div className="space-y-4">
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <div className="flex items-center space-x-3">
          <Download className="w-6 h-6 text-purple-600" />
          <div>
            <h3 className="font-semibold text-purple-800">Exportar Padrón</h3>
            <p className="text-sm text-purple-700">
              Descarga información del padrón en diferentes formatos
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="basicMode"
                checked={isBasicMode}
                onChange={(e) => setIsBasicMode(e.target.checked)}
                className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <label htmlFor="basicMode" className="font-medium text-blue-900 cursor-pointer">
                Formato Personalizado
              </label>
            </div>
            <p className="text-sm text-blue-700 mt-2 ml-7">
              {isBasicMode
                ? 'Exportar en excel con formato y filtrado (control y análisis)'
                : 'Exportar tabla completa en CSV sin formato (programación)'}
            </p>
          </div>

          {isBasicMode && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado de Votación
                </label>
                <select
                  value={voteStatus}
                  onChange={(e) => setVoteStatus(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">Todos</option>
                  <option value="voted">Votaron</option>
                  <option value="not_voted">No Votaron</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pick
                </label>
                <select
                  value={selectedEmopick}
                  onChange={(e) => setSelectedEmopick(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">Todos</option>
                  {emopicks.map(emopick => (
                    <option key={emopick.id} value={emopick.id}>
                      {formatEmopickDisplay(emopick.display, emopick.count)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-300 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Rango de Mesas
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Desde Mesa N°
                  </label>
                  <input
                    type="number"
                    value={mesaDesde}
                    onChange={(e) => setMesaDesde(e.target.value)}
                    placeholder="Ej: 1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Hasta Mesa N°
                  </label>
                  <input
                    type="number"
                    value={mesaHasta}
                    onChange={(e) => setMesaHasta(e.target.value)}
                    placeholder="Ej: 9999"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                  />
                </div>
              </div>
              {mesaDesde && mesaHasta && parseInt(mesaDesde) > parseInt(mesaHasta) && (
                <p className="text-sm text-red-600 mt-2">
                  El número de mesa inicial debe ser menor o igual al número de mesa final
                </p>
              )}
            </div>

            <div className="bg-gray-50 border border-gray-300 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Rango de Clase
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Desde Clase
                  </label>
                  <input
                    type="number"
                    value={claseDesde}
                    onChange={(e) => setClaseDesde(e.target.value)}
                    placeholder="Ej: 1950"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Hasta Clase
                  </label>
                  <input
                    type="number"
                    value={claseHasta}
                    onChange={(e) => setClaseHasta(e.target.value)}
                    placeholder="Ej: 2006"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                  />
                </div>
              </div>
              {claseDesde && claseHasta && parseInt(claseDesde) > parseInt(claseHasta) && (
                <p className="text-sm text-red-600 mt-2">
                  La clase inicial debe ser menor o igual a la clase final
                </p>
              )}
            </div>
          </div>
          )}

          {recordCount !== null && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
              <p className="text-gray-700">
                Registros a exportar: <span className="font-bold text-blue-600">{recordCount.toLocaleString('es-AR')}</span>
              </p>
            </div>
          )}

          {isLoading && exportProgress.percentage > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-blue-700 font-medium">
                  Descargando registros {exportProgress.current.toLocaleString('es-AR')} de {exportProgress.total.toLocaleString('es-AR')}
                </span>
                <span className="text-blue-600 font-bold">
                  {exportProgress.percentage}%
                </span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-blue-600 h-3 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${exportProgress.percentage}%` }}
                ></div>
              </div>
            </div>
          )}

          {message.text && (
            <div className={`flex items-center space-x-2 p-4 rounded-lg ${
              message.type === 'success'
                ? 'bg-green-50 border border-green-200'
                : 'bg-red-50 border border-red-200'
            }`}>
              {message.type === 'success' ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600" />
              )}
              <p className={message.type === 'success' ? 'text-green-700' : 'text-red-700'}>
                {message.text}
              </p>
            </div>
          )}

          <button
            onClick={handleExport}
            disabled={isLoading || recordCount === 0}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>
                  {exportProgress.percentage === 0 ? 'Preparando exportación...' :
                   exportProgress.percentage === 100 ? 'Generando archivo...' :
                   `Descargando datos... ${exportProgress.percentage}%`}
                </span>
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                <span>Exportar Padrón {isBasicMode ? '(Excel)' : '(CSV)'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
