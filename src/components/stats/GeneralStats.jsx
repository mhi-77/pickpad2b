// src/components/stats/GeneralStats.jsx
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

// Función de debounce
const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export default function GeneralStats() {
  const [stats, setStats] = useState({
    totalEmpadronados: 0,
    totalVotosEmitidos: 0,
    porcentajeParticipacion: 0,
    mesasActivas: 0,
    participacionPorSexo: { M: 0, F: 0 },
    participacionPorEdad: [],
    participacionNuevos: { voted: 0, total: 0 },
    participacionObligatorios: { voted: 0, total: 0 },
    participacionPorHora: [],
    mesasPorParticipacion: [],
    localidades: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isRealtime, setIsRealtime] = useState(false);
  const [showMesasModal, setShowMesasModal] = useState(false);

  const fetchGeneralStats = async () => {
    setIsLoading(true);
    setError('');
    try {
      const currentYear = new Date().getFullYear();

      // 1. Obtener mesas con establecimientos y circuitos
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
        .not('total_empadronados', 'eq', 0);

      if (mesasError) throw mesasError;
      if (!mesasData || !Array.isArray(mesasData)) {
        console.warn('No se recibieron datos válidos de mesas:', mesasData);
      }
      const data = mesasData || [];

      // Calcular métricas globales
      const totalEmpadronados = data.reduce((sum, m) => sum + m.total_empadronados, 0);
      const totalVotosEmitidos = data.reduce((sum, m) => sum + (m.total_votaron || 0), 0);
      const mesasActivas = data.length;

      // ✅ ¡FALTABA ESTA LÍNEA! Ahora está
      const porcentajeParticipacion = totalEmpadronados > 0 
        ? ((totalVotosEmitidos / totalEmpadronados) * 100).toFixed(1) 
        : 0;

      // 2. Todas las mesas (ordenadas por número)
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
      }).sort((a, b) => a.mesa - b.mesa);

      // 3. Resumen por localidad
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

      // 4. Participación por sexo
      const { data: sexoData } = await supabase
        .from('padron')
        .select('sexo')
        .eq('voto_emitido', true)
        .not('sexo', 'is', null);

      const participacionPorSexo = (sexoData || []).reduce((acc, curr) => {
        if (curr.sexo === 'M') acc.M++;
        if (curr.sexo === 'F') acc.F++;
        return acc;
      }, { M: 0, F: 0 });

      // 5. Participación por edad
      const { data: edadData } = await supabase
        .from('padron')
        .select('clase')
        .eq('voto_emitido', true)
        .not('clase', 'is', null);

      const ageRanges = [
        { range: '18-30', min: currentYear - 30, max: currentYear - 18 },
        { range: '31-50', min: currentYear - 50, max: currentYear - 31 },
        { range: '51-70', min: currentYear - 70, max: currentYear - 51 },
        { range: '71+', max: currentYear - 71 }
      ];

      const participacionPorEdad = ageRanges.map(ageRange => {
        let count = 0;
        for (const row of edadData || []) {
          const birthYear = row.clase;
          if (ageRange.range === '71+') {
            if (birthYear <= ageRange.max) count++;
          } else {
            if (birthYear >= ageRange.min && birthYear <= ageRange.max) count++;
          }
        }
        return { range: ageRange.range, count };
      });

      // 6. Nuevos y obligatorios
      const { count: nuevosTotal } = await supabase
        .from('padron')
        .select('documento', { count: 'exact', head: true })
        .eq('da_es_nuevo', true);

      const { count: nuevosVotaron } = await supabase
        .from('padron')
        .select('documento', { count: 'exact', head: true })
        .eq('da_es_nuevo', true)
        .eq('voto_emitido', true);

      const { count: obligatoriosTotal } = await supabase
        .from('padron')
        .select('documento', { count: 'exact', head: true })
        .eq('da_voto_obligatorio', true);

      const { count: obligatoriosVotaron } = await supabase
        .from('padron')
        .select('documento', { count: 'exact', head: true })
        .eq('da_voto_obligatorio', true)
        .eq('voto_emitido', true);

      const participacionNuevos = { voted: nuevosVotaron || 0, total: nuevosTotal || 0 };
      const participacionObligatorios = { voted: obligatoriosVotaron || 0, total: obligatoriosTotal || 0 };

      // 7. Participación por hora
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
      const participacionPorHora = [];
      for (let hour = 8; hour <= 18; hour++) {
        participacionPorHora.push({
          hour: `${hour.toString().padStart(2, '0')}:00`,
          count: grouped[hour] || 0
        });
      }

      // Actualizar estado
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
      setError('Error loading general statistics: ' + err.message);
      console.error('Error fetching general stats:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGeneralStats();
  }, []);

  // Efecto para Realtime (opcional)
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
            {/* Botón de modo Realtime */}
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

            {/* Botón de actualización */}
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
            {/* Main Metrics */}
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
                    <p className="text-2xl font-bold text-green-900">{stats.totalVotosEmitidos.toLocaleString()}</p>
                    <p className="text-sm text-green-700">Votos Emitidos</p>
                  </div>
                </div>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <TrendingUp className="w-8 h-8 text-yellow-600" />
                  <div>
                    <p className="text-2xl font-bold text-yellow-900">{stats.porcentajeParticipacion}%</p>
                    <p className="text-sm text-yellow-700">Participación General</p>
                  </div>
                </div>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <PieChart className="w-8 h-8 text-purple-600" />
                  <div>
                    <p className="text-2xl font-bold text-purple-900">{stats.mesasActivas}</p>
                    <p className="text-sm text-purple-700">Mesas Activas</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Participación por Sexo</h3>
                {stats.participacionPorSexo.M === 0 && stats.participacionPorSexo.F === 0 ? (
                  <p className="text-gray-500 text-sm">No hay datos de sexo registrados</p>
                ) : (
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Masculino:</span>
                      <span className="font-medium">{stats.participacionPorSexo.M.toLocaleString()} votos</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Femenino:</span>
                      <span className="font-medium">{stats.participacionPorSexo.F.toLocaleString()} votos</span>
                    </div>
                  </div>
                )}
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
                        <span className="font-medium">{item.count.toLocaleString()} votos</span>
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
                    <span className="font-medium">{stats.participacionNuevos.voted.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total:</span>
                    <span className="font-medium">{stats.participacionNuevos.total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-gray-600">Porcentaje:</span>
                    <span className="font-bold text-blue-600">
                      {stats.participacionNuevos.total > 0 ? 
                        ((stats.participacionNuevos.voted / stats.participacionNuevos.total) * 100).toFixed(1) : 0}%
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
                        ((stats.participacionObligatorios.voted / stats.participacionObligatorios.total) * 100).toFixed(1) : 0}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Hourly Participation */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Participación por Rango Horario</h3>
              {stats.participacionPorHora.every(item => item.count === 0) ? (
                <p className="text-gray-500 text-sm">No hay datos de horario registrados</p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {stats.participacionPorHora.map((item, index) => (
                    <div key={index} className="text-center">
                      <div className="text-sm text-gray-600">{item.hour}</div>
                      <div className="text-lg font-bold text-blue-600">{item.count}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Resumen por Localidad */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Participación por Localidad</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Localidad</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">part.</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Empadronados</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Votaron</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {stats.localidades.map((loc) => (
                      <tr key={loc.localidad}>
                        <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                          {loc.localidad}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            loc.participacion >= stats.porcentajeParticipacion * 0.95
                              ? 'bg-green-100 text-green-800' :
                            loc.participacion >= stats.porcentajeParticipacion * 0.65
                              ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                          }`}>
                            {loc.participacion}%
                          </span>
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                          {loc.empadronados}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                          {loc.votaron}
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
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Mesa</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">part.</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Establecimiento</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Empadronados</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Votaron</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {stats.mesasPorParticipacion.map((mesa) => (
                    <tr key={mesa.mesa}>
                      <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                        Mesa {mesa.mesa}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          mesa.participacion >= stats.porcentajeParticipacion * 0.95
                            ? 'bg-green-100 text-green-800' :
                          mesa.participacion >= stats.porcentajeParticipacion * 0.65
                            ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                        }`}>
                          {mesa.participacion}%
                        </span>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                        {mesa.establecimiento}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                        {mesa.empadronados}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                        {mesa.votaron}
                      </td>
                    </tr>
                  ))}
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
    </div>
  );
}