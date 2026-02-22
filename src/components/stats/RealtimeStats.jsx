import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Filter, RefreshCw, User, AlertCircle, MousePointerClick } from 'lucide-react';
import { loadEmopicksWithCount, formatEmopickDisplay } from '../../utils/emopicksUtils';
import Pagination from '../shared/Pagination';

/**
 * RealtimeStats - Componente de Estadísticas en Tiempo Real de Votantes Pendientes
 *
 * @component
 * @description
 * Muestra una lista actualizable de votantes que aún no han emitido su voto durante el día electoral,
 * con sistema avanzado de filtrado y métricas agregadas para facilitar la fiscalización y seguimiento.
 *
 * @dependencies
 * - Supabase: Base de datos para consultas de padrón, mesas, establecimientos y emopicks
 * - emopicksUtils: Utilidades para cargar y formatear información de picks
 * - Pagination: Componente compartido para navegación entre páginas
 * - lucide-react: Iconos para interfaz de usuario
 *
 * @database_requirements
 * Requiere acceso de lectura a las siguientes tablas:
 * - padron: Datos de votantes (documento, nombre, apellido, voto_emitido, emopick_id, etc.)
 * - mesas: Información de mesas electorales
 * - establecimientos: Lugares de votación
 * - circuitos: Datos de localidades
 * - emopicks: Asignaciones de fiscales/picks a votantes
 *
 * @features
 * - **Filtrado multi-criterio**: Por número de mesa y por emopick asignado
 * - **Sistema de filtros en dos etapas**: Entrada de filtros y aplicación explícita mediante botón
 * - **Métricas clickeables**: Tarjetas de estadísticas que funcionan como filtros rápidos
 * - **Paginación persistente**: Tamaño de página guardado en localStorage
 * - **Indicadores visuales**: Identificación de votantes con check de confirmación
 * - **Consultas optimizadas**: Uso de count exact para paginación eficiente
 *
 * @metrics
 * - Total de votantes pendientes (sin votar o voto_emitido = null)
 * - Pendientes con emopick asignado (filtrable por pick específico)
 * - Pendientes sin emopick asignado (calculado como diferencia)
 *
 * @ui_sections
 * 1. Encabezado con título y descripción
 * 2. Panel de filtros (mesa, emopick) con botones aplicar/limpiar
 * 3. Tarjetas de métricas (total, con picks)
 * 4. Tabla de votantes con información completa
 * 5. Controles de paginación
 *
 * @use_cases
 * - Monitoreo en vivo de participación electoral
 * - Identificación de votantes que requieren contacto o seguimiento
 * - Análisis de participación por mesa o localidad específica
 * - Seguimiento de trabajo de fiscales asignados (picks)
 * - Detección de mesas con baja participación
 *
 * @example
 * // Uso básico en componente padre
 * <RealtimeStats />
 *
 * @author Sistema PickPad
 * @version 2.8.4
 */
