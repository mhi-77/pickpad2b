import React, { useState, useEffect } from 'react';
import { AlertCircle, Users, CheckCircle, Clock, ChevronRight, BarChart3, TrendingUp, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import FiscalizarSearchForm from './fiscalizar/FiscalizarSearchForm';
import FiscalizarResults from './fiscalizar/FiscalizarResults';
import {
  calcularTendenciaProyectada,
  calcularAsistenciaActual,
  obtenerAsistenciaHistorica,
  obtenerHoraFormateada,
  obtenerColorTendencia,
  obtenerIndiceHistorico
} from '../utils/tendenciaParticipacion';

/**
 * Componente FiscalizarView - Vista principal para la fiscalización electoral
 * 
 * Propósito: Permite a los fiscales (usuarios con tipo 3 o 4) gestionar el proceso
 * de votación en su mesa asignada. Incluye búsqueda de votantes, marcado de votos
 * y estadísticas en tiempo real.
 * 
 * Funcionalidades:
 * - Carga de datos del padrón de la mesa asignada
 * - Búsqueda de votantes por documento
 * - Marcado de votos emitidos
 * - Estadísticas de participación
 */
export default function FiscalizarView() {
  // Obtener datos del usuario autenticado
  const { user } = useAuth();
  
  // Estados para el manejo de datos y UI
  // Datos completos del padrón de la mesa
  const [padronData, setPadronData] = useState([]);
  // Datos filtrados según la búsqueda actual
  const [filteredData, setFilteredData] = useState([]);
  // Estado de carga para búsquedas
  const [isLoading, setIsLoading] = useState(false);
  // Estado de carga para actualizaciones de votos
  const [isUpdating, setIsUpdating] = useState(false);
  // Mensajes de error
  const [error, setError] = useState('');
  // Control del modal de éxito
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  // Control del modal de participación
  const [showParticipacionModal, setShowParticipacionModal] = useState(false);
  // Métricas de participación calculadas
  const [metricasParticipacion, setMetricasParticipacion] = useState({
    asistenciaHistorica: null,
    asistenciaActual: 0,
    tendenciaProyectada: null,
    horaCalculo: '',
    antesDeLas9: false
  });

  /**
   * Efecto para cargar los datos del padrón cuando el perfil esté disponible
   * Se ejecuta cuando se obtiene el número de mesa del usuario
   */
  useEffect(() => {
    if (user?.mesa_numero) {
      handleSearch(''); // Cargar todos los registros de la mesa asignada
    }
  }, [user?.mesa_numero]);

  /**
   * Maneja la búsqueda de votantes en el padrón de la mesa
   * Busca por número de orden si el valor es < 10000, de lo contrario por documento
   *
   * @param {string} documento - Número de documento u orden a buscar (vacío para todos)
   */
  const handleSearch = async (documento) => {
    if (!user?.mesa_numero) {
      setError('No se ha cargado la información de la mesa');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      // Construir consulta base para la mesa asignada
      let query = supabase
        .from('padron')
        .select(`
          *,
          emopicks(
            id,
            display
          ),
          voto_pick_user_profile:profiles!padron_voto_pick_user_fkey(
            full_name
          )
        `)
        .eq('mesa_numero', user.mesa_numero)
        .order('orden', { ascending: true });

      if (documento.trim()) {
        // Si se proporciona un número, determinar si es búsqueda por orden o documento
        const number = parseInt(documento.trim());
        if (!isNaN(number)) {
          // Si el número es menor a 10000, buscar por orden
          // De lo contrario, buscar por documento
          if (number < 10000) {
            query = query.eq('orden', number);
          } else {
            query = query.eq('documento', number);
          }
        }
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error searching padron:', error);
        setError('Error al buscar en el padrón');
        setFilteredData([]);
        return;
      }

      setFilteredData(data || []);
      
      // Si es búsqueda general (sin documento específico), actualizar datos completos
      if (!documento.trim()) {
        setPadronData(data || []);
      }
    } catch (error) {
      console.error('Error during search:', error);
      setError('Error al buscar en el padrón');
      setFilteredData([]);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Marca un voto como emitido en la base de datos
   * 
   * @param {number} documento - Número de documento del votante
   */
  const handleMarcarVoto = async (documento) => {
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('padron')
        .update({
          voto_emitido: true,
          voto_pick_at: new Date().toISOString(),
          voto_pick_user: user.id
        })
        .eq('documento', documento)
        .eq('mesa_numero', user.mesa_numero);

      if (error) {
        console.error('Error updating vote:', error);
        alert('Error al registrar el voto');
        return;
      }

      const updatedPadron = padronData.map(record =>
        record.documento === documento
          ? {
              ...record,
              voto_emitido: true,
              voto_pick_at: new Date().toISOString(),
              voto_pick_user: user.id,
              voto_pick_user_profile: {
                full_name: user.name
              }
            }
          : record
      );

      if (padronData.length > 0) {
        setPadronData(updatedPadron);
      }

      const updatedFiltered = filteredData.map(record =>
        record.documento === documento
          ? {
              ...record,
              voto_emitido: true,
              voto_pick_at: new Date().toISOString(),
              voto_pick_user: user.id,
              voto_pick_user_profile: {
                full_name: user.name
              }
            }
          : record
      );

      setFilteredData(updatedFiltered);
      setShowSuccessModal(true);

    } catch (error) {
      console.error('Error marking vote:', error);
      alert('Error al registrar el voto');
    } finally {
      setIsUpdating(false);
    }
  };

  /**
   * Abre el modal de estadísticas de participación
   */
  const handleOpenParticipacionModal = () => {
    setShowParticipacionModal(true);
  };

  /**
   * Cierra el modal de estadísticas de participación
   */
  const handleCloseParticipacionModal = () => {
    setShowParticipacionModal(false);
  };

  const handleDeshacerVoto = async (documento) => {
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('padron')
        .update({
          voto_emitido: false,
          voto_pick_at: null,
          voto_pick_user: null
        })
        .eq('documento', documento)
        .eq('mesa_numero', user.mesa_numero);

      if (error) {
        console.error('Error undoing vote:', error);
        alert('Error al deshacer el voto');
        return;
      }

      const updatedPadron = padronData.map(record =>
        record.documento === documento
          ? {
              ...record,
              voto_emitido: false,
              voto_pick_at: null,
              voto_pick_user: null,
              voto_pick_user_profile: null
            }
          : record
      );

      if (padronData.length > 0) {
        setPadronData(updatedPadron);
      }

      const updatedFiltered = filteredData.map(record =>
        record.documento === documento
          ? {
              ...record,
              voto_emitido: false,
              voto_pick_at: null,
              voto_pick_user: null,
              voto_pick_user_profile: null
            }
          : record
      );

      setFilteredData(updatedFiltered);

    } catch (error) {
      console.error('Error undoing vote:', error);
      alert('Error al deshacer el voto');
    } finally {
      setIsUpdating(false);
    }
  };

  // Calcular estadísticas de participación en tiempo real
  const totalEmpadronados = padronData.length;
  const totalVotaron = padronData.filter(record => record.voto_emitido).length;
  const pendientes = totalEmpadronados - totalVotaron;
  const porcentajeParticipacion = totalEmpadronados > 0 ? ((totalVotaron / totalEmpadronados) * 100).toFixed(1) : 0;

  useEffect(() => {
    if (totalEmpadronados > 0) {
      calcularMetricasParticipacion();
    }
  }, [totalVotaron, totalEmpadronados]);

  const calcularMetricasParticipacion = () => {
    const ahora = new Date();
    const indiceHistorico = obtenerIndiceHistorico(ahora);

    if (!indiceHistorico) {
      setMetricasParticipacion({
        asistenciaHistorica: null,
        asistenciaActual: calcularAsistenciaActual(totalVotaron, totalEmpadronados),
        tendenciaProyectada: null,
        horaCalculo: obtenerHoraFormateada(ahora),
        antesDeLas9: true
      });
      return;
    }

    const asistenciaHistorica = obtenerAsistenciaHistorica(ahora);
    const asistenciaActual = calcularAsistenciaActual(totalVotaron, totalEmpadronados);
    const tendenciaProyectada = calcularTendenciaProyectada(totalVotaron, totalEmpadronados, ahora);

    setMetricasParticipacion({
      asistenciaHistorica,
      asistenciaActual,
      tendenciaProyectada,
      horaCalculo: obtenerHoraFormateada(ahora),
      antesDeLas9: false
    });
  };

  // Verificar permisos del usuario
  if (!user || user.usuario_tipo == 5) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="text-center py-12">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Sin permisos</h3>
          <p className="text-red-600">No tiene permisos para acceder a la fiscalización</p>
        </div>
      </div>
    );
  }

  // Verificar que el usuario tenga una mesa asignada
  if (!user.mesa_numero) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="text-center py-12">
          <AlertCircle className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Mesa no asignada</h3>
          <p className="text-yellow-600">No tiene mesa asignada para fiscalizar</p>
        </div>
      </div>
    );
  }

  // Renderizado condicional para errores
  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="text-center py-12">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error</h3>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Panel de estadísticas de participación */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center space-x-3">
            <Users className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-2xl font-bold text-blue-900">{totalEmpadronados}</p>
              <p className="text-sm text-blue-700">Empadronados</p>
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-2xl font-bold text-green-900">{totalVotaron}</p>
              <p className="text-sm text-green-700">Votaron</p>
            </div>
          </div>
        </div>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <div className="flex items-center space-x-3">
            <Clock className="w-8 h-8 text-yellow-600" />
            <div>
              <p className="text-2xl font-bold text-yellow-900">{pendientes}</p>
              <p className="text-sm text-yellow-700">Pendientes</p>
            </div>
          </div>
        </div>
        
        <div
          onClick={handleOpenParticipacionModal}
          className="bg-purple-50 border border-purple-200 rounded-lg p-3 cursor-pointer hover:shadow-lg hover:border-purple-300 transition-all duration-200 relative"
        >
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">%</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-900">{porcentajeParticipacion}%</p>
              <p className="text-sm text-purple-700">Participación</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-purple-400 absolute top-2 right-2" />
        </div>
      </div>

      {/* Formulario de búsqueda específico para fiscalización */}
      <FiscalizarSearchForm
        onSearch={handleSearch}
        isLoading={isLoading}
        mesaNumero={user.mesa_numero}
        totalRegistros={totalEmpadronados}
      />

      {/* Componente de resultados con funcionalidad de marcado de votos */}
      <FiscalizarResults
        results={filteredData}
        isLoading={isLoading}
        onMarcarVoto={handleMarcarVoto}
        onDeshacerVoto={handleDeshacerVoto}
        isUpdating={isUpdating}
        showSuccessModal={showSuccessModal}
        setShowSuccessModal={setShowSuccessModal}
        userRole={user?.usuario_tipo}
      />

      {/* Modal de Estadísticas de Participación */}
      {showParticipacionModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={handleCloseParticipacionModal}
        >
          <div
            className="bg-white rounded-xl shadow-2xl p-4 max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Encabezado */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Estadísticas de Participación
                    </h3>
                  </div>
                </div>

                <button
                  onClick={handleCloseParticipacionModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="bg-purple-0 border-2 border-purple-300 rounded-lg py-2 px-4">
                <p className="text-lg font-bold text-center tracking-wide">
                 * ESTIMACIÓN PARA MESA {user.mesa_numero} * {metricasParticipacion.horaCalculo} hs
                </p>
              </div>
            </div>
             
            {/* Contenido - Tres Cards de Métricas */}
            {metricasParticipacion.antesDeLas9 ? (
              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6 text-center">
                <Clock className="w-16 h-16 text-yellow-600 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-yellow-900 mb-2">
                  Cálculo no disponible
                </h4>
                <p className="text-sm text-yellow-700">
                  Los cálculos de tendencia de participación están disponibles a partir de las 09:00 AM.
                </p>
                <p className="text-xs text-yellow-600 mt-2">
                  Hora actual: {metricasParticipacion.horaCalculo}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Card 1: Asistencia Histórica */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Clock className="w-8 h-8 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-2xl font-bold text-blue-900">
                        {metricasParticipacion.asistenciaHistorica !== null
                          ? `${metricasParticipacion.asistenciaHistorica.toFixed(1)}%`
                          : 'N/A'}
                      </p>
                      <p className="text-xs font-medium text-blue-700 mt-0.5">
                        Asistencia histórica hasta las {metricasParticipacion.horaCalculo} hs
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card 2: Asistencia en Esta Mesa */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-2xl font-bold text-green-900">
                        {metricasParticipacion.asistenciaActual.toFixed(1)}%
                      </p>
                      <p className="text-xs font-medium text-green-700 mt-0.5">
                        Asistencia registrada en esta mesa
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card 3: Tendencia Proyectada (Destacada) */}
                <div className={`border-4 rounded-lg p-4 ${
                  obtenerColorTendencia(metricasParticipacion.tendenciaProyectada) === 'green'
                    ? 'bg-green-50 border-green-300'
                    : obtenerColorTendencia(metricasParticipacion.tendenciaProyectada) === 'yellow'
                    ? 'bg-yellow-50 border-yellow-300'
                    : 'bg-red-50 border-red-300'
                }`}>
                  <div className="flex items-center space-x-4">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 ${
                      obtenerColorTendencia(metricasParticipacion.tendenciaProyectada) === 'green'
                        ? 'bg-green-100'
                        : obtenerColorTendencia(metricasParticipacion.tendenciaProyectada) === 'yellow'
                        ? 'bg-yellow-100'
                        : 'bg-red-100'
                    }`}>
                      <TrendingUp className={`w-7 h-7 ${
                        obtenerColorTendencia(metricasParticipacion.tendenciaProyectada) === 'green'
                          ? 'text-green-600'
                          : obtenerColorTendencia(metricasParticipacion.tendenciaProyectada) === 'yellow'
                          ? 'text-yellow-600'
                          : 'text-red-600'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <p className={`text-5xl font-bold ${
                        obtenerColorTendencia(metricasParticipacion.tendenciaProyectada) === 'green'
                          ? 'text-green-900'
                          : obtenerColorTendencia(metricasParticipacion.tendenciaProyectada) === 'yellow'
                          ? 'text-yellow-900'
                          : 'text-red-900'
                      }`}>
                        {metricasParticipacion.tendenciaProyectada !== null
                          ? `${metricasParticipacion.tendenciaProyectada.toFixed(1)}%`
                          : 'N/A'}
                      </p>
                      <p className={`text-sm font-medium mt-1 ${
                        obtenerColorTendencia(metricasParticipacion.tendenciaProyectada) === 'green'
                          ? 'text-green-700'
                          : obtenerColorTendencia(metricasParticipacion.tendenciaProyectada) === 'yellow'
                          ? 'text-yellow-700'
                          : 'text-red-700'
                      }`}>
                        Tendencia de participación proyectada para el comicio
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Botón de cierre */}
            <div className="mt-5 flex justify-center">
              <button
                onClick={handleCloseParticipacionModal}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 font-medium"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}