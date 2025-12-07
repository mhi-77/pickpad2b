/**
 * SearchResults Component
 *
 * Componente que muestra los resultados de búsqueda del padrón electoral.
 * Permite visualizar información detallada de votantes y asignar clasificaciones
 * emocionales (emopicks) a través de un modal interactivo.
 *
 * Características principales:
 * - Visualización paginada de resultados
 * - Información detallada del votante (nombre, dirección, mesa, etc.)
 * - Sistema de clasificación emocional (emopicks)
 * - Persistencia de última selección en localStorage
 * - Control de acceso basado en roles de usuario
 * - Actualización optimista de UI
 */

import React from 'react';
import { FileText, User, MapPin, Hash, Users, Sparkles, XCircle, CheckCircle, SquarePen } from 'lucide-react';
import PickModal from './gpicks/PickModal';
import Pagination from './shared/Pagination';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

/**
 * @param {Array} results - Array de registros de votantes a mostrar
 * @param {boolean} isLoading - Indica si se está realizando una búsqueda
 * @param {number} userRole - Rol del usuario actual (determina permisos de visualización)
 * @param {Array} availableEmopicks - Lista de clasificaciones emocionales disponibles
 * @param {number} currentPage - Página actual de resultados
 * @param {number} pageSize - Cantidad de resultados por página
 * @param {number} totalCount - Total de registros encontrados
 * @param {Function} onPageChange - Callback cuando se cambia de página
 * @param {Function} onPageSizeChange - Callback cuando se cambia el tamaño de página
 */
