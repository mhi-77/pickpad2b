import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../../lib/supabase';
import { User, AlertCircle, CheckCircle, X, Hash, Download, Upload } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Pagination from '../shared/Pagination';

export default function FiscalesList({ userTypes = [] }) {
  const [fiscales, setFiscales] = useState([]);
  const [allFiscales, setAllFiscales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingUpdate, setPendingUpdate] = useState(null);
  const [validMesas, setValidMesas] = useState(new Set());
  const [mesasData, setMesasData] = useState([]);
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState(null);
  const [stats, setStats] = useState({ total: 0, tipo3: 0, tipo4: 0 });
  const [mesaStats, setMesaStats] = useState({ total: 0, asignadas: 0, sinAsignar: 0 });
  const [showMesasModal, setShowMesasModal] = useState(false);
  const [fiscalesPorMesa, setFiscalesPorMesa] = useState(new Map());
  const [uploadResult, setUploadResult] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(() => {
    const saved = localStorage.getItem('fiscalesListPageSize');
    return saved ? Number(saved) : 25;
  });
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetchValidMesas();
    fetchAllFiscales();
  }, []);

  useEffect(() => {
    fetchFiscales();
  }, [currentPage, pageSize, activeFilter]);

  const fetchValidMesas = async () => {
    try {
      const { data, error } = await supabase
        .from('mesas')
        .select(`
          numero,
          total_fiscales_asignados,
          establecimientos (
            nombre,
            circuitos (
              localidad
            )
          )
        `)
        .order('numero', { ascending: true });

      if (!error && data) {
        const mesasSet = new Set(data.map(mesa => mesa.numero));
        setValidMesas(mesasSet);
        setMesasData(data);
      }
    } catch (error) {
      console.error('Error fetching valid mesas:', error);
    }
  };

  const fetchAllFiscales = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email, usuario_tipo, mesa_numero')
        .in('usuario_tipo', [3, 4]);

      if (!error && data) {
        setAllFiscales(data || []);
      }
    } catch (error) {
      console.error('Error fetching all fiscales:', error);
    }
  };

  const fetchFiscales = async () => {
    setLoading(true);
    setError('');
    try {
      let query = supabase
        .from('profiles')
        .select(`
          id,
          full_name,
          email,
          usuario_tipo,
          mesa_numero,
          mesas(
            numero,
            establecimientos(
              nombre
            )
          )
        `, { count: 'exact' })
        .in('usuario_tipo', [3, 4]);

      if (activeFilter === 'tipo3') {
        query = query.eq('usuario_tipo', 3).order('full_name', { ascending: true });
      } else if (activeFilter === 'tipo4') {
        query = query.eq('usuario_tipo', 4).order('full_name', { ascending: true });
      } else if (activeFilter === 'asignadas') {
        query = query.not('mesa_numero', 'is', null).order('mesa_numero', { ascending: true });
      } else if (activeFilter === 'sinAsignar') {
        query = query.is('mesa_numero', null).order('full_name', { ascending: true });
      } else {
        query = query.order('full_name', { ascending: true });
      }

      const from = (currentPage - 1) * pageSize;
      const to = from + pageSize - 1;

      const { data, error, count } = await query.range(from, to);

      if (error) {
        console.error('Error fetching fiscales:', error);
        setError('Error al cargar la lista de fiscales');
      } else {
        setFiscales(data || []);
        setTotalCount(count || 0);
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error inesperado al cargar fiscales');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (allFiscales.length > 0) {
      const total = allFiscales.length;
      const tipo3 = allFiscales.filter(f => f.usuario_tipo === 3).length;
      const tipo4 = allFiscales.filter(f => f.usuario_tipo === 4).length;
      setStats({ total, tipo3, tipo4 });
    }
  }, [allFiscales]);

  useEffect(() => {
    if (validMesas.size > 0 && allFiscales.length > 0) {
      const mesasAsignadasSet = new Set(
        allFiscales
          .map(f => f.mesa_numero)
          .filter(num => num != null && num !== '' && parseInt(num) > 0)
          .map(num => parseInt(num))
      );

      const total = validMesas.size;
      const asignadas = mesasAsignadasSet.size;
      const sinAsignar = total - asignadas;

      setMesaStats({ total, asignadas, sinAsignar });

      const conteo = new Map();
      allFiscales.forEach(f => {
        const num = f.mesa_numero;
        if (num != null && num !== '' && parseInt(num) > 0) {
          const numInt = parseInt(num);
          conteo.set(numInt, (conteo.get(numInt) || 0) + 1);
        }
      });
      setFiscalesPorMesa(conteo);
    }
  }, [allFiscales, validMesas]);

  const getUserTypeName = (tipo) => {
    const userType = userTypes.find(t => t.tipo === tipo);
    return userType ? userType.descripcion : `Tipo ${tipo}`;
  };

  const handleMesaBlur = (fiscalId, newMesaValue) => {
    const fiscal = fiscales.find(f => f.id === fiscalId);
    if (!fiscal) return;

    const currentMesa = fiscal.mesa_numero;
    const newMesa = newMesaValue.trim();

    if ((currentMesa || '').toString() === newMesa) return;

    const newMesaNum = parseInt(newMesa);
    if (newMesa && (!isNaN(newMesaNum) && newMesaNum > 0) && validMesas.has(newMesaNum)) {
      // válido
    } else if (newMesa === '') {
      // vacío permitido
    } else {
      alert(`❌ La mesa ${newMesa} no es válida`);
      const input = document.querySelector(`input[data-fiscal-id="${fiscalId}"]`);
      if (input) input.value = currentMesa || '';
      return;
    }

    setPendingUpdate({
      fiscalId,
      fiscalName: fiscal.full_name,
      currentMesa,
      newMesa: newMesa ? newMesaNum : null,
      newMesaDisplay: newMesa || 'Sin asignar'
    });
    setShowConfirmModal(true);
  };

  const handleConfirmUpdate = async () => {
    if (!pendingUpdate) return;
    setUpdating(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          mesa_numero: pendingUpdate.newMesa,
          asignada_por: user?.id || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', pendingUpdate.fiscalId);

      if (error) {
        console.error('Error updating mesa:', error);
        alert('❌ Error al actualizar la asignación de mesa');
        const input = document.querySelector(`input[data-fiscal-id="${pendingUpdate.fiscalId}"]`);
        if (input) input.value = pendingUpdate.currentMesa || '';
      } else {
        await fetchFiscales();
        await fetchAllFiscales();
        setSuccessMessage(`✅ Mesa ${pendingUpdate.newMesaDisplay} asignada a ${pendingUpdate.fiscalName}`);
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Error inesperado al actualizar mesa');
    } finally {
      setUpdating(false);
      setShowConfirmModal(false);
      setPendingUpdate(null);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
    setCurrentPage(1);
    localStorage.setItem('fiscalesListPageSize', newSize.toString());
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    setCurrentPage(1);
  };

  const handleCancelUpdate = () => {
    if (pendingUpdate) {
      const input = document.querySelector(`input[data-fiscal-id="${pendingUpdate.fiscalId}"]`);
      if (input) input.value = pendingUpdate.currentMesa || '';
    }
    setShowConfirmModal(false);
    setPendingUpdate(null);
  };

  const getUserTypeLetter = (tipo) => {
    return tipo === 3 ? 'G' : 'F';
  };

  const getUserTypeColor = (tipo) => {
    return tipo === 3 ? 'bg-orange-400' : 'bg-blue-400';
  };

  // --- Función de carga masiva desde CSV ---
  const handleCsvUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const csv = e.target.result;
      const lines = csv.split('\n');
      const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));

      if (!headers.includes('fiscal_id') || !headers.includes('mesa')) {
        alert('❌ El CSV debe tener las columnas: fiscal_id, mesa');
        return;
      }

      const mesaIndex = headers.indexOf('mesa');
      const idIndex = headers.indexOf('fiscal_id');

      const updates = [];
      const errors = [];

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const cols = line.split(',').map(col => col.trim().replace(/^"|"$/g, ''));
        const fiscalId = cols[idIndex];
        const mesaStr = cols[mesaIndex];

        if (!fiscalId) continue;

        let mesaNumero = null;
        if (mesaStr && !isNaN(mesaStr) && parseInt(mesaStr) > 0) {
          mesaNumero = parseInt(mesaStr);
        } else if (mesaStr && mesaStr !== '') {
          errors.push(`Mesa inválida: ${mesaStr} para fiscal ${fiscalId}`);
          continue;
        }

        if (mesaNumero !== null && !validMesas.has(mesaNumero)) {
          errors.push(`La mesa ${mesaNumero} no existe`);
          continue;
        }

        updates.push({ fiscalId, mesaNumero });
      }

      const confirmMsg = `¿Actualizar ${updates.length} asignaciones?\n\n${updates.slice(0, 10).map(u => `ID: ${u.fiscalId} → Mesa ${u.mesaNumero || 'Sin asignar'}`).join('\n')}${updates.length > 10 ? '\n...' : ''}`;
      if (!window.confirm(confirmMsg)) return;

      let updatedCount = 0;
      for (const update of updates) {
        const { error } = await supabase
          .from('profiles')
          .update({ 
            mesa_numero: update.mesaNumero,
            asignada_por: user?.id || null,
            updated_at: new Date().toISOString()
          })
          .eq('id', update.fiscalId);

        if (error) {
          errors.push(`Error al actualizar ${update.fiscalId}: ${error.message}`);
        } else {
          updatedCount++;
        }
      }

      setUploadResult({
        updated: updatedCount,
        errors: errors.length
      });

      await fetchFiscales();
      await fetchAllFiscales();
      event.target.value = null;
    };
    reader.readAsText(file);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-2">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Cargando fiscales...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-4">
        <div className="text-center py-12">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error</h3>
          <p className="text-red-600">{error}</p>
          <button
            onClick={fetchFiscales}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-2">
{/* Encabezado con botones de CSV */}
<div className="px-0 pt-0 pb-2 border-b border-gray-200">
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
    {/* Botón Descargar */}
    <button
      type="button"
      onClick={() => {
        const headers = ['fiscal_id', 'full_name', 'mesa'];
        const rows = allFiscales.map(f => [f.id, f.full_name, f.mesa_numero || '']);
        const csv = [
          headers.join(','),
          ...rows.map(r => r.map(field => `"${field}"`).join(','))
        ].join('\n');
        const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `plantilla_asignacion_mesas.csv`);
        link.click();
      }}
      className="flex items-center justify-center sm:justify-start space-x-2 px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
    >
      <Download className="w-4 h-4" />
      <span>Descargar CSV</span>
    </button>

    {/* Botón Cargar */}
    <button
      type="button"
      onClick={() => document.getElementById('csv-upload').click()}
      className="flex items-center justify-center sm:justify-start space-x-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
    >
      <Upload className="w-4 h-4" />
      <span>Cargar Asignaciones</span>
    </button>

    <input id="csv-upload" type="file" accept=".csv" onChange={handleCsvUpload} className="hidden" />
  </div>

  {uploadResult && (
    <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-800 text-center">
      ✅ {uploadResult.updated} actualizados • ❌ {uploadResult.errors} errores
    </div>
  )}
