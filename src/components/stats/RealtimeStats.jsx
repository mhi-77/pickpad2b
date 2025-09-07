import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Filter, RefreshCw, User, MapPin, Hash, SquarePen, AlertCircle } from 'lucide-react';

export default function RealtimeStats() {
  const [unvotedVoters, setUnvotedVoters] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Filter states
  const [filterLocality, setFilterLocality] = useState('');
  const [filterMesa, setFilterMesa] = useState('');
  const [filterApellido, setFilterApellido] = useState('');
  const [filterEmopick, setFilterEmopick] = useState('');

  // Available filter options (e.g., from database)
  const [availableLocalities, setAvailableLocalities] = useState([]);
  const [availableEmopicks, setAvailableEmopicks] = useState([]);

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

      // Load emopicks
      const { data: emopicks, error: emopicksError } = await supabase
        .from('emopicks')
        .select('id, display')
        .order('id');

      if (!emopicksError) {
        setAvailableEmopicks(emopicks || []);
      }
    } catch (error) {
      console.error('Error loading filter options:', error);
    }
  };

  const fetchUnvotedVoters = async () => {
    try {
      // Base query for unvoted voters
      let query = supabase
        .from('padron')
        .select(`
          documento,
          apellido,
          nombre,
          mesa_numero,
          emopick_id,
          pick_nota,
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
        `)
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

      query = query
        .order('apellido', { ascending: true })
        .order('nombre', { ascending: true })
        .limit(350); // Limit for performance

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching unvoted voters:', error);
        setError('Error al cargar votantes pendientes');
        return;
      }

      setUnvotedVoters(data || []);
      
      // Calculate metrics
      const total = data?.length || 0;
      const conEmopick = data?.filter(voter => voter.emopick_id !== null).length || 0;
      const sinEmopick = total - conEmopick;
      
      setMetrics({
        totalPendientes: total,
        pendientesConEmopick: conEmopick,
        pendientesSinEmopick: sinEmopick
      });

    } catch (error) {
      console.error('Error fetching unvoted voters:', error);
      setError('Error al cargar votantes pendientes');
    }
  };

  const handleApplyFilters = () => {
    setIsLoading(true);
    fetchUnvotedVoters().finally(() => setIsLoading(false));
  };

  const handleClearFilters = () => {
    setFilterLocality('');
    setFilterMesa('');
    setFilterApellido('');
    setFilterEmopick('');
    setIsLoading(true);
    fetchUnvotedVoters().finally(() => setIsLoading(false));
  };

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
            <div>
              <label htmlFor="filterMesa" className="block text-sm font-medium text-gray-700 mb-1">Mesa</label>
              <input
                id="filterMesa"
                type="number"
                value={filterMesa}
                onChange={(e) => setFilterMesa(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ej: 123"
              />
            </div>
            <div>
              <label htmlFor="filterApellido" className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
              <input
                id="filterApellido"
                type="text"
                value={filterApellido}
                onChange={(e) => setFilterApellido(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ej: García"
              />
            </div>
            <div>
              <label htmlFor="filterEmopick" className="block text-sm font-medium text-gray-700 mb-1">Emopick</label>
              <select
                id="filterEmopick"
                value={filterEmopick}
                onChange={(e) => setFilterEmopick(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Todos</option>
                {availableEmopicks.map(pick => (
                  <option key={pick.id} value={pick.id}>{pick.display}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-6 flex space-x-3">
            <button
              onClick={handleApplyFilters}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              disabled={isLoading}
            >
              <Filter className="w-4 h-4" />
              <span>Aplicar Filtros</span>
            </button>
            <button
              onClick={handleClearFilters}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
              disabled={isLoading}
            >
              <RefreshCw className="w-4 h-4" />
              <span>Limpiar Filtros</span>
            </button>
          </div>
        </div>

        {/* Metrics Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-blue-900">Total Pendientes</h3>
            <p className="text-3xl font-bold text-blue-800">{metrics.totalPendientes}</p>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-yellow-900">Pendientes con Emopick</h3>
            <p className="text-3xl font-bold text-yellow-800">{metrics.pendientesConEmopick}</p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-red-900">Pendientes sin Emopick</h3>
            <p className="text-3xl font-bold text-red-800">{metrics.pendientesSinEmopick}</p>
          </div>
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
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Documento</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Apellido, Nombre</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mesa</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Localidad</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Emopick</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nota</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {unvotedVoters.map(voter => (
                  <tr key={voter.documento}>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{voter.documento}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{voter.apellido}, {voter.nombre}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{voter.mesa_numero}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                      {voter.mesas?.establecimientos?.circuitos?.localidad || 'N/A'}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                      {voter.emopicks?.display || 'N/A'}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                      {voter.pick_nota || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {unvotedVoters.length === 350 && (
              <div className="text-center py-2 text-sm text-yellow-600">
                ⚠️ Mostrando los primeros 350 resultados. Use filtros para refinar la búsqueda.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}