export default function SearchResults({
  results,
  isLoading,
  userRole,
  availableEmopicks = [],
  currentPage,
  pageSize,
  totalCount,
  onPageChange,
  onPageSizeChange
}) {
  // Obtener datos del usuario autenticado para registrar quién hace las actualizaciones
  const { user } = useAuth();

/**
   * Formatea números con estándar argentino (punto como separador de miles, coma como decimal)
   * @param {number} num - Número a formatear
   * @returns {string} Número formateado según localización es-AR
   */
  const formatNumber = (num) => {
    return new Intl.NumberFormat('es-AR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(num);
  };

  // Estado: Control de visibilidad del modal de PICK
  const [showPickModal, setShowPickModal] = React.useState(false);

  // Estado: Registro actual seleccionado para asignar emopick
  const [currentRecordToPick, setCurrentRecordToPick] = React.useState(null);

  // Estado: Último emopick utilizado (persistido en localStorage para UX mejorada)
  // Permite pre-seleccionar el mismo emopick en operaciones consecutivas
  const [lastUsedEmopickId, setLastUsedEmopickId] = React.useState(() => {
    const saved = localStorage.getItem('lastUsedEmopickId');
    return saved ? parseInt(saved) : null;
  });

  // Estado: Última nota utilizada (persistida en localStorage)
  // Facilita agregar notas similares a múltiples votantes
  const [lastUsedPickNota, setLastUsedPickNota] = React.useState(() => {
    return localStorage.getItem('lastUsedPickNota') || '';
  });

  // Estado: Copia local de resultados para actualización optimista de UI
  // Permite mostrar cambios inmediatamente sin esperar confirmación del servidor
  const [localResults, setLocalResults] = React.useState(results);

  // Efecto: Sincronizar resultados locales con props cuando cambien
  // Esto ocurre cuando se realiza una nueva búsqueda o se cambia de página
  React.useEffect(() => {
    setLocalResults(results);
  }, [results]);

  /**
   * Abre el modal de PICK para un registro específico
   * @param {Object} record - Registro del votante a clasificar
   */
  const handleOpenPickModal = (record) => {
    setCurrentRecordToPick(record);
    setShowPickModal(true);
  };

  /**
   * Cierra el modal de PICK y resetea el registro seleccionado
   */
  const handleClosePickModal = () => {
    setShowPickModal(false);
    setCurrentRecordToPick(null);
  };

  /**
   * Guarda la selección de emopick y anotación en la base de datos
   *
   * Flujos soportados:
   * 1. ASIGNAR: Cuando emopickId tiene valor, asigna la clasificación y nota al votante
   * 2. DESMARCAR: Cuando emopickId es null, limpia todos los campos relacionados con picks
   *
   * Implementa actualización optimista: la UI se actualiza inmediatamente
   * antes de recibir confirmación del servidor para mejor experiencia de usuario.
   *
   * @param {number|null} emopickId - ID del emopick a asignar, o null para desmarcar
   * @param {string} pickNota - Nota adicional sobre la clasificación
   */
  const handlePickSave = async (emopickId, pickNota) => {
    // Validación: Asegurar que existe un registro seleccionado
    if (!currentRecordToPick) return;

    try {
      let updateData;

      // Determinar el tipo de operación y preparar datos de actualización
      if (emopickId === null) {
        // Flujo DESMARCAR: Limpiar todos los campos relacionados con picks
        // Esto elimina la clasificación completa del votante
        updateData = {
          emopick_id: null,
          pick_nota: null,
          emopick_user: null,
          pick_check_user: null,
          pick_check: false
        };
      } else {
        // Flujo ASIGNAR: Actualizar con la nueva clasificación
        // Solo se modifican los campos necesarios, manteniendo pick_check intacto
        updateData = {
          emopick_id: emopickId,
          pick_nota: pickNota || null,
          emopick_user: user?.id || null
        };
      }

      // Persistir cambios en la base de datos
      const { error } = await supabase
        .from('padron')
        .update(updateData)
        .eq('documento', currentRecordToPick.documento);

      if (error) {
        throw new Error('Error al guardar la selección');
      }

      // Actualización optimista de UI: Aplicar cambios localmente sin esperar recarga
      // Esto mejora la percepción de velocidad de la aplicación
      const updatedResults = localResults.map(record =>
        record.documento === currentRecordToPick.documento
          ? {
              ...record,
              emopick_id: emopickId,
              pick_nota: emopickId === null ? null : (pickNota || null),
              emopick_user: emopickId === null ? null : (user?.id || null),
              pick_check_user: emopickId === null ? null : record.pick_check_user,
              pick_check: emopickId === null ? false : record.pick_check,
              // Actualizar objeto emopicks completo para mostrar el emoji/display correcto
              emopicks: emopickId === null ? null : (availableEmopicks.find(e => e.id === emopickId) || record.emopicks)
            }
          : record
      );

      setLocalResults(updatedResults);

      // Persistir última selección en localStorage (solo para operaciones de asignación)
      // Esto permite pre-seleccionar los mismos valores en la próxima clasificación
      if (emopickId !== null) {
        setLastUsedEmopickId(emopickId);
        setLastUsedPickNota(pickNota);
        localStorage.setItem('lastUsedEmopickId', emopickId.toString());
        localStorage.setItem('lastUsedPickNota', pickNota);
      }

      // Cerrar modal tras operación exitosa
      handleClosePickModal();

    } catch (error) {
      // Manejo de errores: Mostrar mensaje al usuario
      // TODO: Implementar sistema de notificaciones más sofisticado
      alert(error.message || 'Error al guardar la selección');
    }
  };

  // ESTADO DE CARGA: Mostrar spinner mientras se realiza la búsqueda
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-600">Buscando en padrón electoral...</p>
          </div>
        </div>
      </div>
    );
  }

  // ESTADO VACÍO: Mostrar mensaje cuando no hay resultados
  if (results.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No se encontraron resultados
          </h3>
          <p className="text-gray-600">
            Intenta modificar los criterios de búsqueda para obtener resultados.
          </p>
        </div>
      </div>
    );
  }

  // RENDERIZADO PRINCIPAL: Mostrar lista de resultados con información completa
  return (
    <div className="bg-white rounded-xl shadow-lg p-5">
      {/* Header con contador de resultados */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-m  text-gray-800">
          <span>
            Registros encontrados: {totalCount}
          </span>
        </h3>
      </div>

      {/* Lista de votantes encontrados */}
      <div className="space-y-4">
        {localResults.map((record) => (
          <div
            key={record.documento}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
          >
            {/* NIVEL 1: Identificación principal - Apellido y Nombre */}
            <div className="mb-3">
              <h4 className="text-lg font-semibold text-gray-900">
                {record.apellido}, {record.nombre}
              </h4>
            </div>

            {/* NIVEL 2: Ubicación - Domicilio del votante */}
            <div className="mb-3">
              <div className="flex items-center space-x-2 text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>{record.domicilio || 'No especificado'}</span>
              </div>
            </div>

            {/* NIVEL 3: Identificación documental - Documento y Clase */}
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div className="flex items-center space-x-1 font-medium text-gray-600">
                <Hash className="w-4 h-4" />
                <span>{formatNumber(record.documento)}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <span>Clase: {formatNumber(record.clase) || '---'}</span>
              </div>
            </div>

            {/* NIVEL 4: Información electoral - Mesa y Localidad */}
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div className="flex items-center space-x-2 font-medium text-gray-600">
                <Users className="w-4 h-4" />
                <span>Mesa: {record.mesa_numero || '---'}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span> {record.mesas?.establecimientos?.circuitos?.localidad || 'No especificada'}</span>
              </div>
            </div>

            {/* NIVEL 5: Indicadores de estado - Solo visible para usuarios con rol <= 3
                Muestra: nuevo votante, voto obligatorio, y si emitió voto */}
            {userRole && userRole <= 3 && (
              <div className="grid grid-cols-3 gap-4 mb-3">
                {/* Indicador: Votante nuevo (primera vez en padrón) */}
                <div className="flex items-center justify-center">
                  {record.da_es_nuevo && (
                    <span className="flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                      <span>NUEVO</span>
                    </span>
                  )}
                </div>

                {/* Indicador: Estado del voto obligatorio */}
                <div className="flex items-center justify-center">
                  {record.da_voto_obligatorio === false ? (
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
                      <span>NO.OBLIGADO</span>
                    </span>
                  ) : record.da_voto_obligatorio === true ? (
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      <span>OBLIGATORIO</span>
                    </span>
                  ) : null}
                </div>

                {/* Indicador: Si el votante ya emitió su voto */}
                <div className="flex items-center justify-center">
                  {record.voto_emitido !== null && (
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      record.voto_emitido ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {record.voto_emitido ? 'Votó' : 'No.votó'}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* NIVEL 6: Clasificación emocional y acciones - Solo visible para usuarios con rol <= 3
                Incluye: texto libre, emopick asignado, y botón para modificar */}
            {userRole && userRole <= 3 && (
              <div className="grid grid-cols-3 gap-4 pt-3 border-t border-gray-100">
                {/* Columna 1: Texto libre de observaciones */}
                <div className="text-xs text-gray-600 text-center">
                  <span className="font-medium"> </span>
                  <p className="mt-1"> {record.da_texto_libre || ''}</p>
                </div>

                {/* Columna 2: Visualización del emopick asignado (emoji) */}
                <div className="text-sm text-gray-600 text-center">
                  <span className="font-medium"> </span>
                  <div className="mt-1">
                    {record.emopicks?.display ? (
                      <span className="px-2 py-2 bg-yellow-100 rounded-full text-xl font-medium">
                        {record.emopicks.display}
                      </span>
                    ) : (
                      <span className="text-gray-500 text-sm"> </span>
                    )}
                  </div>
                </div>

                {/* Columna 3: Botón de acción para asignar/modificar emopick */}
                <div className="flex items-center justify-end space-x-3">
                  <button
                    onClick={() => handleOpenPickModal(record)}
                    className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    <SquarePen className="w-4 h-4" />
                    <span>PICK!</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Controles de Paginación
          Permite navegar entre páginas y ajustar cantidad de resultados por página */}
      {results.length > 0 && totalCount > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(totalCount / pageSize)}
          totalItems={totalCount}
          pageSize={pageSize}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
          loading={isLoading}
        />
      )}

      {/* Modal de clasificación emocional (PICK)
          Permite asignar o modificar el emopick y nota de un votante específico.
          Pre-carga el último emopick utilizado para facilitar clasificación en lote. */}
      <PickModal
        isOpen={showPickModal}
        onClose={handleClosePickModal}
        onSave={handlePickSave}
        emopicksList={availableEmopicks}
        initialEmopickId={currentRecordToPick?.emopick_id || lastUsedEmopickId}
        initialPickNota={currentRecordToPick?.pick_nota || lastUsedPickNota}
        votanteName={currentRecordToPick ? `${currentRecordToPick.apellido}, ${currentRecordToPick.nombre}` : ''}
        currentVoterEmopickId={currentRecordToPick?.emopick_id}
      />
    </div>
  );
}