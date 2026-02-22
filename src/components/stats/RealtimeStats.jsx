import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Filter, RefreshCw, User, MapPin, Hash, SquarePen, AlertCircle } from 'lucide-react';
import { loadEmopicksWithCount, formatEmopickDisplay } from '../../utils/emopicksUtils';
import Pagination from '../shared/Pagination';

/**
 * Componente RealtimeStats - Estadísticas en tiempo real de votantes pendientes
 *
 * Propósito: Muestra una lista en tiempo real de votantes que aún no han emitido su voto,
 * con múltiples opciones de filtrado para facilitar la fiscalización.
 *
 * Funcionalidades principales:
 * - Lista completa de votantes pendientes (voto_emitido = false)
 * - Filtros por: localidad, número de mesa, apellido, emopick
 * - Métricas agregadas: total pendientes, con/sin emopick asignado
 * - Visualización de información completa del votante (nombre, documento, mesa, establecimiento)
 * - Actualización manual de datos con botón de recarga
 * - Indicador visual del estado de emopick
 *
 * Métricas calculadas:
 * - Total de votantes pendientes
 * - Votantes pendientes con emopick asignado
 * - Votantes pendientes sin emopick asignado
 *
 * Casos de uso:
 * - Monitoreo de participación durante el día electoral
 * - Identificación de votantes que necesitan ser contactados
 * - Análisis de participación por localidad o mesa
 */
