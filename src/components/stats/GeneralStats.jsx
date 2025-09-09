// src/components/stats/GeneralStats.jsx
// Dashboard de estadísticas generales del proceso electoral
// Usa Supabase para cargar datos en tiempo real
// Muestra métricas clave: participación, mesas, sexo, edad, etc.

import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { 
  Users, 
  CheckCircle, 
  PieChart, 
  Clock, 
  AlertCircle, 
  TrendingUp,
  RefreshCw,
  TableProperties,
  ToggleLeft,
  ToggleRight,
  X
} from 'lucide-react';

// Función de debounce para evitar múltiples llamadas rápidas
// Útil si hay muchos cambios en tiempo real
const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export default function GeneralStats() {
  // Estado principal del componente
  const [stats, setStats] = useState({
    totalEmpadronados: 0,
    totalVotosEmitidos: 0,
    porcentajeParticipacion: 0,
    mesasActivas: 0,
    participacionPorSexo: { M: 0, F: 0, X: 0 }, // Incluye no binario
    participacionPorEdad: [],
    participacionNuevos: { voted: 0, total: 0 },
    participacionObligatorios: { voted: 0, total: 0 },
    participacionPorHora: [],
    mesasPorParticipacion: [], // Todas las mesas
    localidades: [] // Participación por localidad
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isRealtime, setIsRealtime] = useState(false); // Modo manual por defecto
  const [showMesasModal, setShowMesasModal] = useState(false); // Modal de mesas
  
  // Formatea números con punto como separador de miles y coma como decimal
const formatNumber = (num) => {
  return new Intl.NumberFormat('es-AR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(num);
};

  // Función principal para cargar todas las estadísticas
  const fetchGeneralStats = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const currentYear = new Date().getFullYear();

      // --- 1. DATOS DE MESAS ---
      // Obtenemos mesas con sus establecimientos y localidades
      // Usamos esta tabla porque ya tiene totales precalculados
      const { data: mesasData, error: mesasError } = await supabase
        .from('mesas')
        .select(`
          numero,
          total_empadronados,
          total_votaron,
          establecimientos (
            nombre,
            circuitos (
              localidad
            )
          )
        `)
        .not('total_empadronados', 'eq', 0); // Evita mesas sin empadronados

      if (mesasError) throw mesasError;
      if (!mesasData || !Array.isArray(mesasData)) {
        console.warn('No se recibieron datos válidos de mesas:', mesasData);
      }
      const data = mesasData || [];

      // --- 2. MÉTRICAS GLOBALES ---
      const totalEmpadronados = data.reduce((sum, m) => sum + m.total_empadronados, 0);
      const totalVotosEmitidos = data.reduce((sum, m) => sum + (m.total_votaron || 0), 0);
      const mesasActivas = data.length;

      // Porcentaje general de participación
      const porcentajeParticipacion = totalEmpadronados > 0 
        ? ((totalVotosEmitidos / totalEmpadronados) * 100).toFixed(1) 
        : 0;

      // --- 3. TODAS LAS MESAS ---
      // Calculamos participación individual y ordenamos por número
      const mesasPorParticipacion = data.map(mesa => {
        const participacion = mesa.total_empadronados > 0 
          ? ((mesa.total_votaron || 0) / mesa.total_empadronados) * 100 
          : 0;
        return {
          mesa: mesa.numero,
          empadronados: mesa.total_empadronados,
          votaron: mesa.total_votaron || 0,
          participacion: participacion.toFixed(1),
          establecimiento: mesa.establecimientos?.nombre || 'Sin establecimiento'
        };
      }).sort((a, b) => a.mesa - b.mesa); // Orden ascendente por número

      // --- 4. RESUMEN POR LOCALIDAD ---
      // Agrupamos mesas por localidad (desde circuitos)
      const localidadesMap = new Map();
      for (const mesa of mesasData || []) {
        const localidad = mesa.establecimientos?.circuitos?.localidad || 'Sin localidad';
        if (!localidadesMap.has(localidad)) {
          localidadesMap.set(localidad, { empadronados: 0, votaron: 0 });
        }
        const loc = localidadesMap.get(localidad);
        loc.empadronados += mesa.total_empadronados;
        loc.votaron += (mesa.total_votaron || 0);
      }

      const localidades = Array.from(localidadesMap.entries())
        .map(([localidad, data]) => {
          const participacion = data.empadronados > 0 
            ? ((data.votaron / data.empadronados) * 100).toFixed(1) 
            : 0;
          return {
            localidad,
            empadronados: data.empadronados,
            votaron: data.votaron,
            participacion
          };
        })
        .sort((a, b) => a.localidad.localeCompare(b.localidad));

      // --- 5. PARTICIPACIÓN POR SEXO ---
      // Usamos una función RPC para contar eficientemente
      // Asegurarse de que la función devuelve "sexo" y "count"
      let participacionPorSexo = { M: 0, F: 0, X: 0 };
      try {
        const { data: sexoData, error: sexoError } = await supabase
          .rpc('get_participacion_por_sexo');

        if (sexoError) throw sexoError;

        if (sexoData && Array.isArray(sexoData)) {
          sexoData.forEach(row => {
            if (row.sexo === 'M') participacionPorSexo.M = row.count;
            if (row.sexo === 'F') participacionPorSexo.F = row.count;
            if (row.sexo === 'X') participacionPorSexo.X = row.count;
          });
        }
      } catch (err) {
        console.error('RPC get_participacion_por_sexo falló:', err);
        // No detenemos todo, solo dejamos en 0
      }

      // --- 6. PARTICIPACIÓN POR EDAD ---
      // Usamos RPC para evitar traer miles de filas
      let participacionPorEdad = [];
      try {
        const { data: edadData, error: edadError } = await supabase
          .rpc('get_participacion_por_edad');

        if (edadError) throw edadError;

        participacionPorEdad = (edadData && Array.isArray(edadData))
          ? edadData.map(row => ({
              range: row.rango,
              count: row.count
            }))
          : [];
      } catch (err) {
        console.error('RPC get_participacion_por_edad falló:', err);
      }

      // --- 7. NUEVOS VOTANTES ---
      // Consulta directa al padrón
      const { count: nuevosTotal } = await supabase
        .from('padron')
        .select('documento', { count: 'exact', head: true })
        .eq('da_es_nuevo', true);

      const { count: nuevosVotaron } = await supabase
        .from('padron')
        .select('documento', { count: 'exact', head: true })
        .eq('da_es_nuevo', true)
        .eq('voto_emitido', true);

      const participacionNuevos = { voted: nuevosVotaron || 0, total: nuevosTotal || 0 };

      // --- 8. VOTANTES OBLIGATORIOS ---
      const { count: obligatoriosTotal } = await supabase
        .from('padron')
        .select('documento', { count: 'exact', head: true })
        .eq('da_voto_obligatorio', true);

      const { count: obligatoriosVotaron } = await supabase
        .from('padron')
        .select('documento', { count: 'exact', head: true })
        .eq('da_voto_obligatorio', true)
        .eq('voto_emitido', true);

      const participacionObligatorios = { voted: obligatoriosVotaron || 0, total: obligatoriosTotal || 0 };

      // --- 9. PARTICIPACIÓN POR HORA ---
      // Usamos RPC que agrupa votos por hora
      let participacionPorHora = [];
      try {
        const { data: horaData } = await supabase.rpc('get_votos_por_hora_art');
        const ajustado = (horaData || []).map(row => {
          if (row.hora < 8) return { ...row, hora: 8 };
          if (row.hora > 18) return { ...row, hora: 18 };
          return row;
        });
        const grouped = ajustado.reduce((acc, row) => {
          acc[row.hora] = (acc[row.hora] || 0) + row.count;
          return acc;
        }, {});
        for (let hour = 8; hour <= 18; hour++) {
          participacionPorHora.push({
            hour: `${hour.toString().padStart(2, '0')}:00`,
            count: grouped[hour] || 0
          });
        }
      } catch (err) {
        console.error('RPC get_votos_por_hora_art falló:', err);
      }

      // --- 10. ACTUALIZAR ESTADO ---
      // Todo listo, actualizamos el estado
      setStats({
        totalEmpadronados,
        totalVotosEmitidos,
        porcentajeParticipacion: parseFloat(porcentajeParticipacion),
        mesasActivas,
        participacionPorSexo,
        participacionPorEdad,
        participacionNuevos,
        participacionObligatorios,
        participacionPorHora,
        mesasPorParticipacion,
        localidades
      });

    } catch (err) {
      // Si falla algo crítico (mesas, etc.), mostramos error
      setError('Error loading general statistics: ' + err.message);
      console.error('Error fetching general stats:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar datos al montar
  useEffect(() => {
    fetchGeneralStats();
  }, []);

  // Escuchar cambios en tiempo real (opcional)
  useEffect(() => {
    let channel = null;

    if (isRealtime) {
      channel = supabase
        .channel('stats-changes-padron')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'padron'
          },
          (payload) => {
            if (payload.new.voto_emitido === true) {
              fetchGeneralStats();
            }
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'padron',
            filter: 'voto_emitido=eq.true'
          },
          (payload) => {
            if (payload.new.voto_emitido === true && payload.old.voto_emitido !== true) {
              fetchGeneralStats();
            }
          }
        )
        .subscribe();
    }

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, [isRealtime]);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Estadísticas Generales</h2>
            <p className="text-gray-600">Resumen y métricas clave del proceso electoral.</p>
          </div>
          <div className="flex items-center space-x-4">
            {/* Botón para activar/desactivar modo en tiempo real */}
            <button
              type="button"
              onClick={() => setIsRealtime(!isRealtime)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                isRealtime 
                  ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              {isRealtime ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
              <span>{isRealtime ? 'En tiempo real' : 'Manual'}</span>
            </button>

            {/* Botón de actualización manual */}
            <button
              type="button"
              onClick={fetchGeneralStats}
              disabled={isLoading}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-sm font-medium rounded-lg transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? 'Actualizando...' : 'Actualizar ahora'}</span>
            </button>
          </div>
        </div>

        {/* Estado de carga */}
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Cargando estadísticas...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-600">
            <AlertCircle className="w-12 h-12 mx-auto mb-3" />
            <p>{error}</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Métricas principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <Users className="w-8 h-8 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold text-blue-900">{stats.totalEmpadronados.toLocaleString()}</p>
                    <p className="text-sm text-blue-700">Total Empadronados</p>
                  </div>
                </div>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold text-green-900">{formatNumber(stats.totalVotosEmitidos)}</p>
                    <p className="text-sm text-green-700">Votos Emitidos</p>
                  </div>
                </div>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <TrendingUp className="w-8 h-8 text-yellow-600" />
                  <div>
                    <p className="text-2xl font-bold text-yellow-900">{stats.porcentajeParticipacion.toLocaleString()}%</p>
                    <p className="text-sm text-yellow-700">Participación General</p>
                  </div>
                </div>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <PieChart className="w-8 h-8 text-purple-600" />
                  <div>
                    <p className="text-2xl font-bold text-purple-900">{formatNumber(stats.mesasActivas)}</p>
                    <p className="text-sm text-purple-700">Mesas Activas</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Detalles por categoría */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Participación por Sexo</h3>
                <div className="space-y-2">
                  {stats.participacionPorSexo.M > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Masculino:</span>
                      <span className="font-medium">{formatNumber(stats.participacionPorSexo.M)} votos</span>
                    </div>
                  )}
                  {stats.participacionPorSexo.F > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Femenino:</span>
                      <span className="font-medium">{formatNumber(stats.participacionPorSexo.F)}votos</span>
                    </div>
                  )}
                  {stats.participacionPorSexo.X > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Otro / No binario:</span>
                      <span className="font-medium">{formatNumber(stats.participacionPorSexo.X)} votos</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Participación por Rango de Edad</h3>
                {stats.participacionPorEdad.every(item => item.count === 0) ? (
                  <p className="text-gray-500 text-sm">No hay datos de edad registrados</p>
                ) : (
                  <div className="space-y-2">
                    {stats.participacionPorEdad.map((item, index) => (
                      <div key={index} className="flex justify-between">
                        <span className="text-gray-600">{item.range} años:</span>
                        <span className="font-medium">{formatNumber(item.count)} votos</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Participación de Nuevos Votantes</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Votaron:</span>
                    <span className="font-medium">{formatNumber(stats.participacionNuevos.voted.toLocaleString())}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total:</span>
                    <span className="font-medium">{formatNumber(stats.participacionNuevos.total)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-gray-600">Porcentaje:</span>
                    <span className="font-bold text-blue-600">
                      {stats.participacionNuevos.total > 0 ? 
                        formatNumber(((stats.participacionNuevos.voted / stats.participacionNuevos.total) * 100).toFixed(1)) : 0}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Participación de Votantes Obligatorios</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Votaron:</span>
                    <span className="font-medium">{stats.participacionObligatorios.voted.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total:</span>
                    <span className="font-medium">{stats.participacionObligatorios.total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-gray-600">Porcentaje:</span>
                    <span className="font-bold text-green-600">
                      {stats.participacionObligatorios.total > 0 ? 
                        formatNumber(((stats.participacionObligatorios.voted / stats.participacionObligatorios.total) * 100).toFixed(1)) : 0}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Participación por hora */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Participación por Rango Horario</h3>
              {stats.participacionPorHora.every(item => item.count === 0) ? (
                <p className="text-gray-500 text-sm">No hay datos de horario registrados</p>
              ) : (
                <div className="grid grid-cols-4 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {stats.participacionPorHora.map((item, index) => (
                    <div key={index} className="text-center">
                      <div className="text-sm text-gray-600">{item.hour}</div>
                      <div className="text-lg font-bold text-blue-600">{formatNumber(item.count)}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Resumen por localidad */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Participación por Localidad</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">Localidad</th>
                      <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">Part.</th>
                      <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">Padrón</th>
                      <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">Votaron</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {stats.localidades.map((loc) => (
                      <tr key={loc.localidad}>
                        <td className="px-2 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                          {loc.localidad}
                        </td>
                        <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-900">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            loc.participacion >= stats.porcentajeParticipacion * 0.95
                              ? 'bg-green-100 text-green-800' :
                            loc.participacion >= stats.porcentajeParticipacion * 0.65
                              ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                          }`}>
                            {formatNumber(loc.participacion)}%
                          </span>
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                          {formatNumber(loc.empadronados)}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                          {formatNumber(loc.votaron)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Botón para ver todas las mesas */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => setShowMesasModal(true)}
                className="flex items-center space-x-2 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors"
              >
                <TableProperties className="w-5 h-5" />
                <span>Ver todas las mesas</span>
              </button>
            </div>
          </div>
        )}
      </div>

     {/* Modal: Todas las mesas */}
      {showMesasModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Todas las Mesas</h3>
              <button
                onClick={() => setShowMesasModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">Mesa</th>
                    <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">Part.</th>
                    <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">Establecimiento</th>
                    <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">Padrón</th>
                    <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">Votaron</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {stats.mesasPorParticipacion.map((mesa) => (
                    <tr key={mesa.mesa}>
                      <td className="px-1 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                        Mesa {mesa.mesa}
                      </td>
                      <td className="px-1 py-1 whitespace-nowrap text-sm text-gray-900">
                        <span className={`px-1 py-1 rounded-full text-xs font-medium ${
                          mesa.participacion >= stats.porcentajeParticipacion * 0.95
                            ? 'bg-green-100 text-green-800' :
                          mesa.participacion >= stats.porcentajeParticipacion * 0.65
                            ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                        }`}>
                          {mesa.participacion}%
                        </span>
                      </td>
                      <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-900">
                        {mesa.establecimiento}
                      </td>
                      <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-900">
                        {formatNumber(mesa.empadronados)}
                      </td>
                      <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-900">
                        {formatNumber(mesa.votaron)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-end mt-2">
              <button
                onClick={() => setShowMesasModal(false)}
                className="px-2 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}