export default function RealtimeStats() {
  // ==========================================
  // ESTADOS DE DATOS PRINCIPALES
  // ==========================================

  /**
   * Lista de votantes que no han emitido su voto (voto_emitido = false o null)
   * Contiene datos completos de votantes incluyendo información de mesa, establecimiento y emopick
   * @type {Array<Object>}
   */
  const [unvotedVoters, setUnvotedVoters] = useState([]);

  /**
   * Indicador de carga durante fetch de datos desde Supabase
   * @type {boolean}
   */
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Mensaje de error para mostrar al usuario en caso de fallo en consultas
   * @type {string}
   */
  const [error, setError] = useState('');

  // ==========================================
  // ESTADOS DE FILTROS - SISTEMA DE DOS ETAPAS
  // ==========================================

  /**
   * ETAPA 1: Estados de entrada de filtros (controlled inputs)
   * Estos valores reflejan lo que el usuario escribe/selecciona pero NO están aplicados aún.
   * Se aplican solo al hacer click en el botón "Aplicar".
   */

  /**
   * Valor del input de número de mesa (no aplicado)
   * @type {string}
   */
  const [filterMesaInput, setFilterMesaInput] = useState('');

  /**
   * Valor del select de emopick (no aplicado)
   * @type {string}
   */
  const [filterEmopickInput, setFilterEmopickInput] = useState('');

  /**
   * Bandera que indica si hay cambios en los inputs que no se han aplicado
   * Controla el estado habilitado/deshabilitado del botón "Aplicar"
   * @type {boolean}
   */
  const [hasUnappliedChanges, setHasUnappliedChanges] = useState(false);

  /**
   * ETAPA 2: Estados de filtros aplicados
   * Estos valores se usan en las queries a Supabase.
   * Se actualizan solo al hacer click en "Aplicar" o "Limpiar".
   */

  /**
   * Filtro de mesa aplicado en queries
   * @type {string}
   */
  const [filterMesa, setFilterMesa] = useState('');

  /**
   * Filtro de emopick aplicado en queries
   * @type {string}
   */
  const [filterEmopick, setFilterEmopick] = useState('');

  /**
   * Filtro de tipo de métrica (activado al hacer click en tarjetas de métricas)
   * Valores posibles: null, 'conPicks'
   * @type {string|null}
   */
  const [filterMetricType, setFilterMetricType] = useState(null);

  // ==========================================
  // ESTADOS DE OPCIONES DE FILTROS
  // ==========================================

  /**
   * Lista de emopicks disponibles cargados desde la base de datos
   * Utilizado para popular el dropdown de selección de pick
   * Cada elemento incluye: {id, display, count}
   * @type {Array<Object>}
   */
  const [availableEmopicks, setAvailableEmopicks] = useState([]);

  // ==========================================
  // ESTADOS DE PAGINACIÓN
  // ==========================================

  /**
   * Página actual en la paginación (base 1)
   * @type {number}
   */
  const [currentPage, setCurrentPage] = useState(1);

  /**
   * Cantidad de registros a mostrar por página
   * Se persiste en localStorage con la clave 'realtimeStatsPageSize'
   * Valor por defecto: 25
   * @type {number}
   */
  const [pageSize, setPageSize] = useState(() => {
    const saved = localStorage.getItem('realtimeStatsPageSize');
    return saved ? parseInt(saved, 10) : 25;
  });

  /**
   * Total de registros que cumplen los criterios de filtrado
   * Usado para calcular el número total de páginas
   * @type {number}
   */
  const [totalCount, setTotalCount] = useState(0);

  // ==========================================
  // ESTADOS DE MÉTRICAS AGREGADAS
  // ==========================================

  /**
   * Objeto con métricas calculadas de votantes pendientes
   * - totalPendientes: Total de votantes sin votar (respeta filtro de mesa)
   * - pendientesConEmopick: Votantes sin votar que tienen emopick asignado
   * - pendientesSinEmopick: Diferencia entre total y con emopick
   *
   * Las métricas se calculan con queries separadas para precisión,
   * respetando los filtros aplicados (excepto el filtro de métrica clickeada)
   * @type {Object}
   */
  const [metrics, setMetrics] = useState({
    totalPendientes: 0,
    pendientesConEmopick: 0,
    pendientesSinEmopick: 0
  });

  // ==========================================
  // EFFECT: CARGA INICIAL DE DATOS
  // ==========================================

  /**
   * Effect de inicialización del componente
   * Se ejecuta una sola vez al montar el componente (dependencias vacías)
   *
   * Acciones realizadas:
   * 1. Carga opciones de filtros (lista de emopicks disponibles)
   * 2. Carga datos iniciales de votantes pendientes sin filtros aplicados
   *
   * Maneja estados de loading y error durante la carga inicial
   */
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      setError('');
      try {
        await loadFilterOptions();
        await fetchUnvotedVoters();
      } catch (err) {
        setError('Error al cargar datos iniciales.');
        console.error('Error en fetchInitialData:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  // ==========================================
  // FUNCIONES DE CARGA DE DATOS
  // ==========================================

  /**
   * Carga las opciones disponibles para los filtros desde la base de datos
   *
   * Específicamente carga:
   * - Lista de emopicks con su display y conteo de asignaciones
   *
   * Esta función utiliza emopicksUtils.loadEmopicksWithCount() que consulta
   * la tabla 'emopicks' y cuenta cuántos votantes tiene asignado cada pick.
   *
   * Los datos cargados se usan para popular el dropdown de selección de pick.
   *
   * @async
   * @returns {Promise<void>}
   */
  const loadFilterOptions = async () => {
    try {
      const emopicks = await loadEmopicksWithCount();
      setAvailableEmopicks(emopicks || []);
    } catch (error) {
      console.error('Error al cargar opciones de filtros:', error);
    }
  };

  /**
   * Consulta y carga la lista de votantes que no han emitido su voto
   *
   * Query principal del componente que obtiene votantes donde:
   * - voto_emitido IS NULL OR voto_emitido = false
   *
   * @query_structure
   * SELECT desde tabla 'padron' con INNER JOINS a:
   * - mesas: Para obtener número de mesa
   * - establecimientos: Para obtener nombre del lugar de votación
   * - circuitos: Para obtener localidad
   * - emopicks: Para obtener información del pick asignado (LEFT JOIN implícito)
   *
   * @filters_applied
   * - filterMesa: Filtra por número de mesa específica (eq)
   * - filterEmopick: Filtra por emopick_id específico (eq)
   * - filterMetricType: Si es 'conPicks', filtra solo registros con emopick_id NOT NULL
   *
   * @pagination
   * Usa range(from, to) para paginar resultados
   * Incluye count: 'exact' para obtener total de registros
   *
   * @ordering
   * Ordena por apellido y nombre ascendente para facilitar búsqueda
   *
   * @side_effects
   * - Actualiza unvotedVoters con los datos paginados
   * - Actualiza totalCount con el total de registros
   * - Llama a fetchMetrics() para actualizar métricas agregadas
   * - Maneja errores actualizando el estado de error
   *
   * @async
   * @returns {Promise<void>}
   */
  const fetchUnvotedVoters = async () => {
    try {
      // Query base: votantes pendientes con conteo exacto
      // Usa INNER JOIN para garantizar que solo se obtengan registros con mesa válida
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

      // Aplicar filtro de mesa si está definido
      if (filterMesa) {
        const mesaNumber = parseInt(filterMesa);
        if (!isNaN(mesaNumber)) {
          query = query.eq('mesa_numero', mesaNumber);
        }
      }

      // Aplicar filtro de emopick si está definido
      if (filterEmopick) {
        const emopickId = parseInt(filterEmopick);
        if (!isNaN(emopickId)) {
          query = query.eq('emopick_id', emopickId);
        }
      }

      // Aplicar filtro de métrica (desde tarjeta clickeada)
      if (filterMetricType === 'conPicks') {
        query = query.not('emopick_id', 'is', null);
      }

      // Calcular rango de paginación
      const from = (currentPage - 1) * pageSize;
      const to = from + pageSize - 1;

      // Aplicar ordenamiento y paginación
      query = query
        .order('apellido', { ascending: true })
        .order('nombre', { ascending: true })
        .range(from, to);

      // Ejecutar query
      const { data, error, count } = await query;

      if (error) {
        console.error('Error al obtener votantes pendientes:', error);
        setError('Error al cargar votantes pendientes');
        return;
      }

      // Actualizar estados con resultados
      setUnvotedVoters(data || []);
      setTotalCount(count || 0);

      // Actualizar métricas agregadas con query separada para precisión
      await fetchMetrics();

    } catch (error) {
      console.error('Error al obtener votantes pendientes:', error);
      setError('Error al cargar votantes pendientes');
    }
  };

  /**
   * Calcula y actualiza las métricas agregadas de votantes pendientes
   *
   * Realiza queries separadas para cada métrica para garantizar precisión.
   * Las métricas NO se calculan desde los datos paginados, sino con queries
   * específicas que cuentan todos los registros que cumplen criterios.
   *
   * @metrics_calculated
   * 1. Total Pendientes: Todos los votantes sin votar
   * 2. Pendientes con Emopick: Votantes sin votar que tienen emopick_id asignado
   * 3. Pendientes sin Emopick: Diferencia entre total y con emopick
   *
   * @filters_behavior
   * - Aplica filtro de mesa en TODAS las métricas
   * - Aplica filtro de emopick SOLO en la métrica "con emopick"
   * - NO aplica filterMetricType (para evitar circularidad)
   *
   * @optimization
   * Usa { count: 'exact', head: true } para obtener solo el conteo
   * sin traer datos completos (más eficiente)
   *
   * @helper_function
   * applyBaseFiltersWithoutEmopick: Aplica filtros base (mesa) sin incluir
   * el filtro de emopick, permitiendo reutilización de lógica
   *
   * @async
   * @returns {Promise<void>}
   */
  const fetchMetrics = async () => {
    try {
      /**
       * Helper: Aplica filtros base (excepto emopick y métrica) a una query
       * @param {Object} q - Query de Supabase
       * @returns {Object} Query con filtros aplicados
       */
      const applyBaseFiltersWithoutEmopick = (q) => {
        if (filterMesa) {
          const mesaNumber = parseInt(filterMesa);
          if (!isNaN(mesaNumber)) q = q.eq('mesa_numero', mesaNumber);
        }
        return q;
      };

      // Query 1: Total de pendientes (respeta filtro de mesa)
      let totalQuery = supabase
        .from('padron')
        .select('emopick_id', { count: 'exact', head: true })
        .or('voto_emitido.is.null,voto_emitido.eq.false');
      totalQuery = applyBaseFiltersWithoutEmopick(totalQuery);
      const { count: total } = await totalQuery;

      // Query 2: Pendientes con emopick (respeta filtros de mesa y emopick)
      let conEmopickQuery = supabase
        .from('padron')
        .select('emopick_id', { count: 'exact', head: true })
        .or('voto_emitido.is.null,voto_emitido.eq.false')
        .not('emopick_id', 'is', null);
      conEmopickQuery = applyBaseFiltersWithoutEmopick(conEmopickQuery);

      // Si hay filtro de emopick específico, aplicarlo solo a esta métrica
      if (filterEmopick) {
        const emopickId = parseInt(filterEmopick);
        if (!isNaN(emopickId)) conEmopickQuery = conEmopickQuery.eq('emopick_id', emopickId);
      }
      const { count: conEmopick } = await conEmopickQuery;

      // Actualizar estado con métricas calculadas
      setMetrics({
        totalPendientes: total || 0,
        pendientesConEmopick: conEmopick || 0,
        pendientesSinEmopick: (total || 0) - (conEmopick || 0)
      });

    } catch (error) {
      console.error('Error al calcular métricas:', error);
    }
  };

  // ==========================================
  // HANDLERS DE EVENTOS
  // ==========================================

  /**
   * Aplica los filtros ingresados por el usuario
   *
   * Transfiere los valores de los inputs (estados temporales) a los estados
   * de filtros aplicados que se usan en las queries.
   *
   * @side_effects
   * - Copia filterMesaInput a filterMesa
   * - Copia filterEmopickInput a filterEmopick
   * - Resetea la página actual a 1
   * - Marca que no hay cambios sin aplicar
   * - Dispara el useEffect de recarga de datos (por cambio en filterMesa/filterEmopick)
   */
  const handleApplyFilters = () => {
    setFilterMesa(filterMesaInput);
    setFilterEmopick(filterEmopickInput);
    setCurrentPage(1);
    setHasUnappliedChanges(false);
  };

  /**
   * Limpia todos los filtros aplicados y los inputs
   *
   * Resetea tanto los inputs de filtros como los filtros aplicados,
   * volviendo a mostrar todos los votantes pendientes sin filtrar.
   *
   * @side_effects
   * - Limpia todos los estados de filtros (inputs y aplicados)
   * - Limpia el filtro de métrica clickeada
   * - Resetea la página actual a 1
   * - Marca que no hay cambios sin aplicar
   * - Dispara el useEffect de recarga de datos
   */
  const handleClearFilters = () => {
    setFilterMesaInput('');
    setFilterEmopickInput('');
    setFilterMesa('');
    setFilterEmopick('');
    setFilterMetricType(null);
    setCurrentPage(1);
    setHasUnappliedChanges(false);
  };

  /**
   * Maneja el click en una tarjeta de métrica para usarla como filtro
   *
   * Las tarjetas de métricas son clickeables y actúan como filtros rápidos.
   * Hacer click activa/desactiva el filtro tipo toggle.
   *
   * @param {string} metricType - Tipo de métrica clickeada ('conPicks')
   *
   * @behavior
   * - Si la métrica ya está activa, la desactiva (null)
   * - Si está inactiva, la activa
   * - Visual feedback: tarjeta activa tiene borde destacado y sombra
   *
   * @side_effects
   * - Alterna el estado filterMetricType
   * - Resetea la página actual a 1
   * - Dispara el useEffect de recarga de datos
   */
  const handleMetricClick = (metricType) => {
    if (filterMetricType === metricType) {
      setFilterMetricType(null);
    } else {
      setFilterMetricType(metricType);
    }
    setCurrentPage(1);
  };

  /**
   * Maneja el cambio de página en la paginación
   *
   * @param {number} newPage - Número de la nueva página (base 1)
   *
   * @side_effects
   * - Actualiza currentPage
   * - Hace scroll suave al inicio de la página para mejor UX
   * - Dispara el useEffect de recarga de datos
   */
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /**
   * Maneja el cambio de tamaño de página (registros por página)
   *
   * @param {number} newSize - Nuevo tamaño de página (10, 25, 50, 100, 200)
   *
   * @side_effects
   * - Actualiza pageSize
   * - Resetea la página actual a 1 (para evitar páginas fuera de rango)
   * - Persiste la preferencia en localStorage
   * - Dispara el useEffect de recarga de datos
   */
  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
    setCurrentPage(1);
    localStorage.setItem('realtimeStatsPageSize', newSize.toString());
  };

  // ==========================================
  // EFFECT: RECARGA REACTIVA DE DATOS
  // ==========================================

  /**
   * Effect que recarga los datos cuando cambian filtros o paginación
   *
   * @dependencies
   * - currentPage: Cambio de página
   * - pageSize: Cambio de tamaño de página
   * - filterMesa: Filtro de mesa aplicado
   * - filterEmopick: Filtro de emopick aplicado
   * - filterMetricType: Filtro de métrica clickeada
   *
   * @behavior
   * Cada vez que cambia alguna dependencia, se dispara una nueva consulta
   * a la base de datos con los criterios actualizados.
   *
   * @note
   * Este effect NO se dispara cuando cambian los inputs (filterMesaInput, filterEmopickInput)
   * sino solo cuando se aplican los filtros con el botón "Aplicar"
   */
  useEffect(() => {
    setIsLoading(true);
    fetchUnvotedVoters().finally(() => setIsLoading(false));
  }, [currentPage, pageSize, filterMesa, filterEmopick, filterMetricType]);

  // ==========================================
  // RENDER - INTERFAZ DE USUARIO
  // ==========================================

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl shadow-lg p-2">
        {/* Encabezado con título y descripción */}
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Votantes Pendientes</h2>
        <p className="text-gray-600 mb-4">Electorado que aún no ha emitido su voto.</p>

        {/* ====================================== */}
        {/* SECCIÓN DE FILTROS                      */}
        {/* ====================================== */}
        {/*
          Panel de filtros con sistema de dos etapas:
          1. Usuario ingresa valores en inputs (filterMesaInput, filterEmopickInput)
          2. Usuario hace click en "Aplicar" para transferir a estados aplicados
          3. Solo los estados aplicados disparan queries a la BD
        */}
        <div className="bg-gray-100 p-4 rounded-lg mb-2">
          <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center space-x-2">
            <Filter className="w-5 h-5" />
            <span>Filtros</span>
          </h3>

          {/* Inputs de filtros */}
          <div className="flex gap-2">
            {/* Input de número de mesa */}
            <div className="flex-1">
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

            {/* Select de emopick */}
            <div className="flex-1">
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

          {/* Botones de acción de filtros */}
          <div className="mt-4 flex gap-2">
            {/* Botón Limpiar: Resetea todos los filtros */}
            <button
              onClick={handleClearFilters}
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
              disabled={isLoading}
            >
              <RefreshCw className="w-4 h-4" />
              <span>Limpiar</span>
            </button>

            {/* Botón Aplicar: Solo habilitado cuando hay cambios sin aplicar */}
            <button
              onClick={handleApplyFilters}
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading || !hasUnappliedChanges}
            >
              <Filter className="w-4 h-4" />
              <span>Aplicar</span>
            </button>
          </div>
        </div>

        {/* ====================================== */}
        {/* SECCIÓN DE MÉTRICAS                     */}
        {/* ====================================== */}
        {/*
          Tarjetas de métricas agregadas.
          La tarjeta "Pendientes con Picks" es clickeable y actúa como filtro rápido.
          Cuando está activa, muestra borde destacado y sombra más pronunciada.
        */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {/* Tarjeta de métrica: Total Pendientes (no clickeable) */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-2">
            <h3 className="text-sm font-semibold text-blue-900">Total Pendientes</h3>
            <p className="text-xl font-bold text-blue-800">{metrics.totalPendientes}</p>
          </div>

          {/* Tarjeta de métrica: Pendientes con Picks (clickeable como filtro) */}
          <button
            onClick={() => handleMetricClick('conPicks')}
            className={`rounded-lg p-2 transition-all duration-200 text-left ${
              filterMetricType === 'conPicks'
                ? 'bg-yellow-100 border-2 border-yellow-500 shadow-md ring-2 ring-yellow-300'
                : 'bg-yellow-50 border border-yellow-200 hover:bg-yellow-100 hover:shadow-sm'
            }`}
          >
            <h3 className="text-sm font-semibold text-yellow-900 flex items-center justify-between">
              {/* Título dinámico: muestra pick específico si hay filtro activo */}
              {(() => {
                const activeEmopick = filterEmopick ? availableEmopicks.find(p => String(p.id) === String(filterEmopick)) : null;
                return `Pendientes con ${activeEmopick ? activeEmopick.display : 'Picks'}`;
              })()}
            </h3>
            <p className="text-xl font-bold text-yellow-800 flex items-center justify-between">
              <span>{metrics.pendientesConEmopick}</span>
              <MousePointerClick className="w-5 h-5" />
            </p>
          </button>

          {/*
            NOTA: Tarjeta "Pendientes sin picks" comentada intencionalmente
            Métrica calculada pero no mostrada en la UI actual
            Se mantiene en el estado para uso futuro o reportes
          */}
          {/*
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-red-900">Pendientes sin picks</h3>
            <p className="text-3xl font-bold text-red-800">{metrics.pendientesSinEmopick}</p>
          </div>
          */}
        </div>

        {/* ====================================== */}
        {/* SECCIÓN DE LISTA DE VOTANTES            */}
        {/* ====================================== */}
        {/*
          Muestra la tabla de votantes pendientes con estados:
          - Loading: Spinner animado
          - Error: Mensaje de error con icono
          - Sin datos: Mensaje informativo
          - Con datos: Tabla completa con paginación
        */}
        {/* Estado: Cargando */}
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Cargando votantes...</p>
          </div>

        /* Estado: Error */
        ) : error ? (
          <div className="text-center py-8 text-red-600">
            <AlertCircle className="w-12 h-12 mx-auto mb-3" />
            <p>{error}</p>
          </div>

        /* Estado: Sin datos */
        ) : unvotedVoters.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <User className="w-12 h-12 mx-auto mb-3" />
            <p>No se encontraron votantes pendientes con los filtros aplicados.</p>
          </div>

        /* Estado: Con datos - Tabla de votantes */
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">N° Doc.</th>
                  <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Apellido, Nombre</th>
                  <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">✓</th>
                  <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Pick</th>
                  <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nota</th>
                  <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mesa</th>
                  <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Localidad</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {unvotedVoters.map(voter => (
                  <tr key={voter.documento}>
                    {/* Columna: Número de documento */}
                    <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-900">{voter.documento}</td>

                    {/* Columna: Apellido y Nombre
                        Resaltado en negrita si tiene emopick asignado pero sin check de confirmación
                    */}
                    <td className={`px-2 py-2 whitespace-nowrap text-sm text-gray-900 ${voter.emopick_id && !voter.pick_check ? 'font-bold' : ''}`}>
                      {voter.apellido}, {voter.nombre}
                    </td>

                    {/* Columna: Check de confirmación
                        Muestra ✓ verde solo si tiene emopick_id Y pick_check = true
                    */}
                    <td className="px-2 py-2 whitespace-nowrap text-sm text-center font-bold">
                      {voter.emopick_id && voter.pick_check && <span className="text-green-600 text-base">✓</span>}
                    </td>

                    {/* Columna: Display del pick asignado */}
                    <td className="px-2 py-2 whitespace-nowrap text-sm text-center text-gray-900">
                      {voter.emopicks?.display || '-'}
                    </td>

                    {/* Columna: Nota del pick */}
                    <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-900">
                      {voter.pick_nota || '-'}
                    </td>

                    {/* Columna: Número de mesa */}
                    <td className="px-2 py-2 whitespace-nowrap text-sm text-center text-gray-900">{voter.mesa_numero}</td>

                    {/* Columna: Localidad (obtenida via joins) */}
                    <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-900">
                      {voter.mesas?.establecimientos?.circuitos?.localidad || 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Controles de paginación */}
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