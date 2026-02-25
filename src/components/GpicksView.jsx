import React, { useState, useEffect } from 'react';
import { SquarePen, User, MapPin, Hash, FileText, AlertCircle, Users, CheckCircle, XCircle, Filter, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { loadEmopicksWithCount, formatEmopickDisplay } from '../utils/emopicksUtils';
import Pagination from './shared/Pagination';

/**
 * Componente GpicksView - Vista para mostrar votantes con emopicks asignados
 *
 * Propósito: Permite visualizar todos los votantes que tienen un emopick asignado
 * (emopick_id no es NULL), con filtros por usuario, emopick, estado de votación y verificación.
 *
 * Funcionalidades:
 * - Carga automática de votantes con emopicks del usuario actual
 * - Usuarios con tipo <= 3 pueden ver picks de todos los usuarios
 * - Paginación de 25 registros por página
 * - Filtros avanzados (usuario, emopick, votación, verificación)
 * - Ordenamiento por emopick y apellido
 */
export default function GpicksView() {
  // Obtener datos del usuario autenticado
  const { user } = useAuth();

  // Estados para el manejo de datos y UI
  const [picksData, setPicksData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState('');

  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  // Estados para filtros
  const [filterVoteStatus, setFilterVoteStatus] = useState('all');
  const [filterVerified, setFilterVerified] = useState(null); // null = todos, true = verificados, false = no verificados
  const [filterEmopickId, setFilterEmopickId] = useState('');
  // null = no inicializado, '' = todos los usuarios, <uuid> = usuario específico
  const [filterAssignedByUserId, setFilterAssignedByUserId] = useState(null);

  // Estados para datos de los selectores
  const [availableEmopicks, setAvailableEmopicks] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);

  /**
   * Efecto para cargar los datos cuando el componente se monta
   * Inicializa el filtro de usuario al usuario actual
   */
  useEffect(() => {
    if (user?.id) {
      setFilterAssignedByUserId(user.id);
      loadFilterData();
    }
  }, [user?.id]);

  /**
   * Efecto para cargar datos cuando cambian los filtros o la paginación
   * Solo ejecuta fetchGpicks cuando filterAssignedByUserId está inicializado (no es null)
   * Esto previene la ejecución antes de que se establezca el usuario actual
   */
  useEffect(() => {
    if (user?.id && filterAssignedByUserId !== null) {
      fetchGpicks();
    }
  }, [user?.id, filterAssignedByUserId, filterVoteStatus, filterVerified, filterEmopickId, currentPage, pageSize]);

  /**
   * Carga los datos necesarios para poblar los selectores de filtros
   */
  const loadFilterData = async () => {
    try {
      // Cargar emopicks
      const emopicks = await loadEmopicksWithCount();
      setAvailableEmopicks(emopicks || []);

      // Cargar usuarios que han asignado emopicks desde el VIEW users_picks
      const { data: users, error: usersError } = await supabase
        .from('users_picks')
        .select('id, full_name, padron_count')
        .order('full_name');

      if (!usersError) {
        setAvailableUsers(users || []);
      }

    } catch (error) {
      console.error('Error loading filter data:', error);
    }
  };

  /**
   * Obtiene los votantes con emopicks asignados aplicando los filtros seleccionados
   * Implementa paginación y obtiene el conteo total
   */
  const fetchGpicks = async () => {
    setIsLoading(true);
    setError('');

    try {
      let query = supabase
        .from('padron')
        .select(`
          *,
          mesas(
            numero,
            establecimientos(
              id,
              nombre,
              circuitos(
                codigo,
                localidad
              )
            )
          ),
          emopicks(
            id,
            display
          ),
          emopick_user_profile:profiles!padron_emopick_user_fkey(
            full_name
          ),
          pick_check_user_profile:profiles!padron_pick_check_user_fkey(
            full_name
          )
        `, { count: 'exact' })
        .not('emopick_id', 'is', null);

      // Aplicar filtros
      if (filterVoteStatus === 'voted') {
        query = query.eq('voto_emitido', true);
      } else if (filterVoteStatus === 'not_voted') {
        query = query.eq('voto_emitido', false);
      }

      if (filterVerified !== null) {
        query = query.eq('pick_check', filterVerified);
      }

      if (filterEmopickId) {
        query = query.eq('emopick_id', parseInt(filterEmopickId));
      }

      // Aplica el filtro solo si hay un usuario específico seleccionado
      // '' = todos los usuarios (no aplica filtro), <uuid> = filtrar por ese usuario
      if (filterAssignedByUserId && filterAssignedByUserId !== '') {
        query = query.eq('emopick_user', filterAssignedByUserId);
      }

      // Aplicar paginación y ordenamiento
      const from = (currentPage - 1) * pageSize;
      const to = from + pageSize - 1;

      query = query
        .order('emopick_id', { ascending: true })
        .order('apellido', { ascending: true })
        .range(from, to);

      const { data, error, count } = await query;

      if (error) {
        console.error('Error fetching picks:', error);
        setError('Error al cargar los picks');
        return;
      }

      setPicksData(data || []);
      setTotalCount(count || 0);
    } catch (error) {
      console.error('Error during fetch:', error);
      setError('Error al cargar los picks');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Limpia todos los filtros y vuelve al usuario actual
   */
  const handleClearFilters = () => {
    setFilterVoteStatus('all');
    setFilterVerified(null);
    setFilterEmopickId('');
    setFilterAssignedByUserId(user.id);
    setCurrentPage(1);
  };

  /**
   * Maneja el cambio de página
   */
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  /**
   * Maneja el cambio de tamaño de página
   */
  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  /**
   * Maneja el toggle del checkbox de verificación
   * Registra pick_check_at con la fecha/hora actual cuando se marca el check
   * Borra pick_check_at (null) cuando se desmarca el check
   * Sigue el mismo patrón que voto_pick_at en FiscalizarView
   *
   * @param {number} documento - Número de documento del votante
   * @param {boolean} newPickCheckStatus - Nuevo estado del checkbox
   */
  const handlePickCheckToggle = async (documento, newPickCheckStatus) => {
    setIsUpdating(true);

    try {
      const { error } = await supabase
        .from('padron')
        .update({
          pick_check: newPickCheckStatus,
          pick_check_user: newPickCheckStatus ? user.id : null,
          pick_check_at: newPickCheckStatus ? new Date().toISOString() : null
        })
        .eq('documento', documento);

      if (error) {
        console.error('Error updating pick_check:', error);
        alert('Error al actualizar la verificación');
        return;
      }

      // Actualizar datos localmente
      const updatedPicks = picksData.map(record =>
        record.documento === documento
          ? {
              ...record,
              pick_check: newPickCheckStatus,
              pick_check_user: newPickCheckStatus ? user.id : null,
              pick_check_user_profile: newPickCheckStatus ? { full_name: user.name } : null,
              pick_check_at: newPickCheckStatus ? new Date().toISOString() : null
            }
          : record
      );

      setPicksData(updatedPicks);

    } catch (error) {
      console.error('Error toggling pick check:', error);
      alert('Error al actualizar la verificación');
    } finally {
      setIsUpdating(false);
    }
  };

  // Verificar permisos del usuario
  if (!user || user.usuario_tipo > 3) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="text-center py-12">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Sin permisos</h3>
          <p className="text-red-600">No tiene permisos para acceder a la gestión de picks</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-2">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Gestión de Picks</h2>
            <p className="text-gray-800 mt-1">
              Total de picks en base de datos: {totalCount}
            </p>
          </div>
        </div>

        {/* Estadísticas rápidas */}
        <div className="flex space-x-4 mb-3">
          <div className="w-48 bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center space-x-3">
              <SquarePen className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold text-blue-900">{totalCount}</p>
                <p className="text-sm text-blue-700">Total Picks</p>
              </div>
            </div>
          </div>

          <div className="w-48 bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-green-900">
                  {picksData.filter(p => p.pick_check).length}
                </p>
                <p className="text-sm text-green-700">Checks en página</p>
              </div>
            </div>
          </div>
          
      {/*   <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <FileText className="w-8 h-8 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold text-yellow-900">
                  {picksData.filter(p => p.pick_nota && p.pick_nota.trim()).length}
                </p>
                <p className="text-sm text-yellow-700">Con Notas</p>
              </div>
            </div>
          </div>  */}
        </div>
      </div>
      
      {/* Panel de filtros */}
      <div className="bg-white rounded-xl shadow-lg p-3">
        <div className="flex items-center space-x-2 mb-4">
          <Filter className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Filtros</h3>
        </div>
        
        <div className="space-y-4">
          {/* Línea 1: Estado de Votación y Check de acciones */}
          <div className="grid grid-cols-2 gap-3">
            {/* Filtro por estado de votación */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado de Votación
              </label>
              <select
                value={filterVoteStatus}
                onChange={(e) => setFilterVoteStatus(e.target.value)}
                className="w-full px-2 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              >
                <option value="all">Todos</option>
                <option value="voted">Votaron</option>
                <option value="not_voted">No Votaron</option>
              </select>
            </div>

            {/* Filtro por estado de verificación */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Check de acciones
              </label>
              <select
                value={filterVerified === null ? '' : filterVerified.toString()}
                onChange={(e) => setFilterVerified(e.target.value === '' ? null : e.target.value === 'true')}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              >
                <option value="">Todos</option>
                <option value="true">Atendidos</option>
                <option value="false">Sin gestión</option>
              </select>
            </div>
          </div>

          {/* Línea 2: Marcados por (ancho completo) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Marcados por
            </label>
            <select
              value={filterAssignedByUserId}
              onChange={(e) => {
                setFilterAssignedByUserId(e.target.value);
                setCurrentPage(1);
              }}
              disabled={availableUsers.length === 0}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100"
            >
              <option value="">Todos los usuarios</option>
              {availableUsers.map((userOption) => (
                <option key={userOption.id} value={userOption.id}>
                  {userOption.full_name} ({userOption.padron_count})
                </option>
              ))}
            </select>
          </div>

          {/* Línea 3: Tipo de Pick y botón Limpiar Filtros */}
          <div className="grid grid-cols-2 gap-3 items-end">
            {/* Filtro por tipo de emopick */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Pick
              </label>
              <select
                value={filterEmopickId}
                onChange={(e) => setFilterEmopickId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              >
                <option value="">Todos los picks</option>
                {availableEmopicks.map((emopick) => (
                  <option key={emopick.id} value={emopick.id}>
                    {formatEmopickDisplay(emopick.display, emopick.count)}
                  </option>
                ))}
              </select>
            </div>

            {/* Botón de limpiar filtros */}
            <div>
              <button
                onClick={handleClearFilters}
                disabled={isLoading}
                className="w-full flex items-center justify-center space-x-2 px-2 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Limpiar Filtros</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      {isLoading ? (
        <div className="bg-white rounded-xl shadow-lg p-2">
          <div className="flex items-center justify-center h-6">
            <div className="flex flex-col items-center space-y-3">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-600">Cargando picks...</p>
            </div>
          </div>
        </div>
      ) : error ? (
        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="text-center py-12">
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error</h3>
            <p className="text-red-600">{error}</p>
            <button
              onClick={fetchGpicks}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Reintentar
            </button>
          </div>
        </div>
      ) : picksData.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="text-center py-12">
            <SquarePen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Sin picks registrados
            </h3>
            <p className="text-gray-600">
              Aún no has asignado picks a ningún votante.
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Votante
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Localidad
                  </th>
                  <th className="px-4 py-2 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Domicilio
                  </th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Documento
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {picksData.map((record) => (
                  <tr key={record.documento} className={` ${record.pick_check ? 'bg-gray-100' : ''}`}>
                    <td colSpan={5} className="px-4 py-2">
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-x-2 gap-y-1 items-center text-sm"
                           style={{gridTemplateColumns: '85px 1fr 1fr 1fr 90px'}}>
                        {/* Primera fila visual */}
                        <div className="flex items-center justify-left">
                          <span className="px-1 py-1 bg-yellow-100 rounded-full text-xl">
                            {record.emopicks?.display || '❓'}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-900">
                            {record.apellido}, {record.nombre}
                          </span>
                        </div>
                        <div>
                          <span className="justify-center text-xs text-gray-700">
                            {record.mesas?.establecimientos?.circuitos?.localidad || 'No especificada'}
                          </span>
                        </div>
                        <div>
                          <span className="text-xs text-gray-700">
                            {record.domicilio || 'No especificado'}
                          </span>
                        </div>
                        <div>
                          <span className="flex items-center justify-center text-xs font-medium text-gray-900">
                            {record.documento}
                          </span>
                        </div>
                        
                        {/* Segunda fila visual */}
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={record.pick_check || false}
                            onChange={(e) => handlePickCheckToggle(record.documento, e.target.checked)}
                            disabled={isUpdating}
                            className="w-4 h-4 accent-green-200 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
                          />
                          <span className="text-ms text-gray-800">Check</span>
                        </div>
                        <div>
                          <span className="italic text-gray-900">
                            {record.pick_nota || '-'}
                          </span>
                        </div>
                        <div>
                          <span className="justify-center text-xs text-gray-700">
                           ({record.emopick_user_profile?.full_name || 'N/A'})
                          </span>
                        </div>
                        <div>
                          {record.pick_check_user_profile?.full_name ? (
                            <span className="inline-flex items-center px-1 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              {record.pick_check_user_profile.full_name}
                            </span>
                          ) : (
                            <span className="text-xs text-gray-400">Sin verificar</span>
                          )}
                        </div>
                        <div className="flex items-center justify-center">
                          {record.voto_emitido !== null && (
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              record.voto_emitido ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {record.voto_emitido ? (
                                <span className="flex items-center space-x-1">
                                  <CheckCircle className="w-3 h-3" />
                                  <span>Votó</span>
                                </span>
                              ) : (
                                <span className="flex items-center space-x-1">
                                  <XCircle className="w-3 h-3" />
                                  <span>No votó</span>
                                </span>
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Paginación */}
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(totalCount / pageSize)}
            totalItems={totalCount}
            pageSize={pageSize}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            pageSizeOptions={[10, 25, 50, 100]}
            loading={isLoading}
          />
        </div>
      )}
    </div>
  );
}