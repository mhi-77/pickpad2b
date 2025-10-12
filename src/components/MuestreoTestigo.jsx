import React, { useState, useEffect } from 'react';
import { ScanEye, Play, Square, AlertCircle, CheckCircle, X, Clock, Users, Calculator } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

/**
 * Componente MuestreoTestigo - Vista de muestreo para usuarios tipo 3 y 4
 * 
 * Propósito: Permite a los fiscales iniciar y finalizar controles de mesa,
 * registrar datos de pilas y votos, y ver sus propios registros de testigos.
 */
export default function MuestreoTestigo() {
  const { user } = useAuth();

  // Estados para los campos de entrada y cálculos
  const [pilaInicio, setPilaInicio] = useState('');
  const [pilaRetirada, setPilaRetirada] = useState('');
  const [pilaFaltante, setPilaFaltante] = useState(0);
  const [votosInicio, setVotosInicio] = useState(0);
  const [votosActuales, setVotosActuales] = useState(0);
  const [votosDiferencia, setVotosDiferencia] = useState(0);
  const [porcentajePilaFaltante, setPorcentajePilaFaltante] = useState(0);

  // Estados para el control de medición
  const [isMeasuring, setIsMeasuring] = useState(false);
  const [currentTestigoId, setCurrentTestigoId] = useState(null);
  const [userAt, setUserAt] = useState('');

  // Estados para modales y carga
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Estados para la lista de registros
  const [testigosRecords, setTestigosRecords] = useState([]);
  const [isLoadingRecords, setIsLoadingRecords] = useState(false);

  /**
   * Efecto para cargar registros al montar el componente
   */
  useEffect(() => {
    if (user?.mesa_numero) {
      fetchTestigosRecords();
    }
  }, [user?.mesa_numero]);

  /**
   * Efecto para calcular valores derivados cuando cambian los campos base
   */
  useEffect(() => {
    const inicio = parseInt(pilaInicio) || 0;
    const retirada = parseInt(pilaRetirada) || 0;
    const faltante = inicio - retirada;
    
    setPilaFaltante(faltante);
    
    if (votosDiferencia > 0) {
      setPorcentajePilaFaltante(((faltante / votosDiferencia) * 100).toFixed(1));
    } else {
      setPorcentajePilaFaltante(0);
    }
  }, [pilaInicio, pilaRetirada, votosDiferencia]);

  /**
   * Obtiene el conteo actual de votos emitidos en la mesa
   */
const fetchCurrentVoteCount = async () => {
  if (!user?.mesa_numero) return 0;

  try {
    const { data, error } = await supabase
      .from('mesas')
      .select('total_votaron', { head: true })
      .eq('numero', user.mesa_numero);

    if (error) {
      console.error('Error fetching vote count from mesas:', error);
      return 0;
    }

    return data?.length ? data[0].total_votaron || 0 : 0;
  } catch (error) {
    console.error('Error:', error);
    return 0;
  }
};
  /**
   * Obtiene los registros de testigos de la mesa del usuario
   */
  const fetchTestigosRecords = async () => {
    if (!user?.mesa_numero) return;

    setIsLoadingRecords(true);
    try {
      const { data, error } = await supabase
        .from('testigos')
        .select(`
          *,
          profiles!testigos_user_id_fkey(
            full_name
          )
        `)
        .eq('mesa_numero', user.mesa_numero)
        .order('user_at', { ascending: false });

      if (error) {
        console.error('Error fetching testigos records:', error);
        setError('Error al cargar registros de testigos');
      } else {
        setTestigosRecords(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error al cargar registros de testigos');
    } finally {
      setIsLoadingRecords(false);
    }
  };

  /**
   * Inicia un nuevo control de mesa
   */
const handleIniciarControl = async () => {
  if (!user?.mesa_numero) {
    setError('No tiene mesa asignada');
    return;
  }

  const pilaInicioNum = parseInt(pilaInicio);
  if (isNaN(pilaInicioNum) || pilaInicioNum <= 0) {
    setError('La pila inicial debe ser un número mayor a 0');
    return;
  }

  if (pilaInicioNum > 1000) {
    setError('La pila inicial parece demasiado alta (máx 1000)');
    return;
  }

  setIsLoading(true);
  setError('');

  try {
    const currentVotes = await fetchCurrentVoteCount();
    setVotosInicio(currentVotes);

    const now = new Date();
    const { data, error } = await supabase
      .from('testigos')
      .insert({
        mesa_numero: user.mesa_numero,
        pila_inicio: pilaInicioNum,
        votos_inicio: currentVotes,
        user_id: user.id,
        user_at: now.toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating testigo record:', error);
      // Mejor mensaje según error
      if (error.code === '23505') {
        setError('Ya existe un registro de inicio para esta medición');
      } else if (error.message.includes('new row violates row-level security')) {
        setError('No tiene permisos para registrar en esta mesa');
      } else {
        setError('Error al iniciar el control: ' + (error.message || 'Desconocido'));
      }
      return;
    }

    setCurrentTestigoId(data.id);
    setUserAt(now.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }));
    setIsMeasuring(true);
    setVotosInicio(currentVotes);

    // Resetear error y refrescar
    setError('');
    fetchTestigosRecords();

  } catch (err) {
    console.error('Error inesperado:', err);
    setError('Error inesperado al iniciar: ' + err.message);
  } finally {
    setIsLoading(false);
  }
};
  
  /**
   * Finaliza el control actual
   */
const handleFinalizarControl = async () => {
  if (!currentTestigoId) {
    setError('No hay un control en curso para finalizar');
    return;
  }

  const pilaRetiradaNum = parseInt(pilaRetirada);
  if (isNaN(pilaRetiradaNum) || pilaRetiradaNum < 0) {
    setError('La pila retirada debe ser un número válido (0 o más)');
    return;
  }

  const pilaInicioNum = parseInt(pilaInicio);
  if (pilaRetiradaNum > pilaInicioNum) {
    setError('La pila retirada no puede ser mayor que la pila inicial');
    return;
  }

  setIsLoading(true);
  setError('');

  try {
    const currentVotes = await fetchCurrentVoteCount();
    const diferencia = currentVotes - votosInicio;

    const faltante = pilaInicioNum - pilaRetiradaNum;

    const { error } = await supabase
      .from('testigos')
      .update({
        pila_inicio: pilaInicioNum,
        pila_faltante: faltante,
        votos_diferencia: diferencia,
        muestra_valida: true
      })
      .eq('id', currentTestigoId);

    if (error) {
      console.error('Error updating testigo record:', error);
      setError('Error al finalizar el control: ' + error.message);
      return;
    }

    // Resetear todo
    setIsMeasuring(false);
    setCurrentTestigoId(null);
    setShowConfirmModal(false);
    setPilaInicio('');
    setPilaRetirada('');
    setUserAt('');
    setVotosDiferencia(0);
    setPorcentajePilaFaltante(0);

    fetchTestigosRecords();

  } catch (err) {
    console.error('Error:', err);
    setError('Error al finalizar el control');
  } finally {
    setIsLoading(false);
  }
};
  
  /**
   * Actualiza el estado de muestra_valida de un registro
   */
  const handleToggleMuestraValida = async (testigoId, newValue) => {
    try {
      const { error } = await supabase
        .from('testigos')
        .update({ muestra_valida: newValue })
        .eq('id', testigoId);

      if (error) {
        console.error('Error updating muestra_valida:', error);
        alert('Error al actualizar el estado de la muestra');
        return;
      }

      // Actualizar estado local
      setTestigosRecords(prev => 
        prev.map(record => 
          record.id === testigoId 
            ? { ...record, muestra_valida: newValue }
            : record
        )
      );

    } catch (error) {
      console.error('Error:', error);
      alert('Error al actualizar el estado de la muestra');
    }
  };

  /**
   * Formatea fecha y hora para mostrar
   */
  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('es-AR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      //second: '2-digit'
    });
  };

  // Verificar permisos
  if (!user || user.usuario_tipo > 4) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="text-center py-12">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Sin permisos</h3>
          <p className="text-red-600">No tiene permisos para acceder al muestreo</p>
        </div>
      </div>
    );
  }

  // Verificar mesa asignada
  if (!user.mesa_numero) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="text-center py-12">
          <AlertCircle className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Mesa no asignada</h3>
          <p className="text-yellow-600">No tiene mesa asignada para realizar muestreo</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Panel de control principal */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              Control de Mesa N° {user.mesa_numero}
            </h3>
            <p className="text-gray-600 mt-1">
              {isMeasuring ? 'Medición en curso' : 'Listo para iniciar medición'}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${isMeasuring ? 'bg-green-500' : 'bg-gray-400'}`}></div>
            <span className="text-sm text-gray-600">
              {isMeasuring ? 'Activo' : 'Inactivo'}
            </span>
          </div>
        </div>

        {/* Sección: Cantidad de boletas */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Cantidad de boletas</h4>
          
          {/* Primera línea: Pila ingresada, Pila retirada, Faltante */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pila ingresada
              </label>
              <input
                type="number"
                value={pilaInicio}
                onChange={(e) => setPilaInicio(e.target.value)}
                disabled={isMeasuring}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 disabled:bg-gray-100"
                placeholder="0"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pila retirada
              </label>
              <input
                type="number"
                value={pilaRetirada}
                onChange={(e) => setPilaRetirada(e.target.value)}
                disabled={!isMeasuring}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 disabled:bg-gray-100"
                placeholder="0"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Faltante
              </label>
              <div className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-gray-100 text-gray-700 font-medium">
                {pilaFaltante}
              </div>
            </div>
          </div>

          {/* Segunda línea: Votantes desde las X, Votaron, Porcentaje */}
          <div className="grid grid-cols-3 gap-4">
            <div className="flex items-center">
              <Clock className="w-4 h-4 text-gray-500 mr-2" />
              <span className="text-sm text-gray-700">
                Votantes desde las {userAt || '--:--'}
              </span>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Votaron
              </label>
              <div className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-gray-100 text-gray-700 font-medium flex items-center">
                <Users className="w-4 h-4 mr-2" />
                {votosDiferencia}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Porcentaje
              </label>
              <div className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-gray-100 text-gray-700 font-medium flex items-center">
                <Calculator className="w-4 h-4 mr-2" />
                {porcentajePilaFaltante}%
              </div>
            </div>
          </div>
        </div>

        {/* Botón de control */}
        <div className="flex justify-center">
          <button
            onClick={isMeasuring ? () => setShowConfirmModal(true) : handleIniciarControl}
            disabled={isLoading}
            className={`flex items-center space-x-2 px-8 py-3 rounded-lg font-medium transition-all duration-200 ${
              isMeasuring
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-green-600 hover:bg-green-700 text-white'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : isMeasuring ? (
              <Square className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5" />
            )}
            <span>{isMeasuring ? 'FINALIZAR' : 'INICIAR CONTROL'}</span>
          </button>
        </div>

        {/* Mensaje de error */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}
      </div>

      {/* Lista de registros de testigos */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">
            Registros de Mesa N° {user.mesa_numero}
          </h3>
          <span className="text-sm text-gray-600">
            {testigosRecords.length} registro{testigosRecords.length !== 1 ? 's' : ''}
          </span>
        </div>

        {isLoadingRecords ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Cargando registros...</p>
          </div>
        ) : testigosRecords.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <ScanEye className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No hay registros de testigos para esta mesa</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mesa
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha/Hora
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuario
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pila Faltante
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Porcentaje
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Muestra Válida
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {testigosRecords.map((record) => {
                  const porcentaje = record.votos_diferencia > 0 
                    ? ((record.pila_faltante / record.votos_diferencia) * 100).toFixed(1)
                    : '0.0';
                  
                  return (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        Mesa {record.mesa_numero}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDateTime(record.user_at)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.profiles?.full_name || 'N/A'}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.pila_faltante || 0}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          parseFloat(porcentaje) > 5 ? 'bg-red-100 text-red-800' :
                          parseFloat(porcentaje) > 2 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {porcentaje}%
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-center">
                        <input
                          type="checkbox"
                          checked={record.muestra_valida || false}
                          onChange={(e) => handleToggleMuestraValida(record.id, e.target.checked)}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de confirmación para finalizar */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Finalizar Control
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <p className="text-yellow-800 font-medium mb-2">
                  ⚠️ ¿Está seguro de finalizar la medición?
                </p>
                <p className="text-yellow-700 text-sm">
                  Esta acción registrará los datos finales y no se podrá deshacer.
                </p>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancelar
              </button>
              
              <button
                onClick={handleFinalizarControl}
                disabled={isLoading}
                className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {isLoading ? (
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