</div>

      {/* Botones de Fiscales */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 px-0 pt-2 pb-4">
        {/* Total */}
        <button
          type="button"
          onClick={() => handleFilterChange(null)}
          className={`bg-gray-50 rounded-lg border border-gray-200 p-2 text-left transition-all duration-200 ${
            activeFilter === null ? 'ring-2 ring-blue-500 bg-blue-50 bg-opacity-30' : 'hover:shadow-md'
          }`}
        >
          <div className="text-xs font-medium text-gray-700 text-center">Total Fiscales</div>
          <div className="flex items-center justify-center mt-1 space-x-1">
            <User className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-semibold text-gray-900">{stats.total}</span>
          </div>
        </button>

        {/* Tipo 3 */}
        {(() => {
          const tipo3Data = userTypes.find(t => t.tipo === 3);
          if (!tipo3Data) return null;
          return (
            <button
              type="button"
              onClick={() => handleFilterChange('tipo3')}
              className={`bg-gray-50 rounded-lg border border-gray-200 p-2 text-left transition-all duration-200 ${
                activeFilter === 'tipo3' ? 'ring-2 ring-blue-500 bg-blue-50 bg-opacity-30' : 'hover:shadow-md'
              }`}
            >
              <div className="text-xs font-medium text-gray-700 text-center">{tipo3Data.descripcion}</div>  
              <div className="flex items-center justify-center mt-1 space-x-1">
                <span className="w-5 h-5 bg-orange-400 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">G</span>
                </span>
                <span className="text-sm font-semibold text-gray-900">{stats.tipo3}</span>
              </div>
            </button>
          );
        })()}

        {/* Tipo 4 */}
        {(() => {
          const tipo4Data = userTypes.find(t => t.tipo === 4);
          if (!tipo4Data) return null;
          return (
            <button
              type="button"
              onClick={() => handleFilterChange('tipo4')}
              className={`bg-gray-50 rounded-lg border border-gray-200 p-2 text-left transition-all duration-200 ${
                activeFilter === 'tipo4' ? 'ring-2 ring-blue-400 bg-blue-50 bg-opacity-30' : 'hover:shadow-md'
              }`}
            >
              <div className="text-xs font-medium text-gray-700 text-center">{tipo4Data.descripcion}</div>
              <div className="flex items-center justify-center mt-1 space-x-1">
                <span className="w-5 h-5 bg-blue-400 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">F</span>
                </span>
                <span className="text-sm font-semibold text-gray-900">{stats.tipo4}</span>
              </div>
            </button>
          );
        })()}
      </div>

      {/* Botones de Mesas */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 px-0 pt-2 pb-4">
        {/* Total mesas */}
        <button
          type="button"
          onClick={() => setShowMesasModal(true)}
          className="bg-yellow-50 rounded-lg border border-gray-200 p-2 text-left hover:shadow-md transition-all duration-200"
        >
          <div className="text-xs font-medium text-gray-700 text-center">Total Mesas</div>
          <div className="flex items-center justify-center mt-1 space-x-1">
            <Hash className="h-4 w-4 text-gray-600" />
            <span className="text-sm font-semibold text-gray-900">{mesaStats.total}</span>
          </div>
        </button>

        {/* Asignadas */}
        <button
          type="button"
          onClick={() => handleFilterChange('asignadas')}
          className={`bg-yellow-50 rounded-lg border border-gray-200 p-2 text-left transition-all duration-200 ${
            activeFilter === 'asignadas' ? 'ring-2 ring-yellow-500 bg-yellow-50 bg-opacity-30' : 'hover:shadow-md'
          }`}
        >
          <div className="text-xs font-medium text-gray-700 text-center">Asignadas</div>
          <div className="flex items-center justify-center mt-1 space-x-1">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span className="text-sm font-semibold text-gray-900">{mesaStats.asignadas}</span>
          </div>
        </button>

        {/* Sin asignar */}
        <button
          type="button"
          onClick={() => handleFilterChange('sinAsignar')}
          className={`bg-yellow-50 rounded-lg border border-gray-200 p-2 text-left transition-all duration-200 ${
            activeFilter === 'sinAsignar' ? 'ring-2 ring-yellow-500 bg-yellow-50 bg-opacity-30' : 'hover:shadow-md'
          }`}
        >
          <div className="text-xs font-medium text-gray-700 text-center">Sin asignar</div>
          <div className="flex items-center justify-center mt-1 space-x-1">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <span className="text-sm font-semibold text-gray-900">{mesaStats.sinAsignar}</span>
          </div>
        </button>
      </div>

      {/* Feedback */}
      {successMessage && (
        <div className="px-0 py-2 bg-green-50 border-b border-green-200">
          <p className="text-sm text-green-800 text-center">{successMessage}</p>
        </div>
      )}

      {/* Lista */}
      {fiscales.length === 0 ? (
        <div className="p-4 text-center text-gray-500">
          <User className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No hay fiscales que coincidan con el filtro</p>
        </div>
      ) : (
        <div className="p-2">
          <div className="space-y-2">
            {fiscales.map((fiscal) => (
              <div key={fiscal.id} className="border border-gray-200 rounded-lg p-3 hover:shadow transition-shadow">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center space-x-3 flex-1">
                    <div className={`w-7 h-7 ${getUserTypeColor(fiscal.usuario_tipo)} rounded-full flex items-center justify-center flex-shrink-0`}>
                      <span className="text-white font-bold text-xs">{getUserTypeLetter(fiscal.usuario_tipo)}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">{fiscal.full_name}</p>
                    </div>
                  </div>
                  <div className="ml-4 w-28">
                    <input
                      type="number"
                      data-fiscal-id={fiscal.id}
                      defaultValue={fiscal.mesa_numero || ''}
                      onBlur={(e) => handleMesaBlur(fiscal.id, e.target.value)}
                      disabled={updating}
                      placeholder="Mesa"
                      className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 text-center"
                    />
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 text-xs text-gray-500">
                  <span className="truncate">{fiscal.email}</span>
                  <span className="hidden sm:block">•</span>
                  <span className="font-medium text-gray-700 truncate">
                    {fiscal.mesas?.establecimientos?.nombre || 'Sin establecimiento'}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Paginación */}
          {fiscales.length > 0 && (
            <div className="mt-2">
              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(totalCount / pageSize)}
                totalItems={totalCount}
                pageSize={pageSize}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
                loading={loading}
              />
            </div>
          )}
        </div>
      )}

      {/* Modal Mesas */}
      {showMesasModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-5 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Detalle de Mesas</h3>
              <button onClick={() => setShowMesasModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-2 py-2 text-left">Mesa</th>
                    <th className="px-2 py-2 text-left">Fiscales Asignados</th>
                    <th className="px-4 py-2 text-left">Establecimiento</th>
                    <th className="px-4 py-2 text-left">Localidad</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {mesasData.map(mesa => {
                    const asignados = fiscalesPorMesa.get(mesa.numero) || 0;
                    const establecimiento = mesa.establecimientos?.nombre || 'Sin establecimiento';
                    const localidad = mesa.establecimientos?.circuitos?.localidad || 'Sin localidad';
                    return (
                      <tr key={mesa.numero} className="hover:bg-gray-50">
                        <td className="px-4 py-2 font-medium">{mesa.numero}</td>
                        <td className="px-4 py-2">{asignados}</td>
                        <td className="px-4 py-2">{establecimiento}</td>
                        <td className="px-4 py-2">{localidad}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowMesasModal(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Confirmación */}
      {showConfirmModal && pendingUpdate && (
        <div
          onKeyDown={(e) => {
            if (e.key === 'Escape') handleCancelUpdate();
            if (e.key === 'Enter') handleConfirmUpdate();
          }}
          tabIndex={-1}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Confirmar Asignación</h3>
                </div>
              </div>
              <button
                onClick={handleCancelUpdate}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <p className="text-blue-800 font-medium mb-2">{pendingUpdate.fiscalName}</p>
                <p className="text-blue-700 text-sm">Mesa actual: {pendingUpdate.currentMesa || 'Sin asignar'}</p>
                <p className="text-blue-700 text-sm">Nueva mesa: {pendingUpdate.newMesaDisplay}</p>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleCancelUpdate}
                disabled={updating}
                className="flex-1 px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              
              <button
                onClick={handleConfirmUpdate}
                disabled={updating}
                className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {updating ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <CheckCircle className="w-5 h-5" />
                )}
                <span>Confirmar</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}