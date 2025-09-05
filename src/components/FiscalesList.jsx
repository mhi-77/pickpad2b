import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { User, AlertCircle, CheckCircle, X, Hash } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

/**
 * Componente FiscalesList - Lista compacta de usuarios tipo 3 y 4 (fiscales)
 * 
 * Propósito: Mostrar una lista de fiscales con capacidad de asignar/editar mesa
 * Permite actualizar el campo mesa_numero con validación y confirmación
 * Incluye filtros por tipo, descarga de CSV y estadísticas de mesas.
 */
export default function FiscalesList({ userTypes = [] }) {
  // Estados para el manejo de datos
  const [fiscales, setFiscales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');
  
  // Estado para feedback inmediato
  const [successMessage, setSuccessMessage] = useState('');

  // Estados para el modal de confirmación
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingUpdate, setPendingUpdate] = useState(null);
  
  // Estados para validación de mesas
  const [validMesas, setValidMesas] = useState(new Set());
  
  // Usuario actual para registrar quién hace las asignaciones
  const { user } = useAuth();

  // Estado para filtro por tipo de fiscal
  const [filterTipo, setFilterTipo] = useState(null); // null = todos, 3 o 4
  const [stats, setStats] = useState({ total: 0, tipo3: 0, tipo4: 0 });

  // Estado para estadísticas de mesas
  const [mesaStats, setMesaStats] = useState({ total: 0, asignadas: 0, sinAsignar: 0 });

  useEffect(() => {
    fetchFiscales();
    fetchValidMesas();
  }, []);

  /**
   * Obtiene la lista de mesas válidas para validación
   */
  const fetchValidMesas = async () => {
    try {
      const { data, error } = await supabase
        .from('mesas')
        .select('numero');

      if (!error && data) {
        const mesasSet = new Set(data.map(mesa => mesa.numero));
        setValidMesas(mesasSet);
      }
    } catch (error) {
      console.error('Error fetching valid mesas:', error);
    }
  };

  /**
   * Obtiene la lista de fiscales (usuarios tipo 3 y 4) con sus datos relacionados
   */
  const fetchFiscales = async () => {
    setLoading(true);
    setError('');
    
    try {
      const { data, error } = await supabase
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
        `)
        .in('usuario_tipo', [3, 4])
        .order('full_name', { ascending: true });

      if (error) {
        console.error('Error fetching fiscales:', error);
        setError('Error al cargar la lista de fiscales');
      } else {
        setFiscales(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error inesperado al cargar fiscales');
    } finally {
      setLoading(false);
    }
  };

  // Calcular estadísticas de fiscales
  useEffect(() => {
    if (fiscales.length > 0) {
      const total = fiscales.length;
      const tipo3 = fiscales.filter(f => f.usuario_tipo === 3).length;
      const tipo4 = fiscales.filter(f => f.usuario_tipo === 4).length;
      setStats({ total, tipo3, tipo4 });
    }
  }, [fiscales]);

  // Calcular estadísticas de mesas
  useEffect(() => {
    if (validMesas.size > 0 && fiscales.length > 0) {
      // Mesas asignadas: conjunto único de mesa_numero que existen en validMesas
      const mesasAsignadasSet = new Set(
        fiscales
          .map(f => f.mesa_numero)
          .filter(numero => numero !== null && numero !== undefined && validMesas.has(parseInt(numero)))
      );

      const total = validMesas.size;
      const asignadas = mesasAsignadasSet.size;
      const sinAsignar = total - asignadas;

      setMesaStats({ total, asignadas, sinAsignar });
    }
  }, [fiscales, validMesas]);

  // Aplicar filtro
  const filteredFiscales = filterTipo 
    ? fiscales.filter(f => f.usuario_tipo === filterTipo) 
    : fiscales;

  /**
   * Obtiene el nombre descriptivo del tipo de usuario
   */
  const getUserTypeName = (tipo) => {
    const userType = userTypes.find(t => t.tipo === tipo);
    return userType ? userType.descripcion : `Tipo ${tipo}`;
  };

  /**
   * Maneja el cambio en el campo de mesa cuando pierde el foco
   */
  const handleMesaBlur = (fiscalId, newMesaValue) => {
    const fiscal = fiscales.find(f => f.id === fiscalId);
    if (!fiscal) return;

    const currentMesa = fiscal.mesa_numero;
    const newMesa = newMesaValue.trim();

    // Si no hay cambios, no hacer nada
    if ((currentMesa || '').toString() === newMesa) {
      return;
    }

    // Validar si la nueva mesa es válida (si no está vacía)
    if (newMesa && !validMesas.has(parseInt(newMesa))) {
      alert(`❌ La mesa ${newMesa} no existe en el sistema`);
      // Revertir el valor en el input
      const input = document.querySelector(`input[data-fiscal-id="${fiscalId}"]`);
      if (input) {
        input.value = currentMesa || '';
      }
      return;
    }

    // Preparar la actualización pendiente
    setPendingUpdate({
      fiscalId,
      fiscalName: fiscal.full_name,
      currentMesa,
      newMesa: newMesa || null,
      newMesaDisplay: newMesa || 'Sin asignar'
    });
    
    setShowConfirmModal(true);
  };

  /**
   * Confirma y ejecuta la actualización de mesa
   */
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
        
        // Revertir el valor en el input
        const input = document.querySelector(`input[data-fiscal-id="${pendingUpdate.fiscalId}"]`);
        if (input) {
          input.value = pendingUpdate.currentMesa || '';
        }
      } else {
        // Actualizar los datos localmente
        await fetchFiscales();
        // ✅ Feedback inmediato en pantalla
        setSuccessMessage(`✅ Mesa ${pendingUpdate.newMesaDisplay} asignada a ${pendingUpdate.fiscalName}`);
        setTimeout(() => setSuccessMessage(''), 3000); // desaparece a los 3s
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

  /**
   * Cancela la actualización pendiente
   */
  const handleCancelUpdate = () => {
    if (pendingUpdate) {
      // Revertir el valor en el input
      const input = document.querySelector(`input[data-fiscal-id="${pendingUpdate.fiscalId}"]`);
      if (input) {
        input.value = pendingUpdate.currentMesa || '';
      }
    }
    
    setShowConfirmModal(false);
    setPendingUpdate(null);
  };

  /**
   * Obtiene la letra para mostrar en el círculo según el tipo de usuario
   */
  const getUserTypeLetter = (tipo) => {
    return tipo === 3 ? 'G' : 'F'; // G para tipo 3, F para tipo 4
  };

  /**
   * Obtiene el color del círculo según el tipo de usuario
   */
  const getUserTypeColor = (tipo) => {
    return tipo === 3 ? 'bg-green-600' : 'bg-blue-600';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Cargando fiscales...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
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
    <div className="bg-white rounded-xl shadow-lg">
      {/* Encabezado */}
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">
          Lista de Fiscales ({fiscales.length})
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Usuarios tipo 3 y tipo 4 con asignación de mesa
        </p>
      </div>

      {/* Estadísticas de fiscales */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 px-6 pt-4 pb-2">
        {/* Total */}
        <button
          type="button"
          onClick={() => setFilterTipo(null)}
          title="Mostrar todos los fiscales"
          className={`bg-white rounded-lg shadow p-3 text-left transition-all duration-200 ${
            filterTipo === null
              ? 'ring-2 ring-blue-500 bg-blue-50'
              : 'hover:shadow-md hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center">
            <User className="h-5 w-5 text-blue-600" />
            <div className="ml-2">
              <p className="text-xs font-medium text-gray-500">Total</p>
              <p className="text-base font-semibold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </button>

        {/* Tipo 3 */}
        {(() => {
          const tipo3Data = userTypes.find(t => t.tipo === 3);
          if (!tipo3Data) return null;

          return (
            <button
              type="button"
              onClick={() => setFilterTipo(3)}
              title={`Mostrar solo ${tipo3Data.descripcion}`}
              className={`bg-white rounded-lg shadow p-3 text-left transition-all duration-200 ${
                filterTipo === 3
                  ? 'ring-2 ring-green-500 bg-green-50'
                  : 'hover:shadow-md hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center">
                <span className="w-5 h-5 bg-green-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">G</span>
                </span>
                <div className="ml-2">
                  <p className="text-xs font-medium text-gray-500 truncate">
                    {tipo3Data.descripcion}
                  </p>
                  <p className="text-base font-semibold text-gray-900">{stats.tipo3}</p>
                </div>
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
              onClick={() => setFilterTipo(4)}
              title={`Mostrar solo ${tipo4Data.descripcion}`}
              className={`bg-white rounded-lg shadow p-3 text-left transition-all duration-200 ${
                filterTipo === 4
                  ? 'ring-2 ring-blue-500 bg-blue-50'
                  : 'hover:shadow-md hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center">
                <span className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">F</span>
                </span>
                <div className="ml-2">
                  <p className="text-xs font-medium text-gray-500 truncate">
                    {tipo4Data.descripcion}
                  </p>
                  <p className="text-base font-semibold text-gray-900">{stats.tipo4}</p>
                </div>
              </div>
            </button>
          );
        })()}
      </div>

      {/* Estadísticas de mesas */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 px-6 pt-2 pb-4">
        {/* Total mesas */}
        <div className="bg-white rounded-lg shadow p-3 text-left">
          <div className="flex items-center">
            <Hash className="h-5 w-5 text-gray-600" />
            <div className="ml-2">
              <p className="text-xs font-medium text-gray-500">Total mesas</p>
              <p className="text-base font-semibold text-gray-900">{mesaStats.total}</p>
            </div>
          </div>
        </div>

        {/* Mesas asignadas */}
        <div className="bg-white rounded-lg shadow p-3 text-left">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <div className="ml-2">
              <p className="text-xs font-medium text-gray-500">Asignadas</p>
              <p className="text-base font-semibold text-gray-900">{mesaStats.asignadas}</p>
            </div>
          </div>
        </div>

        {/* Mesas sin asignar */}
        <div className="bg-white rounded-lg shadow p-3 text-left">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-yellow-600" />
            <div className="ml-2">
              <p className="text-xs font-medium text-gray-500">Sin asignar</p>
              <p className="text-base font-semibold text-gray-900">{mesaStats.sinAsignar}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Botón Descargar CSV */}
      <div className="px-6 pb-4">
        <button
          type="button"
          onClick={() => {
            const headers = ['fiscal_id', 'full_name', 'mesa'];
            const rows = fiscales.map(f => [
              f.id,
              f.full_name,
              f.mesa_numero || ''
            ]);
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
          className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center space-x-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V16a2 2 0 01-2 2z" />
          </svg>
          <span>Descargar Plantilla CSV</span>
        </button>
      </div>

      {/* Feedback de éxito */}
      {successMessage && (
        <div className="px-6 py-2 bg-green-50 border-b border-green-200">
          <p className="text-sm text-green-800 text-center">
            {successMessage}
          </p>
        </div>
      )}

      {/* Lista */}
      {filteredFiscales.length === 0 ? (
        <div className="p-6 text-center text-gray-500">
          <User className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No hay fiscales que coincidan con el filtro</p>
        </div>
      ) : (
        <div className="p-3">
          <div className="space-y-2">
            {filteredFiscales.map((fiscal) => (
              <div 
                key={fiscal.id} 
                className="border border-gray-200 rounded-lg p-3 hover:shadow transition-shadow"
              >
                {/* Fila 1: Nombre y Mesa */}
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center space-x-3 flex-1">
                    {/* Círculo tipo */}
                    <div className={`w-7 h-7 ${getUserTypeColor(fiscal.usuario_tipo)} rounded-full flex items-center justify-center flex-shrink-0`}>
                      <span className="text-white font-bold text-xs">
                        {getUserTypeLetter(fiscal.usuario_tipo)}
                      </span>
                    </div>
                    {/* Nombre */}
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {fiscal.full_name}
                      </p>
                    </div>
                  </div>

                  {/* Input Mesa - destacado */}
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

                {/* Fila 2: Email y Establecimiento */}
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
        </div>
      )}

      {/* Modal de confirmación */}
      {showConfirmModal && pendingUpdate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Confirmar Asignación
                  </h3>
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
                <p className="text-blue-800 font-medium mb-2">
                  {pendingUpdate.fiscalName}
                </p>
                <p className="text-blue-700 text-sm">
                  Mesa actual: {pendingUpdate.currentMesa || 'Sin asignar'}
                </p>
                <p className="text-blue-700 text-sm">
                  Nueva mesa: {pendingUpdate.newMesaDisplay}
                </p>
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