export default function RealtimeStats() {
  const [unvotedVoters, setUnvotedVoters] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Filter input states (controlled inputs, not yet applied)
  const [filterMesaInput, setFilterMesaInput] = useState('');
  const [filterEmopickInput, setFilterEmopickInput] = useState('');
  const [hasUnappliedChanges, setHasUnappliedChanges] = useState(false);

  // Filter states (applied on button click)
  const [filterLocality, setFilterLocality] = useState('');
  const [filterMesa, setFilterMesa] = useState('');
  const [filterApellido, setFilterApellido] = useState('');
  const [filterEmopick, setFilterEmopick] = useState('');
  const [filterMetricType, setFilterMetricType] = useState(null);

  // Available filter options (e.g., from database)
  const [availableLocalities, setAvailableLocalities] = useState([]);
  const [availableEmopicks, setAvailableEmopicks] = useState([]);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(() => {
    const saved = localStorage.getItem('realtimeStatsPageSize');
    return saved ? parseInt(saved, 10) : 25;
  });
  const [totalCount, setTotalCount] = useState(0);

  // Metrics
  const [metrics, setMetrics] = useState({
    totalPendientes: 0,
    pendientesConEmopick: 0,
    pendientesSinEmopick: 0
  });

  useEffect(() => {
    // Load initial data and filter options
    const fetchInitialData = async () => {
      setIsLoading(true);
      setError('');
      try {
        // Load filter options
        await loadFilterOptions();
        // Load initial data without filters
        await fetchUnvotedVoters();
      } catch (err) {
        setError('Error loading initial data.');
        console.error('Error in fetchInitialData:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  const loadFilterOptions = async () => {
    try {
      // Load localities
      const { data: localities, error: localitiesError } = await supabase
        .from('circuitos')
        .select('localidad')
        .not('localidad', 'is', null)
        .order('localidad');

      if (!localitiesError) {
        const uniqueLocalities = [...new Set(localities.map(item => item.localidad))];
        setAvailableLocalities(uniqueLocalities);
      }

      // Cargar emopicks - solo aquellos con count > 0
      const emopicks = await loadEmopicksWithCount();
      setAvailableEmopicks(emopicks || []);
    } catch (error) {
      console.error('Error loading filter options:', error);
    }
  };

  const fetchUnvotedVoters = async () => {
    try {
      // Base query for unvoted voters with count
      let query = supabase
        .from('padron')
        .select(`
          documento,
          apellido,
          nombre,
          mesa_numero,
          emopick_id,
          pick_nota,
          pick_check,
          mesas!inner(
            numero,
            establecimientos!inner(
              id,
              nombre,
              circuitos!inner(
                codigo,
                localidad
              )
            )
          ),
          emopicks(
            id,
            display
          )
        `, { count: 'exact' })
        .or('voto_emitido.is.null,voto_emitido.eq.false');

      // Apply filters
      if (filterLocality) {
        query = query.ilike('mesas.establecimientos.circuitos.localidad', `%${filterLocality}%`);
      }

      if (filterMesa) {
        const mesaNumber = parseInt(filterMesa);
        if (!isNaN(mesaNumber)) {
          query = query.eq('mesa_numero', mesaNumber);
        }
      }

      if (filterApellido) {
        query = query.ilike('apellido', `%${filterApellido}%`);
      }

      if (filterEmopick) {
        const emopickId = parseInt(filterEmopick);
        if (!isNaN(emopickId)) {
          query = query.eq('emopick_id', emopickId);
        }
      }

      // Apply metric filter
      if (filterMetricType === 'conPicks') {
        query = query.not('emopick_id', 'is', null);
      }

      // Apply pagination
      const from = (currentPage - 1) * pageSize;
      const to = from + pageSize - 1;

      query = query
        .order('apellido', { ascending: true })
        .order('nombre', { ascending: true })
        .range(from, to);

      const { data, error, count } = await query;

      if (error) {
        console.error('Error fetching unvoted voters:', error);
        setError('Error al cargar votantes pendientes');
        return;
      }

      setUnvotedVoters(data || []);
      setTotalCount(count || 0);

      // Calculate metrics based on total count
      // Need to fetch metrics separately for accurate counts
      await fetchMetrics();

    } catch (error) {
      console.error('Error fetching unvoted voters:', error);
      setError('Error al cargar votantes pendientes');
    }
  };

  const fetchMetrics = async () => {
    try {
      const applyBaseFiltersWithoutEmopick = (q) => {
        if (filterLocality) {
          q = q.ilike('mesas.establecimientos.circuitos.localidad', `%${filterLocality}%`);
        }
        if (filterMesa) {
          const mesaNumber = parseInt(filterMesa);
          if (!isNaN(mesaNumber)) q = q.eq('mesa_numero', mesaNumber);
        }
        if (filterApellido) {
          q = q.ilike('apellido', `%${filterApellido}%`);
        }
        return q;
      };

      let totalQuery = supabase
        .from('padron')
        .select('emopick_id', { count: 'exact', head: true })
        .or('voto_emitido.is.null,voto_emitido.eq.false');
      totalQuery = applyBaseFiltersWithoutEmopick(totalQuery);
      const { count: total } = await totalQuery;

      let conEmopickQuery = supabase
        .from('padron')
        .select('emopick_id', { count: 'exact', head: true })
        .or('voto_emitido.is.null,voto_emitido.eq.false')
        .not('emopick_id', 'is', null);
      conEmopickQuery = applyBaseFiltersWithoutEmopick(conEmopickQuery);
      if (filterEmopick) {
        const emopickId = parseInt(filterEmopick);
        if (!isNaN(emopickId)) conEmopickQuery = conEmopickQuery.eq('emopick_id', emopickId);
      }
      const { count: conEmopick } = await conEmopickQuery;

      setMetrics({
        totalPendientes: total || 0,
        pendientesConEmopick: conEmopick || 0,
        pendientesSinEmopick: (total || 0) - (conEmopick || 0)
      });

    } catch (error) {
      console.error('Error fetching metrics:', error);
    }
  };

  const handleApplyFilters = () => {
    setFilterMesa(filterMesaInput);
    setFilterEmopick(filterEmopickInput);
    setCurrentPage(1);
    setHasUnappliedChanges(false);
  };

  const handleClearFilters = () => {
    setFilterMesaInput('');
    setFilterEmopickInput('');
    setFilterLocality('');
    setFilterMesa('');
    setFilterApellido('');
    setFilterEmopick('');
    setFilterMetricType(null);
    setCurrentPage(1);
    setHasUnappliedChanges(false);
  };

  const handleMetricClick = (metricType) => {
    if (filterMetricType === metricType) {
      setFilterMetricType(null);
    } else {
      setFilterMetricType(metricType);
    }
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
    setCurrentPage(1);
    localStorage.setItem('realtimeStatsPageSize', newSize.toString());
  };

  useEffect(() => {
    setIsLoading(true);
    fetchUnvotedVoters().finally(() => setIsLoading(false));
  }, [currentPage, pageSize, filterLocality, filterMesa, filterApellido, filterEmopick, filterMetricType]);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Tiempo Real: Votantes Pendientes</h2>
        <p className="text-gray-600 mb-6">Visualización de votantes que aún no han emitido su voto.</p>

        {/* Filter Section */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
            <Filter className="w-5 h-5" />
            <span>Filtros</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    {/*        
           <div>
              <label htmlFor="filterLocality" className="block text-sm font-medium text-gray-700 mb-1">Localidad</label>
              <select
                id="filterLocality"
                value={filterLocality}
                onChange={(e) => setFilterLocality(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Todas</option>
                {availableLocalities.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div> 
     */}       
            <div>
              <label htmlFor="filterMesa" className="block text-sm font-medium text-gray-700 mb-1">Mesa</label>
              <input
                id="filterMesa"
                type="number"
                value={filterMesaInput}
                onChange={(e) => { setFilterMesaInput(e.target.value); setHasUnappliedChanges(true); }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ej: 123"
              />
            </div>
    {/*       <div>
              <label htmlFor="filterApellido" className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
              <input
                id="filterApellido"
                type="text"
                value={filterApellido}
                onChange={(e) => setFilterApellido(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ej: García"
              />
            </div> */}
            <div>
              <label htmlFor="filterEmopick" className="block text-sm font-medium text-gray-700 mb-1">Pick</label>
              <select
                id="filterEmopick"
                value={filterEmopickInput}
                onChange={(e) => { setFilterEmopickInput(e.target.value); setHasUnappliedChanges(true); }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Todos</option>
                {availableEmopicks.map(pick => (
                  <option key={pick.id} value={pick.id}>{formatEmopickDisplay(pick.display, pick.count)}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-6 flex space-x-3">
            <button
              onClick={handleClearFilters}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
              disabled={isLoading}
            >
              <RefreshCw className="w-4 h-4" />
              <span>Limpiar Filtros</span>
            </button>
            <button
              onClick={handleApplyFilters}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading || !hasUnappliedChanges}
            >
              <Filter className="w-4 h-4" />
              <span>Aplicar Filtros</span>
            </button>
 
          </div>
        </div>

        {/* Metrics Section */}
        <div className="grid grid-cols-2 gap-4 mb-6 max-w-md mx-auto">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <h3 className="text-sm font-semibold text-blue-900">Total Pendientes</h3>
            <p className="text-xl font-bold text-blue-800">{metrics.totalPendientes}</p>
          </div>
          <button
            onClick={() => handleMetricClick('conPicks')}
            className={`rounded-lg p-3 transition-all duration-200 text-left ${
              filterMetricType === 'conPicks'
                ? 'bg-yellow-100 border-2 border-yellow-500 shadow-md ring-2 ring-yellow-300'
                : 'bg-yellow-50 border border-yellow-200 hover:bg-yellow-100 hover:shadow-sm'
            }`}
          >
            <h3 className="text-sm font-semibold text-yellow-900 flex items-center justify-between">
              {(() => {
                const activeEmopick = filterEmopick ? availableEmopicks.find(p => String(p.id) === String(filterEmopick)) : null;
                return `Pendientes con ${activeEmopick ? activeEmopick.display : 'Picks'}`;
              })()}
              {filterMetricType === 'conPicks' && <span className="text-yellow-600">✓</span>}
            </h3>
            <p className="text-xl font-bold text-yellow-800">{metrics.pendientesConEmopick}</p>
          </button>
          {/*         <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-red-900">Pendientes sin picks</h3>
            <p className="text-3xl font-bold text-red-800">{metrics.pendientesSinEmopick}</p>
          </div> */}
        </div>

        {/* List Section */}
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Cargando votantes...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-600">
            <AlertCircle className="w-12 h-12 mx-auto mb-3" />
            <p>{error}</p>
          </div>
        ) : unvotedVoters.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <User className="w-12 h-12 mx-auto mb-3" />
            <p>No se encontraron votantes pendientes con los filtros aplicados.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Documento</th>
                  <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Apellido, Nombre</th>
                  <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pick</th>
                  <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check</th>
                  <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nota</th>
                  <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mesa</th>
                  <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Localidad</th>

                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {unvotedVoters.map(voter => (
                  <tr key={voter.documento}>
                    <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-900">{voter.documento}</td>
                    <td className={`px-2 py-2 whitespace-nowrap text-sm text-gray-900 ${voter.emopick_id && !voter.pick_check ? 'font-bold' : ''}`}>
                      {voter.apellido}, {voter.nombre}
                    </td>
                    <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-900">
                      {voter.emopicks?.display || '-'}
                    </td>
                    <td className="px-2 py-2 whitespace-nowrap text-sm text-center">
                      {voter.emopick_id && voter.pick_check && <span className="text-green-600">✓</span>}
                    </td>
                    <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-900">
                      {voter.pick_nota || '-'}
                    </td>
                    <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-900">{voter.mesa_numero}</td>
                    <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-900">
                      {voter.mesas?.establecimientos?.circuitos?.localidad || 'N/A'}
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>

            {totalCount > 0 && (
              <div className="mt-4">
                <Pagination
                  currentPage={currentPage}
                  totalPages={Math.ceil(totalCount / pageSize)}
                  totalItems={totalCount}
                  pageSize={pageSize}
                  onPageChange={handlePageChange}
                  onPageSizeChange={handlePageSizeChange}
                  loading={isLoading}
                  pageSizeOptions={[10, 25, 50, 100, 200]}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}