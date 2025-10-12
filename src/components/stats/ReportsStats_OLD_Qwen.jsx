import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { FileText, AlertCircle, Hash, User, Clock, BarChart3 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function ReportsStats() {
  const { user } = useAuth();
  const [testigosData, setTestigosData] = useState([]);
  const [testigosStats, setTestigosStats] = useState({
    totalRegistros: 0,
    mesasConTestigos: 0,
    promedioVotosInicio: 0,
    promedioPilaInicio: 0,
    totalPilaFaltante: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTestigosData();
  }, [user]);

  const fetchTestigosData = async () => {
    setIsLoading(true);
    setError('');
    try {
      // Fetch testigos data with related information
      const { data: testigos, error: testigosError } = await supabase
        .from('testigos')
        .select(`
          id,
          mesa_numero,
          pila_inicio,
          votos_inicio,
          pila_faltante,
          user_id,
          user_at,
          profiles!testigos_user_id_fkey(
            full_name
          ),
          mesas!testigos_mesa_numero_fkey(
            numero,
            establecimientos(
              nombre,
              circuitos(
                localidad
              )
            )
          )
        `)
        .order('user_at', { ascending: false });

      if (testigosError) {
        throw testigosError;
      }

      setTestigosData(testigos || []);

      // Calculate statistics
      const totalRegistros = testigos?.length || 0;
      const mesasConTestigos = new Set(testigos?.map(t => t.mesa_numero).filter(Boolean)).size;
      
      const votosInicioSum = testigos?.reduce((sum, t) => sum + (t.votos_inicio || 0), 0) || 0;
      const pilaInicioSum = testigos?.reduce((sum, t) => sum + (t.pila_inicio || 0), 0) || 0;
      const pilaFaltanteSum = testigos?.reduce((sum, t) => sum + (t.pila_faltante || 0), 0) || 0;

      const promedioVotosInicio = totalRegistros > 0 ? (votosInicioSum / totalRegistros).toFixed(1) : 0;
      const promedioPilaInicio = totalRegistros > 0 ? (pilaInicioSum / totalRegistros).toFixed(1) : 0;

      setTestigosStats({
        totalRegistros,
        mesasConTestigos,
        promedioVotosInicio: parseFloat(promedioVotosInicio),
        promedioPilaInicio: parseFloat(promedioPilaInicio),
        totalPilaFaltante: pilaFaltanteSum
      });

    } catch (err) {
      setError('Error loading testigos data.');
      console.error('Error fetching testigos data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('es-AR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Reportes de Testigos</h2>
        <p className="text-gray-600 mb-6">Estadísticas y registros basados en la tabla de testigos.</p>

        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Cargando reportes...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-600">
            <AlertCircle className="w-12 h-12 mx-auto mb-3" />
            <p>{error}</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <FileText className="w-8 h-8 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold text-blue-900">{testigosStats.totalRegistros}</p>
                    <p className="text-sm text-blue-700">Total Registros</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <Hash className="w-8 h-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold text-green-900">{testigosStats.mesasConTestigos}</p>
                    <p className="text-sm text-green-700">Mesas con Testigos</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <BarChart3 className="w-8 h-8 text-yellow-600" />
                  <div>
                    <p className="text-2xl font-bold text-yellow-900">{testigosStats.promedioVotosInicio}</p>
                    <p className="text-sm text-yellow-700">Prom. Votos Inicio</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <BarChart3 className="w-8 h-8 text-purple-600" />
                  <div>
                    <p className="text-2xl font-bold text-purple-900">{testigosStats.promedioPilaInicio}</p>
                    <p className="text-sm text-purple-700">Prom. Pila Inicio</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <AlertCircle className="w-8 h-8 text-red-600" />
                  <div>
                    <p className="text-2xl font-bold text-red-900">{testigosStats.totalPilaFaltante}</p>
                    <p className="text-sm text-red-700">Total Pila Faltante</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Testigos Table */}
            {testigosData.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-3" />
                <p>No se encontraron registros de testigos.</p>
              </div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Registros de Testigos ({testigosData.length})
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Mesa
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Establecimiento
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Localidad
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Pila Inicio
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Votos Inicio
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Pila Faltante
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Usuario
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Fecha/Hora
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {testigosData.map(record => (
                        <tr key={record.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            Mesa {record.mesa_numero}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {record.mesas?.establecimientos?.nombre || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {record.mesas?.establecimientos?.circuitos?.localidad || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {record.pila_inicio || 0}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {record.votos_inicio || 0}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              (record.pila_faltante || 0) > 0 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                            }`}>
                              {record.pila_faltante || 0}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {record.profiles?.full_name || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatDateTime(record.user_at)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}