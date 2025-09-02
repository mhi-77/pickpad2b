import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { User, AlertCircle, CheckCircle, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

/**
 * Componente FiscalesList - Lista compacta de usuarios tipo 3 y 4 (fiscales)
 * 
 * Propósito: Mostrar una lista de fiscales con capacidad de asignar/editar mesa
 * Permite actualizar el campo mesa_numero con validación y confirmación
 */
export default function FiscalesList() {
  // Estados para el manejo de datos
  const [fiscales, setFiscales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');
  
  // Estados para el modal de confirmación
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingUpdate, setPendingUpdate] = useState(null);
  
  // Estados para validación de mesas
  const [validMesas, setValidMesas] = useState(new Set());
  
  // Usuario actual para registrar quién hace las asignaciones
  const { user } = useAuth();

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
      alert(`La mesa ${newMesa} no existe en el sistema`);
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
        alert('Error al actualizar la asignación de mesa');
        
        // Revertir el valor en el input
        const input = document.querySelector(`input[data-fiscal-id="${pendingUpdate.fiscalId}"]`);
        if (input) {
          input.value = pendingUpdate.currentMesa || '';
        }
      } else {
        // Actualizar los datos localmente
        await fetchFiscales();
        alert('Mesa asignada correctamente');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error inesperado al actualizar mesa');
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
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">
          Lista de Fiscales ({fiscales.length})
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Usuarios tipo 3 (Gestores) y tipo 4 (Fiscales) con asignación de mesa
        </p>
      </div>

      {fiscales.length === 0 ? (
        <div className="p-6 text-center text-gray-500">
          <User className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No hay fiscales registrados</p>
        </div>
      ) : (
        <div className="p-4">
          <div className="space-y-3">
            {fiscales.map((fiscal) => (
              <div key={fiscal.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                {/* Primera fila */}
                <div className="grid grid-cols-2 gap-4 mb-2">
                  {/* Col 1: Círculo con letra + Nombre */}
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 ${getUserTypeColor(fiscal.usuario_tipo)} rounded-full flex items-center justify-center`}>
                      <span className="text-white font-bold text-sm">
                        {getUserTypeLetter(fiscal.usuario_tipo)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {fiscal.full_name}
                      </p>
                    </div>
                  </div>
                  
                  {/* Col 2: Input de Mesa */}
                  <div>
                    <input
                      type="number"
                      data-fiscal-id={fiscal.id}
                      defaultValue={fiscal.mesa_numero || ''}
                      onBlur={(e) => handleMesaBlur(fiscal.id, e.target.value)}
                      disabled={updating}
                      className="w-full px-3 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                      placeholder="Mesa"
                    />
                  </div>
                </div>

                {/* Segunda fila */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Col 1: Email */}
                  <div>
                    <p className="text-xs text-gray-500 truncate">
                      {fiscal.email}
                    </p>
                  </div>
                  
                  {/* Col 2: Establecimiento */}
                  <div>
                    <p className="text-xs text-gray-600">
                      {fiscal.mesas?.establecimientos?.nombre || ''}
                    </p>
                  </div>
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