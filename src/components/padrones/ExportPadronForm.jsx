import React, { useState, useEffect } from 'react';
import { Download, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import {
  processBasicData,
  processCompleteData,
  convertToCSV,
  downloadFile,
  generateFileName
} from '../../utils/exportUtils';

export default function ExportPadronForm() {
  const [format, setFormat] = useState('csv');
  const [isBasicMode, setIsBasicMode] = useState(false);
  const [voteStatus, setVoteStatus] = useState('all');
  const [selectedEmopick, setSelectedEmopick] = useState('all');
  const [votoObligatorio, setVotoObligatorio] = useState('all');
  const [selectedLocalidad, setSelectedLocalidad] = useState('all');

  const [emopicks, setEmopicks] = useState([]);
  const [localidades, setLocalidades] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [recordCount, setRecordCount] = useState(null);

  useEffect(() => {
    loadEmopicks();
    loadLocalidades();
  }, []);

  useEffect(() => {
    loadRecordCount();
  }, [voteStatus, selectedEmopick, votoObligatorio, selectedLocalidad]);

  const loadEmopicks = async () => {
    try {
      const { data, error } = await supabase
        .from('emopicks')
        .select('id, display')
        .order('display');

      if (error) throw error;
      setEmopicks(data || []);
    } catch (error) {
      console.error('Error loading emopicks:', error);
    }
  };

  const loadLocalidades = async () => {
    try {
      const { data, error } = await supabase
        .from('circuitos')
        .select('localidad')
        .not('localidad', 'is', null)
        .order('localidad');

      if (error) throw error;
      const uniqueLocalities = [...new Set(data.map(item => item.localidad))];
      setLocalidades(uniqueLocalities);
    } catch (error) {
      console.error('Error loading localidades:', error);
    }
  };

  const loadRecordCount = async () => {
    try {
      if (selectedLocalidad !== 'all') {
        const data = await fetchPadronData();
        setRecordCount(data.length);
      } else {
        let query = supabase
          .from('padron')
          .select('documento', { count: 'exact', head: true });

        query = applyFilters(query);

        const { count, error } = await query;

        if (error) throw error;
        setRecordCount(count);
      }
    } catch (error) {
      console.error('Error loading record count:', error);
      setRecordCount(null);
    }
  };

  const applyFilters = (query) => {
    if (voteStatus === 'voted') {
      query = query.eq('voto_emitido', true);
    } else if (voteStatus === 'not_voted') {
      query = query.eq('voto_emitido', false);
    }

    if (selectedEmopick !== 'all') {
      query = query.eq('emopick_id', parseInt(selectedEmopick));
    }

    if (votoObligatorio === 'true') {
      query = query.eq('da_voto_obligatorio', true);
    } else if (votoObligatorio === 'false') {
      query = query.eq('da_voto_obligatorio', false);
    }

    return query;
  };

  const filterByLocalidad = (data) => {
    if (selectedLocalidad === 'all') return data;
    return data.filter(record =>
      record.mesas?.establecimientos?.circuitos?.localidad === selectedLocalidad
    );
  };

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

  const handleExport = async () => {
    if (recordCount === 0) {
      setMessage({
        type: 'error',
        text: 'No hay registros para exportar con los filtros aplicados'
      });
      return;
    }

    if (recordCount > 50000) {
      const confirm = window.confirm(
        `Se exportarán ${recordCount} registros. Esto puede tomar tiempo. ¿Desea continuar?`
      );
      if (!confirm) return;
    }

    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      let rawData = await fetchPadronData();
      rawData = filterByLocalidad(rawData);

      const processedData = isBasicMode
        ? processBasicData(rawData)
        : processCompleteData(rawData);

      if (format === 'csv') {
        await exportToCSV(processedData);
      } else if (format === 'xlsx') {
        await exportToExcel(processedData);
      } else if (format === 'pdf') {
        setMessage({
          type: 'error',
          text: 'Formato PDF no disponible. Use CSV o Excel.'
        });
        return;
      }

      setMessage({
        type: 'success',
        text: `Se exportaron ${processedData.length} registros correctamente`
      });
    } catch (error) {
      console.error('Error exporting data:', error);
      setMessage({
        type: 'error',
        text: 'Error al exportar los datos. Intente nuevamente.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const exportToCSV = async (data) => {
    const csvContent = convertToCSV(data);
    const filename = generateFileName('csv', isBasicMode);
    downloadFile(csvContent, filename, 'text/csv;charset=utf-8;');
  };

  const exportToExcel = async (data) => {
    const csvContent = convertToCSV(data);
    const filename = generateFileName('xls', isBasicMode);
    downloadFile(csvContent, filename, 'application/vnd.ms-excel;charset=utf-8;');
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
                Modo Info Básica
              </label>
            </div>
            <p className="text-sm text-blue-700 mt-2 ml-7">
              Exportar solo: Documento, Apellido, Nombre, Sexo, Clase, Domicilio y Mesa
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Formato de Exportación
              </label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="csv">CSV</option>
                <option value="xlsx">Excel (XLS)</option>
              </select>
            </div>

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
                Estado Emocional
              </label>
              <select
                value={selectedEmopick}
                onChange={(e) => setSelectedEmopick(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Todos</option>
                {emopicks.map(emopick => (
                  <option key={emopick.id} value={emopick.id}>
                    {emopick.display}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Voto Obligatorio
              </label>
              <select
                value={votoObligatorio}
                onChange={(e) => setVotoObligatorio(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Todos</option>
                <option value="true">Sí</option>
                <option value="false">No</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Localidad
              </label>
              <select
                value={selectedLocalidad}
                onChange={(e) => setSelectedLocalidad(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Todas</option>
                {localidades.map(localidad => (
                  <option key={localidad} value={localidad}>
                    {localidad}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {recordCount !== null && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
              <p className="text-gray-700">
                Registros a exportar: <span className="font-bold text-blue-600">{recordCount.toLocaleString('es-AR')}</span>
              </p>
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
            className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Generando archivo...</span>
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                <span>Exportar Padrón</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
