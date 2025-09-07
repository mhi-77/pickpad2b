import React, { useRef, useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { supabase } from '../../lib/supabase';
import { FileText, BarChart3, PieChart, AlertCircle } from 'lucide-react';

// Registrar los componentes necesarios de Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

/**
 * Componente ReportsStats - Vista de reportes y gráficos estadísticos
 * 
 * Propósito: Proporciona visualizaciones gráficas de los datos electorales
 * incluyendo participación por hora, distribución por localidad y otros
 * indicadores clave del proceso electoral.
 */
export default function ReportsStats() {
  // Referencias para los gráficos
  const barChartRef = useRef(null);
  const pieChartRef = useRef(null);

  // Estados para los datos y carga
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [participacionPorHora, setParticipacionPorHora] = useState([]);
  const [participacionPorLocalidad, setParticipacionPorLocalidad] = useState([]);

  /**
   * Efecto para cargar datos al montar el componente
   */
  useEffect(() => {
    cargarDatosReportes();
  }, []);

  /**
   * Carga los datos necesarios para generar los reportes
   */
  const cargarDatosReportes = async () => {
    setIsLoading(true);
    setError('');

    try {
      // Obtener datos de participación por hora
      await cargarParticipacionPorHora();
      
      // Obtener datos de participación por localidad
      await cargarParticipacionPorLocalidad();

    } catch (err) {
      console.error('Error cargando datos de reportes:', err);
      setError('Error al cargar los datos de reportes');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Carga los datos de participación por hora
   */
  const cargarParticipacionPorHora = async () => {
    try {
      const { data, error } = await supabase
        .from('padron')
        .select('voto_pick_at')
        .eq('voto_emitido', true)
        .not('voto_pick_at', 'is', null);

      if (error) throw error;

      // Procesar datos por hora (8:00 a 18:00)
      const datosPorHora = [];
      for (let hora = 8; hora <= 18; hora++) {
        const votosEnHora = data.filter(registro => {
          const fecha = new Date(registro.voto_pick_at);
          return fecha.getHours() === hora;
        }).length;
        
        datosPorHora.push({
          hora: `${hora.toString().padStart(2, '0')}:00`,
          votos: votosEnHora
        });
      }

      setParticipacionPorHora(datosPorHora);
    } catch (error) {
      console.error('Error cargando participación por hora:', error);
    }
  };

  /**
   * Carga los datos de participación por localidad
   */
  const cargarParticipacionPorLocalidad = async () => {
    try {
      const { data, error } = await supabase
        .from('padron')
        .select(`
          voto_emitido,
          mesas!inner(
            establecimientos!inner(
              circuitos!inner(
                localidad
              )
            )
          )
        `)
        .not('mesas.establecimientos.circuitos.localidad', 'is', null);

      if (error) throw error;

      // Procesar datos por localidad
      const localidadMap = new Map();
      
      data.forEach(registro => {
        const localidad = registro.mesas?.establecimientos?.circuitos?.localidad;
        if (localidad) {
          if (!localidadMap.has(localidad)) {
            localidadMap.set(localidad, { total: 0, votaron: 0 });
          }
          const stats = localidadMap.get(localidad);
          stats.total += 1;
          if (registro.voto_emitido) {
            stats.votaron += 1;
          }
        }
      });

      const datosLocalidad = Array.from(localidadMap.entries())
        .map(([localidad, stats]) => ({
          localidad,
          total: stats.total,
          votaron: stats.votaron,
          porcentaje: ((stats.votaron / stats.total) * 100).toFixed(1)
        }))
        .sort((a, b) => b.votaron - a.votaron)
        .slice(0, 8); // Top 8 localidades

      setParticipacionPorLocalidad(datosLocalidad);
    } catch (error) {
      console.error('Error cargando participación por localidad:', error);
    }
  };

  // Configuración del gráfico de barras (participación por hora)
  const datosGraficoBarras = {
    labels: participacionPorHora.map(item => item.hora),
    datasets: [
      {
        label: 'Votos por Hora',
        data: participacionPorHora.map(item => item.votos),
        backgroundColor: 'rgba(59, 130, 246, 0.6)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
    ],
  };

  const opcionesGraficoBarras = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        position: 'top',
        labels: {
          font: { size: 12 }
        }
      },
      title: { 
        display: true, 
        text: 'Participación Electoral por Hora',
        font: { size: 16, weight: 'bold' }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Número de Votos'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Hora del Día'
        }
      }
    }
  };

  // Configuración del gráfico circular (participación por localidad)
  const datosGraficoCircular = {
    labels: participacionPorLocalidad.map(item => item.localidad),
    datasets: [
      {
        label: 'Votos por Localidad',
        data: participacionPorLocalidad.map(item => item.votaron),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 205, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
          'rgba(199, 199, 199, 0.6)',
          'rgba(83, 102, 255, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 205, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(199, 199, 199, 1)',
          'rgba(83, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const opcionesGraficoCircular = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        position: 'right',
        labels: {
          font: { size: 11 }
        }
      },
      title: { 
        display: true, 
        text: 'Distribución de Votos por Localidad (Top 8)',
        font: { size: 16, weight: 'bold' }
      },
    },
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Reportes y Gráficos</h2>
            <p className="text-gray-600 mt-1">
              Visualizaciones gráficas de los datos electorales
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">Análisis Visual</span>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Cargando datos de reportes...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-600">
            <AlertCircle className="w-12 h-12 mx-auto mb-3" />
            <p>{error}</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Gráfico de Barras - Participación por Hora */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center space-x-2 mb-4">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Participación por Hora
                </h3>
              </div>
              <div className="h-80">
                {participacionPorHora.length > 0 ? (
                  <Bar 
                    data={datosGraficoBarras} 
                    options={opcionesGraficoBarras} 
                    ref={barChartRef} 
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <FileText className="w-12 h-12 mr-3" />
                    <span>No hay datos de participación por hora disponibles</span>
                  </div>
                )}
              </div>
            </div>

            {/* Gráfico Circular - Participación por Localidad */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center space-x-2 mb-4">
                <PieChart className="w-5 h-5 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Distribución por Localidad
                </h3>
              </div>
              <div className="h-80">
                {participacionPorLocalidad.length > 0 ? (
                  <Pie 
                    data={datosGraficoCircular} 
                    options={opcionesGraficoCircular} 
                    ref={pieChartRef} 
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <FileText className="w-12 h-12 mr-3" />
                    <span>No hay datos de participación por localidad disponibles</span>
                  </div>
                )}
              </div>
            </div>

            {/* Tabla de Resumen por Localidad */}
            {participacionPorLocalidad.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Resumen Detallado por Localidad
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          Localidad
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          Total Empadronados
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          Votos Emitidos
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          Participación
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {participacionPorLocalidad.map((localidad, index) => (
                        <tr key={localidad.localidad} className="hover:bg-gray-50">
                          <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                            {localidad.localidad}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                            {localidad.total.toLocaleString()}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                            {localidad.votaron.toLocaleString()}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              localidad.porcentaje >= 80 ? 'bg-green-100 text-green-800' :
                              localidad.porcentaje >= 60 ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {localidad.porcentaje}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Información sobre los gráficos */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-blue-900 mb-2">
                ℹ️ Información sobre los Reportes
              </h4>
              <div className="text-sm text-blue-800 space-y-1">
                <p>• Los gráficos se actualizan automáticamente con los datos más recientes</p>
                <p>• La participación por hora muestra la distribución temporal de los votos</p>
                <p>• La distribución por localidad incluye las 8 localidades con mayor participación</p>
                <p>• Los porcentajes se calculan en base al total de empadronados por localidad</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}