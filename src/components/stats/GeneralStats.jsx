// src/components/stats/GeneralStats.jsx
// Dashboard de estadísticas generales del proceso electoral
// Usa Supabase para cargar datos en tiempo real
// Muestra métricas clave: participación, mesas, sexo, edad, etc.

import React, { useState, useEffect, useRef } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { supabase } from '../../lib/supabase';
import {
  Users,
  CheckCircle,
  PieChart,
  Clock,
  AlertCircle,
  TrendingUp,
  SmartphoneNfc,
  RefreshCw,
  TableProperties,
  ToggleLeft,
  ToggleRight,
  X,
  BarChart3,
  List,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import {
  calcularTendenciaProyectada,
  obtenerIndiceHistorico,
  obtenerColorTendencia,
  obtenerHoraFormateada
} from '../../utils/tendenciaParticipacion';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

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

  const [ultimosVotos, setUltimosVotos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isRealtime, setIsRealtime] = useState(false);
  const [showMesasModal, setShowMesasModal] = useState(false);
  const [showTendencia, setShowTendencia] = useState(false);
  const [horaActual, setHoraActual] = useState('');
  const [puedeCalcularTendencia, setPuedeCalcularTendencia] = useState(false);

  const [showVotosModal, setShowVotosModal] = useState(false);
  const [modalVotos, setModalVotos] = useState([]);
  const [modalPage, setModalPage] = useState(1);
  const [modalTotal, setModalTotal] = useState(0);
  const [modalLoading, setModalLoading] = useState(false);
  const MODAL_PAGE_SIZE = 50;
  
// Formatea números con punto como separador de miles y coma como decimal
const formatNumber = (num) => {
  return new Intl.NumberFormat('es-AR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(num);
};

  const fetchVotosModal = async (page) => {
    setModalLoading(true);
    try {
      const from = (page - 1) * MODAL_PAGE_SIZE;
      const to = from + MODAL_PAGE_SIZE - 1;

      const { data, count, error: fetchError } = await supabase
        .from('padron')
        .select(`
          documento,
          apellido,
          nombre,
          mesa_numero,
          voto_pick_at,
          emopick_id,
          emopicks!left(display),
          mesas!left(mesa_localidad)
        `, { count: 'exact' })
        .eq('voto_emitido', true)
        .not('voto_pick_at', 'is', null)
        .order('voto_pick_at', { ascending: false })
        .range(from, to);

      if (fetchError) throw fetchError;

      const mapped = (data || []).map(v => ({
        hora: new Date(v.voto_pick_at).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false }),
        mesa: v.mesa_numero,
        localidad: v.mesas?.mesa_localidad || '-',
        votante: `${v.apellido}, ${v.nombre}`,
        documento: v.documento,
        pick: v.emopicks?.display || (v.emopick_id ? `#${v.emopick_id}` : null)
      }));

      setModalVotos(mapped);
      setModalTotal(count || 0);
      setModalPage(page);
    } catch (err) {
      console.error('Error cargando votos modal:', err);
    } finally {
      setModalLoading(false);
    }
  };

  const openVotosModal = () => {
    setShowVotosModal(true);
    fetchVotosModal(1);
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
          mesa_localidad,
          establecimientos (
            nombre
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
      // Calculamos participación individual y tendencia proyectada, ordenamos por número
      const ahora = new Date();
      const indiceHistorico = obtenerIndiceHistorico(ahora);
      const puedeCalcular = indiceHistorico !== null;
      const horaFormateada = obtenerHoraFormateada(ahora);

      const mesasPorParticipacion = data.map(mesa => {
        const participacion = mesa.total_empadronados > 0
          ? ((mesa.total_votaron || 0) / mesa.total_empadronados) * 100
          : 0;

        const tendencia = puedeCalcular
          ? calcularTendenciaProyectada(
              mesa.total_votaron || 0,
              mesa.total_empadronados,
              ahora
            )
          : null;

        return {
          mesa: mesa.numero,
          empadronados: mesa.total_empadronados,
          votaron: mesa.total_votaron || 0,
          participacion: participacion.toFixed(1),
          tendenciaProyectada: tendencia !== null ? tendencia.toFixed(1) : null,
          establecimiento: mesa.establecimientos?.nombre || 'Sin establecimiento'
        };
      }).sort((a, b) => a.mesa - b.mesa); // Orden ascendente por número

      setPuedeCalcularTendencia(puedeCalcular);
      setHoraActual(horaFormateada);

      // --- 4. RESUMEN POR LOCALIDAD ---
      // Agrupamos mesas por localidad
      const localidadesMap = new Map();
      for (const mesa of mesasData || []) {
        const localidad = mesa.mesa_localidad || 'Sin localidad';
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

{/* ***************** DESACTIVADO DESDE ACA *****************************************************
      
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
        //console.log('Datos crudos de BD:', edadData); // ← Agrega esto

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

**************** HASTA ACA ******************************************************************************************/}

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

      // --- 10. ULTIMOS 5 VOTOS EMITIDOS ---
      let ultimosVotosData = [];
      try {
        const { data: votosData } = await supabase
          .from('padron')
          .select(`
            documento,
            apellido,
            nombre,
            mesa_numero,
            voto_pick_at,
            emopick_id,
            emopicks!left(display),
            mesas!left(mesa_localidad)
          `)
          .eq('voto_emitido', true)
          .not('voto_pick_at', 'is', null)
          .order('voto_pick_at', { ascending: false })
          .limit(5);

        ultimosVotosData = (votosData || []).map(v => ({
          hora: new Date(v.voto_pick_at).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false }),
          mesa: v.mesa_numero,
          localidad: v.mesas?.mesa_localidad || '-',
          votante: `${v.apellido}, ${v.nombre}`,
          documento: v.documento,
          pick: v.emopicks?.display || (v.emopick_id ? `#${v.emopick_id}` : null)
        }));
      } catch (err) {
        console.error('Error cargando últimos votos:', err);
      }
      setUltimosVotos(ultimosVotosData);

      // --- 11. ACTUALIZAR ESTADO ---
      // Todo listo, actualizamos el estado
      setStats({
        totalEmpadronados,
        totalVotosEmitidos,
        porcentajeParticipacion: parseFloat(porcentajeParticipacion),
        mesasActivas,
    //  participacionPorSexo,
    //  participacionPorEdad,
    //  participacionNuevos,
    //  participacionObligatorios,
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
      <div className="bg-white rounded-xl shadow-lg p-3">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div>
            {/* <h2 className="text-2xl font-bold text-gray-900">Estadísticas Generales</h2> */}
            <p className={`text-sm ${isRealtime ? 'text-red-800' : 'text-gray-600'}`}>
              {isRealtime ? 'Vuelve a modo manual para ahorrar datos' : 'Activa tiempo real para actualización automática'}
            </p>
          </div>
          <div className="flex items-center">
            {/* Botón para activar/desactivar modo en tiempo real */}
            <button
              type="button"
              onClick={() => setIsRealtime(!isRealtime)}
              className={`flex items-center space-x-1 text-m transition-all min-w-[170px] ${
                isRealtime
                  ? 'text-green-800'
                  : 'text-gray-800 hover:text-gray-500'
              }`}
            >
              {isRealtime ? <ToggleRight className="w-8 h-6" /> : <ToggleLeft className="w-8 h-6" />}
              <span>{isRealtime ? 'TIEMPO REAL' : 'Modo Manual'}&nbsp;</span>
              {isRealtime && (
                <span className="relative flex h-3 w-3 ml-1">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-700 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
                </span>
              )}
            </button>

            
            {/* Botón de actualización manual: pegado al margen derecho de su mitad */}
            <div className="min-w-[135px]">
                <button
                  type="button"
                  onClick={fetchGeneralStats}
                  disabled={isLoading || isRealtime}
                  className="w-full px-2 py-1.5 bg-blue-600 hover:bg-blue-800 focus:bg-blue-600 focus:outline-none focus:ring-0 disabled:bg-blue-300 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-all shadow-sm border border-blue-400 hover:shadow-md"
                >
                  <RefreshCw className={`w-4 h-4 inline mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  <span>{isLoading ? 'Actualizando...' : 'Actualizar'}</span>
                </button>
              </div>
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
                  <PieChart className="w-8 h-8 text-yellow-600" />
                  <div>
                    <p className="text-2xl font-bold text-yellow-900">{stats.porcentajeParticipacion.toLocaleString()}%</p>
                    <p className="text-sm text-yellow-700">Participación General</p>
                  </div>
                </div>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <SmartphoneNfc className="w-8 h-8 text-purple-600" />
                  <div>
                    <p className="text-2xl font-bold text-purple-900">{formatNumber(stats.mesasActivas)}</p>
                    <p className="text-sm text-purple-700">Mesas Activas</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Ultimos 5 votos registrados */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900">Últimos Votos Registrados</h3>
                <button
                  type="button"
                  onClick={openVotosModal}
                  className="flex items-center space-x-1 px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg transition-colors"
                >
                  <List className="w-3.5 h-3.5" />
                  <span>Ver historial</span>
                </button>
              </div>
              {ultimosVotos.length === 0 ? (
                <p className="text-gray-500 text-sm">No hay votos registrados aún</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase">Hora</th>
                        <th className="px-2 py-1 text-right text-xs font-medium text-gray-500 uppercase">Mesa</th>
                        <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase">Localidad</th>
                        <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase">Votante</th>
                        <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase">Documento</th>
                        <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase">Pick</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {ultimosVotos.map((v, i) => (
                        <tr key={i} className={`hover:bg-gray-50 ${v.pick ? 'text-green-800' : ''}`}>
                          <td className="px-2 py-1 whitespace-nowrap text-xs">{v.hora}</td>
                          <td className="px-2 py-1 whitespace-nowrap text-xs text-right">{v.mesa}</td>
                          <td className="px-2 py-1 whitespace-nowrap text-xs">{v.localidad}</td>
                          <td className="px-2 py-1 whitespace-nowrap text-xs">{v.votante}</td>
                          <td className="px-2 py-1 whitespace-nowrap text-xs">{v.documento}</td>
                          <td className="px-2 py-1 whitespace-nowrap text-xs">
                            {v.pick ? v.pick : null}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Gráfico de barras: Participación por hora */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-4">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Participación por Hora</h3>
              </div>
              <div className="h-72">
                {stats.participacionPorHora.some(item => item.count > 0) ? (
                  <Bar
                    data={{
                      labels: stats.participacionPorHora.map(item => item.hour),
                      datasets: [{
                        label: 'Votos por Hora',
                        data: stats.participacionPorHora.map(item => item.count),
                        backgroundColor: 'rgba(59, 130, 246, 0.6)',
                        borderColor: 'rgba(59, 130, 246, 1)',
                        borderWidth: 1,
                      }]
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { position: 'top', labels: { font: { size: 12 } } },
                        title: { display: false }
                      },
                      scales: {
                        y: { beginAtZero: true, title: { display: true, text: 'Número de Votos' } },
                        x: { title: { display: true, text: 'Hora del Día' } }
                      }
                    }}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500 text-sm">
                    No hay datos de participación por hora disponibles
                  </div>
                )}
              </div>
            </div>

            {/* Detalles por categoría */}

  {/*DESACTIVADO DESDE ACA...
            
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

      DESACTIVADO HASTA ACA - CAMBIAR DE PESTAÑA O ELIMINAR  /*}
            
            {/* Participación por hora */}
            <div className="bg-white border border-gray-200 rounded-lg p-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Participación por Rango Horario</h3>
              {stats.participacionPorHora.every(item => item.count === 0) ? (
                <p className="text-gray-500 text-sm">No hay datos de horario registrados</p>
              ) : (
                <div className="space-y-3">
                  <div className="grid grid-cols-5 gap-4">
                    {['08:00','09:00','10:00','11:00','12:00'].map(h => {
                      const item = stats.participacionPorHora.find(i => i.hour === h);
                      return (
                        <div key={h} className="text-center">
                          <div className="text-sm text-gray-600">{h}</div>
                          <div className="text-lg font-bold text-blue-600">{formatNumber(item?.count || 0)}</div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="grid grid-cols-5 gap-4">
                    {['13:00','14:00','15:00','16:00','17:00'].map(h => {
                      const item = stats.participacionPorHora.find(i => i.hour === h);
                      return (
                        <div key={h} className="text-center">
                          <div className="text-sm text-gray-600">{h}</div>
                          <div className="text-lg font-bold text-blue-600">{formatNumber(item?.count || 0)}</div>
                        </div>
                      );
                    })}
                  </div>
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
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900">Todas las Mesas</h3> 
            
                <div className="text-sm font-bold text-purple-700 text-left rounded-full shadow-sm ">
                  {horaActual} h
                </div>
              
              <button
                onClick={() => setShowMesasModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Toggle de Participación / Tendencia */}
            <div className="mb-4 flex items-center justify-between bg-gray-50 rounded-lg p-3">
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => setShowTendencia(false)}
                  disabled={!puedeCalcularTendencia && showTendencia}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                    !showTendencia
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Participación Actual</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowTendencia(true)}
                  disabled={!puedeCalcularTendencia}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                    showTendencia
                      ? 'bg-purple-600 text-white'
                      : puedeCalcularTendencia
                      ? 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-300'
                  }`}
                >
                  <TrendingUp className="w-4 h-4" />
                  <span>Tendencia Proyectada</span>
                </button>
              </div>
            
              {showTendencia && puedeCalcularTendencia}

              {!puedeCalcularTendencia && (
                <div className="text-xs text-yellow-600 bg-yellow-50 px-3 py-1 rounded-lg border border-yellow-200">
                  Tendencia disponible después de las 09:00 hs
                </div>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">Mesa</th>
                    <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      {showTendencia ? 'Tend.' : 'Part.'}
                    </th>
                    <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">Establecimiento</th>
                    <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">Padrón</th>
                    <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">Votaron</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {stats.mesasPorParticipacion.map((mesa) => {
                    const valorMostrar = showTendencia ? mesa.tendenciaProyectada : mesa.participacion;
                    const esNA = showTendencia && mesa.tendenciaProyectada === null;

                    let colorClase = '';
                    if (esNA) {
                      colorClase = 'bg-gray-100 text-gray-500';
                    } else if (showTendencia) {
                      const tendencia = parseFloat(valorMostrar);
                      const colorTendencia = obtenerColorTendencia(tendencia);
                      colorClase = colorTendencia === 'green'
                        ? 'bg-green-100 text-green-800'
                        : colorTendencia === 'yellow'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800';
                    } else {
                      const participacion = parseFloat(valorMostrar);
                      colorClase = participacion >= stats.porcentajeParticipacion * 0.95
                        ? 'bg-green-100 text-green-800'
                        : participacion >= stats.porcentajeParticipacion * 0.65
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800';
                    }

                    return (
                      <tr key={mesa.mesa}>
                        <td className="px-1 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                          Mesa {mesa.mesa}
                        </td>
                        <td className="px-1 py-1 whitespace-nowrap text-sm text-gray-900">
                          <span className={`px-1 py-1 rounded-full text-xs font-medium ${colorClase}`}>
                            {esNA ? 'N/A' : `${valorMostrar}%`}
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
                    );
                  })}
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

      {/* Modal: Historial de Votos */}
      {showVotosModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowVotosModal(false)}
        >
          <div
            className="bg-white rounded-xl shadow-2xl p-6 max-w-4xl w-full mx-4 max-h-[90vh] flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Historial de Votos</h3>
                {modalTotal > 0 && (
                  <p className="text-xs text-gray-500 mt-0.5">
                    {modalTotal.toLocaleString()} votos registrados &mdash; Página {modalPage} de {Math.ceil(modalTotal / MODAL_PAGE_SIZE)}
                  </p>
                )}
              </div>
              <button
                onClick={() => setShowVotosModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {modalLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-blue-600"></div>
                  <span className="ml-3 text-sm text-gray-500">Cargando...</span>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr>
                        <th className="px-2 py-1.5 text-left text-xs font-medium text-gray-500 uppercase">Hora</th>
                        <th className="px-2 py-1.5 text-right text-xs font-medium text-gray-500 uppercase">Mesa</th>
                        <th className="px-2 py-1.5 text-left text-xs font-medium text-gray-500 uppercase">Localidad</th>
                        <th className="px-2 py-1.5 text-left text-xs font-medium text-gray-500 uppercase">Votante</th>
                        <th className="px-2 py-1.5 text-left text-xs font-medium text-gray-500 uppercase">Documento</th>
                        <th className="px-2 py-1.5 text-left text-xs font-medium text-gray-500 uppercase">Pick</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {modalVotos.map((v, i) => (
                        <tr key={i} className={`hover:bg-gray-50 ${v.pick ? 'text-green-800' : ''}`}>
                          <td className="px-2 py-1 whitespace-nowrap text-xs">{v.hora}</td>
                          <td className="px-2 py-1 whitespace-nowrap text-xs text-right">{v.mesa}</td>
                          <td className="px-2 py-1 whitespace-nowrap text-xs">{v.localidad}</td>
                          <td className="px-2 py-1 whitespace-nowrap text-xs">{v.votante}</td>
                          <td className="px-2 py-1 whitespace-nowrap text-xs">{v.documento}</td>
                          <td className="px-2 py-1 whitespace-nowrap text-xs">{v.pick || null}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Paginación */}
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200">
              <button
                type="button"
                onClick={() => fetchVotosModal(modalPage - 1)}
                disabled={modalPage <= 1 || modalLoading}
                className="flex items-center space-x-1 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Anterior</span>
              </button>

              <span className="text-xs text-gray-500">
                {modalTotal > 0
                  ? `${((modalPage - 1) * MODAL_PAGE_SIZE) + 1}–${Math.min(modalPage * MODAL_PAGE_SIZE, modalTotal)} de ${modalTotal.toLocaleString()}`
                  : ''}
              </span>

              <button
                type="button"
                onClick={() => fetchVotosModal(modalPage + 1)}
                disabled={modalPage >= Math.ceil(modalTotal / MODAL_PAGE_SIZE) || modalLoading}
                className="flex items-center space-x-1 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <span>Siguiente</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}