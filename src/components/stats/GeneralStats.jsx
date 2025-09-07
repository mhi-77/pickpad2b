// src/components/stats/GeneralStats.jsx
import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { BarChart3, Users, CheckCircle, PieChart, Clock, AlertCircle, TrendingUp } from 'lucide-react';

// Función de debounce reutilizable
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
    mesasPorParticipacion: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);

  // Referencia para debounce
  const debouncedFetch = useRef(debounce(fetchGeneralStats, 2000)).current;

  useEffect(() => {
    fetchGeneralStats();

    // Configurar escucha en tiempo real
    const channel = supabase
      .channel('stats-changes-general')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'padron',
          filter: 'voto_emitido=eq.true'
        },
        (payload) => {
          // Solo si voto_emitido cambió a true
          if (payload.new.voto_emitido === true && payload.old.voto_emitido !== true) {
            setIsSyncing(true);
            debouncedFetch();
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'padron'
        },
        (payload) => {
          // Si se insertó con voto_emitido = true
          if (payload.new.voto_emitido === true) {
            setIsSyncing(true);
            debouncedFetch();
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('Canal de estadísticas conectado');
        }
      });

    // Limpiar al desmontar
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function fetchGeneralStats() {
    setIsLoading(true);
    setError('');
    try {
      const currentYear = new Date().getFullYear();

      // 1. Total empadronados
      const { count: totalEmpadronados, error: countError } = await supabase
        .from('padron')
        .select('*', { count: 'exact', head: true });
      if (countError) throw countError;

      // 2. Total votos emitidos
      const { count: totalVotosEmitidos, error: votosError } = await supabase
        .from('padron')
        .select('documento', { count: 'exact', head: true })
        .eq('voto_emitido', true);
      if (votosError) throw votosError;

      // 3. Participación por sexo
      const { data: sexoData, error: sexoError } = await supabase
        .from('padron')
        .select('sexo')
        .eq('voto_emitido', true)
        .not('sexo', 'is', null);
      if (sexoError) throw sexoError;

      const participacionPorSexo = (sexoData || []).reduce((acc, curr) => {
        if (curr.sexo === 'M') acc.M++;
        if (curr.sexo === 'F') acc.F++;
        return acc;
      }, { M: 0, F: 0 });

      // 4. Participación por edad
      const { data: edadData, error: edadError } = await supabase
        .from('padron')
        .select('clase')
        .eq('voto_emitido', true)
        .not('clase', 'is', null);
      if (edadError) throw edadError;

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

      // 5. Nuevos votantes
      const { count: nuevosTotal, error: nuevosTotalError } = await supabase
        .from('padron')
        .select('documento', { count: 'exact', head: true })
        .eq('da_es_nuevo', true);
      if (nuevosTotalError) throw nuevosTotalError;

      const { count: nuevosVotaron, error: nuevosVotaronError } = await supabase
        .from('padron')
        .select('documento', { count: 'exact', head: true })
        .eq('da_es_nuevo', true)
        .eq('voto_emitido', true);
      if (nuevosVotaronError) throw nuevosVotaronError;

      const participacionNuevos = { voted: nuevosVotaron || 0, total: nuevosTotal || 0 };

      // 6. Votantes obligatorios
      const { count: obligatoriosTotal, error: obligatoriosTotalError } = await supabase
        .from('padron')
        .select('documento', { count: 'exact', head: true })
        .eq('da_voto_obligatorio', true);
      if (obligatoriosTotalError) throw obligatoriosTotalError;

      const { count: obligatoriosVotaron, error: obligatoriosVotaronError } = await supabase
        .from('padron')
        .select('documento', { count: 'exact', head: true })
        .eq('da_voto_obligatorio', true)
        .eq('voto_emitido', true);
      if (obligatoriosVotaronError) throw obligatoriosVotaronError;

      const participacionObligatorios = { voted: obligatoriosVotaron || 0, total: obligatoriosTotal || 0 };

      // 7. Participación por hora (ajustada a 8-18)
      const { data: horaData, error: horaError } = await supabase.rpc('get_votos_por_hora_art');
      if (horaError) throw horaError;

      // Ajustar horas extremas
      const ajustado = horaData.map(row => {
        if (row.hora < 8) return { ...row, hora: 8 };
        if (row.hora > 18) return { ...row, hora: 18 };
        return row;
      });

      // Agrupar nuevamente por hora
      const grouped = ajustado.reduce((acc, row) => {
        acc[row.hora] = (acc[row.hora] || 0) + row.count;
        return acc;
      }, {});

      // Generar array de 8 a 18
      const participacionPorHora = [];
      for (let hour = 8; hour <= 18; hour++) {
        participacionPorHora.push({
          hour: `${hour.toString().padStart(2, '0')}:00`,
          count: grouped[hour] || 0
        });
      }

      // 8. Mesas activas y participación
      const { data: mesasData, error: mesasError } = await supabase
        .from('padron')
        .select('mesa_numero, voto_emitido')
        .not('mesa_numero', 'is', null);
      if (mesasError) throw mesasError;

      const mesaMap = new Map();
      for (const row of mesasData || []) {
        const num = row.mesa_numero;
        if (!mesaMap.has(num)) {
          mesaMap.set(num, { total: 0, votaron: 0 });
        }
        const mesa = mesaMap.get(num);
        mesa.total += 1;
        if (row.voto_emitido) mesa.votaron += 1;
      }

      const mesasActivas = mesaMap.size;

      const mesasPorParticipacion = Array.from(mesaMap.entries())
        .map(([mesa, data]) => ({
          mesa,
          empadronados: data.total,
          votaron: data.votaron,
          participacion: ((data.votaron / data.total) * 100).toFixed(1)
        }))
        .sort((a, b) => b.participacion - a.participacion)
        .slice(0, 10);

      // 9. Calcular porcentaje general
      const porcentajeParticipacion = totalEmpadronados > 0 
        ? ((totalVotosEmitidos / totalEmpadronados) * 100).toFixed(1) 
        : 0;

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
        mesasPorParticipacion
      });

    } catch (err) {
      setError('Error loading general statistics.');
      console.error('Error fetching general stats:', err);
    } finally {
      setIsLoading(false);
      setIsSyncing(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Estadísticas Generales</h2>
            <p className="text-gray-600">Resumen y métricas clave del proceso electoral.</p>
          </div>
          <div className={`flex items-center space-x-2 text-sm ${isSyncing ? 'text-blue-600' : 'text-green-600'}`}>
            <div className={`w-2 h-2 rounded-full ${isSyncing ? 'bg-blue-400 animate-pulse' : 'bg-green-400'}`}></div>
            <span>{isSyncing ? 'Actualizando...' : 'En tiempo real'}</span>
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

            {/* Top Mesas by Participation */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top 10 Mesas por Participación</h3>
              {stats.mesasPorParticipacion.length === 0 ? (
                <p className="text-gray-500 text-sm">No hay mesas con participación registrada</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Mesa</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Empadronados</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Votaron</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Participación</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {stats.mesasPorParticipacion.map((mesa, index) => (
                        <tr key={mesa.mesa}>
                          <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                            Mesa {mesa.mesa}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                            {mesa.empadronados}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                            {mesa.votaron}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              mesa.participacion >= 80 ? 'bg-green-100 text-green-800' :
                              mesa.participacion >= 60 ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {mesa.participacion}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}