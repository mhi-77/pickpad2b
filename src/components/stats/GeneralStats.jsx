import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { BarChart3, Users, CheckCircle, PieChart, Clock, AlertCircle, TrendingUp } from 'lucide-react';

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

  useEffect(() => {
    fetchGeneralStats();
  }, []);

  const fetchGeneralStats = async () => {
    setIsLoading(true);
    setError('');
    try {
      // Fetch basic stats
      const { data: padronData, error: padronError } = await supabase
        .from('padron')
        .select(`
          documento,
          sexo,
          clase,
          da_es_nuevo,
          da_voto_obligatorio,
          voto_emitido,
          voto_pick_at,
          mesa_numero,
          mesas!inner(
            numero,
            establecimientos!inner(
              circuitos!inner(
                localidad
              )
            )
          )
        `);

      if (padronError) {
        throw padronError;
      }

      // Calculate basic metrics
      const totalEmpadronados = padronData?.length || 0;
      const votedData = padronData?.filter(record => record.voto_emitido === true) || [];
      const totalVotosEmitidos = votedData.length;
      const porcentajeParticipacion = totalEmpadronados > 0 ? 
        ((totalVotosEmitidos / totalEmpadronados) * 100).toFixed(1) : 0;

      // Participation by sex
      const participacionPorSexo = {
        M: votedData.filter(record => record.sexo === 'M').length,
        F: votedData.filter(record => record.sexo === 'F').length
      };

      // Participation by age ranges
      const currentYear = new Date().getFullYear();
      const ageRanges = [
        { range: '18-30', min: currentYear - 30, max: currentYear - 18 },
        { range: '31-50', min: currentYear - 50, max: currentYear - 31 },
        { range: '51-70', min: currentYear - 70, max: currentYear - 51 },
        { range: '71+', min: 0, max: currentYear - 71 }
      ];

      const participacionPorEdad = ageRanges.map(ageRange => {
        const count = votedData.filter(record => {
          if (!record.clase) return false;
          if (ageRange.range === '71+') {
            return record.clase <= ageRange.max;
          }
          return record.clase >= ageRange.min && record.clase <= ageRange.max;
        }).length;
        return { range: ageRange.range, count };
      });

      // New voters participation
      const nuevosVotantes = padronData?.filter(record => record.da_es_nuevo === true) || [];
      const nuevosQueVotaron = nuevosVotantes.filter(record => record.voto_emitido === true);
      const participacionNuevos = {
        voted: nuevosQueVotaron.length,
        total: nuevosVotantes.length
      };

      // Obligatory voters participation
      const votantesObligatorios = padronData?.filter(record => record.da_voto_obligatorio === true) || [];
      const obligatoriosQueVotaron = votantesObligatorios.filter(record => record.voto_emitido === true);
      const participacionObligatorios = {
        voted: obligatoriosQueVotaron.length,
        total: votantesObligatorios.length
      };

      // Participation by hour (based on voto_pick_at)
      const participacionPorHora = [];
      for (let hour = 8; hour <= 18; hour++) {
        const hourString = `${hour.toString().padStart(2, '0')}:00`;
        const count = votedData.filter(record => {
          if (!record.voto_pick_at) return false;
          const voteHour = new Date(record.voto_pick_at).getHours();
          return voteHour === hour;
        }).length;
        participacionPorHora.push({ hour: hourString, count });
      }

      // Get unique mesas count
      const uniqueMesas = new Set(padronData?.map(record => record.mesa_numero).filter(Boolean));
      const mesasActivas = uniqueMesas.size;

      // Mesa participation breakdown
      const mesasPorParticipacion = [];
      uniqueMesas.forEach(mesaNum => {
        const mesaVoters = padronData?.filter(record => record.mesa_numero === mesaNum) || [];
        const mesaVoted = mesaVoters.filter(record => record.voto_emitido === true);
        const participation = mesaVoters.length > 0 ? 
          ((mesaVoted.length / mesaVoters.length) * 100).toFixed(1) : 0;
        
        mesasPorParticipacion.push({
          mesa: mesaNum,
          empadronados: mesaVoters.length,
          votaron: mesaVoted.length,
          participacion: parseFloat(participation)
        });
      });

      // Sort mesas by participation
      mesasPorParticipacion.sort((a, b) => b.participacion - a.participacion);

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
        mesasPorParticipacion: mesasPorParticipacion.slice(0, 10) // Top 10 mesas
      });

    } catch (err) {
      setError('Error loading general statistics.');
      console.error('Error fetching general stats:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Estadísticas Generales</h2>
        <p className="text-gray-600 mb-6">Resumen y métricas clave del proceso electoral.</p>

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
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Participación por Rango de Edad</h3>
                <div className="space-y-2">
                  {stats.participacionPorEdad.map((item, index) => (
                    <div key={index} className="flex justify-between">
                      <span className="text-gray-600">{item.range} años:</span>
                      <span className="font-medium">{item.count.toLocaleString()} votos</span>
                    </div>
                  ))}
                </div>
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
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {stats.participacionPorHora.map((item, index) => (
                  <div key={index} className="text-center">
                    <div className="text-sm text-gray-600">{item.hour}</div>
                    <div className="text-lg font-bold text-blue-600">{item.count}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Mesas by Participation */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top 10 Mesas por Participación</h3>
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
            </div>
          </div>
        )}
      </div>
    </div>
  );
}