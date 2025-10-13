import React, { useState, useEffect } from 'react';
import { BarChart3, Search, RefreshCw, AlertCircle, Filter, MapPin, Hash } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';

/**
 * Componente ResultadosTestigo - Vista de resultados para usuarios tipo 2 o inferior
 * 
 * Propósito: Permite a los administradores filtrar y ver todos los registros
 * de testigos del sistema con estadísticas y análisis.
 */
export default function ResultadosTestigo() {
  const { user } = useAuth();

  // Estados para filtros
  const [filterLocalidad, setFilterLocalidad] = useState('');
  const [filterMesaNumero, setFilterMesaNumero] = useState('');

  // Estados para resultados
  const [testigosResults, setTestigosResults] = useState([]);
  const [isLoadingResults, setIsLoadingResults] = useState(false);
  const [error, setError] = useState('');

  // Estados para localidades disponibles
  const [availableLocalidades, setAvailableLocalidades] = useState([]);

  // Estados para estadísticas
  const [stats, setStats] = useState({
    totalRegistros: 0,
    mesasConTestigos: 0,
    promedioFaltante: 0,
    promedioPorcentaje: 0
  });

  /**
   * Efecto para cargar datos iniciales
   */
  useEffect(() => {
    fetchLocalidades();
    fetchAllTestigos();
  }, []);

  /**
   * Carga las localidades disponibles
   */
  const fetchLocalidades = async () => {
    try {
      const { data, error } = await supabase
        .from('circuitos')
        .select('localidad')
        .not('localidad', 'is', null)
        .order('localidad');

      if (error) {
        console.error('Error fetching localidades:', error);
        return;
      }

      const uniqueLocalidades = [...new Set(data.map(item => item.localidad))];
      setAvailableLocalidades(uniqueLocalidades);
    } catch (error) {
      console.error('Error loading localidades:', error);
    }
  };

  /**
   * Obtiene todos los registros de testigos con filtros aplicados
   */
  const fetchAllTestigos = async (applyFilters = false) => {
    setIsLoadingResults(true);
    setError('');

    try {
      let query = supabase
        .from('testigos')
        .select(`
          *,
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
        `);

      // Aplicar filtros si están activos
      if (applyFilters) {
        if (filterMesaNumero) {
          const mesaNum = parseInt(filterMesaNumero);
          if (!isNaN(mesaNum)) {
            query = query.eq('mesa_numero', mesaNum);
          }
        }

        if (filterLocalidad) {
          query = query.ilike('mesas.establecimientos.circuitos.localidad', `%${filterLocalidad}%`);
        }
      }

      query = query.order('user_at', { ascending: false });

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching testigos results:', error);
        setError('Error al cargar los resultados');
        return;
      }

      setTestigosResults(data || []);
      calculateStats(data || []);

    } catch (error) {
      console.error('Error during fetch:', error);
      setError('Error al cargar los resultados');
    } finally {
      setIsLoadingResults(false);
    }
  };

  /**
   * Calcula estadísticas de los registros
   */
  const calculateStats = (data) => {
    if (data.length === 0) {
      setStats({
        totalRegistros: 0,
        mesasConTestigos: 0,
        promedioFaltante: 0,
        promedioPorcentaje: 0
      });
      return;
    }

    const totalRegistros = data.length;
    const mesasConTestigos = new Set(data.map(r => r.mesa_numero)).size;
    
    const totalFaltante = data.reduce((sum, r) => sum + (r.pila_faltante || 0), 0);
    const promedioFaltante = (totalFaltante / totalRegistros).toFixed(1);

    // Calcular promedio de porcentajes
    const porcentajes = data.map(r => {
      if (r.votos_diferencia > 0) {
        return (r.pila_faltante / r.votos_diferencia) * 100;
      }
      return 0;
    });
    
    const totalPorcentaje = porcentajes.reduce((sum, p) => sum + p, 0);
    const promedioPorcentaje = (totalPorcentaje / totalRegistros).toFixed(1);

    setStats({
      totalRegistros,
      mesasConTestigos,
      promedioFaltante: parseFloat(promedioFaltante),
      promedioPorcentaje: parseFloat(promedioPorcentaje)
    });
  };

  /**
   * Aplica los filtros seleccionados
   */
  const handleApplyFilters = () => {
    fetchAllTestigos(true);
  };

  /**
   * Limpia todos los filtros
   */
  const handleClearFilters = () => {
    setFilterLocalidad('');
    setFilterMesaNumero('');
    fetchAllTestigos(false);
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
      second: '2-digit'
    });
  };

  // Verificar permisos
  if (!user || user.usuario_tipo > 2) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="text-center py-12">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Sin permisos</h3>
          <p className="text-red-600">No tiene permisos para acceder a los resultados</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Panel de estadísticas */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Estadísticas Generales</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <BarChart3 className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold text-blue-900">{stats.totalRegistros}</p>
                <p className="text-sm text-blue-700">Total Registros</p>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Hash className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-green-900">{stats.mesasConTestigos}</p>
                <p className="text-sm text-green-700">Mesas con Testigos</p>
              </div>
            </div>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <BarChart3 className="w-8 h-8 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold text-yellow-900">{stats.promedioFaltante}</p>
                <p className="text-sm text-yellow-700">Prom. Faltante</p>
              </div>
            </div>
          </div>
          
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <BarChart3 className="w-8 h-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold text-purple-900">{stats.promedioPorcentaje}%</p>
                <p className="text-sm text-purple-700">Prom. Porcentaje</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Panel de filtros */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Filter className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Filtros de Búsqueda</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Filtro por localidad */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>Localidad</span>
              </div>
            </label>
            <select
              value={filterLocalidad}
              onChange={(e) => setFilterLocalidad(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            >
              <option value="">Todas las localidades</option>
              {availableLocalidades.map((localidad) => (
                <option key={localidad} value={localidad}>
                  {localidad}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro por número de mesa */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center space-x-2">
                <Hash className="w-4 h-4" />
                <span>Número de Mesa</span>
              </div>
            </label>
            <input
              type="number"
              value={filterMesaNumero}
              onChange={(e) => setFilterMesaNumero(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              placeholder="Número de mesa"
            />
          </div>
        </div>

        {/* Botones de acción para filtros */}
        <div className="flex space-x-3">
          <button
            onClick={handleApplyFilters}
            disabled={isLoadingResults}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50"
          >
            <Search className="w-4 h-4" />
            <span>Aplicar Filtros</span>
          </button>
          
          <button
            onClick={handleClearFilters}
            disabled={isLoadingResults}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Limpiar Filtros</span>
          </button>
        </div>
      </div>

      {/* Panel de resultados */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">
            Resultados de Testigos
          </h3>
          <span className="text-sm text-gray-600">
            {testigosResults.length} registro{testigosResults.length !== 1 ? 's' : ''}
          </span>
        </div>

        {isLoadingResults ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Cargando resultados...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-600">
            <AlertCircle className="w-12 h-12 mx-auto mb-3" />
            <p>{error}</p>
          </div>
        ) : testigosResults.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <BarChart3 className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No se encontraron registros de testigos</p>
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
                    Localidad
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Establecimiento
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
                    Votos Diferencia
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Porcentaje
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Válida
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {testigosResults.map((record) => {
                  const porcentaje = record.votos_diferencia > 0 
                    ? ((record.pila_faltante / record.votos_diferencia) * 100).toFixed(1)
                    : '0.0';
                  
                  return (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        Mesa {record.mesa_numero}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.mesas?.establecimientos?.circuitos?.localidad || 'N/A'}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.mesas?.establecimientos?.nombre || 'N/A'}
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
                        {record.votos_diferencia || 0}
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
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          record.muestra_valida ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {record.muestra_valida ? '✓ Válida' : '✗ Inválida'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}