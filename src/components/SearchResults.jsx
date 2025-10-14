import React from 'react';
import { FileText, User, MapPin, Hash, Users, Sparkles, XCircle, CheckCircle, SquarePen } from 'lucide-react';
import PickModal from './gpicks/PickModal';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export default function SearchResults({ results, isLoading, userRole, availableEmopicks = [] }) {
  // Obtener datos del usuario autenticado para registrar quién hace las actualizaciones
  const { user } = useAuth();

// Formatea números con punto como separador de miles y coma como decimal
  const formatNumber = (num) => {
    return new Intl.NumberFormat('es-AR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(num);
  };
  
  // Estados para el modal de PICK
  const [showPickModal, setShowPickModal] = React.useState(false);
  const [currentRecordToPick, setCurrentRecordToPick] = React.useState(null);
  const [lastUsedEmopickId, setLastUsedEmopickId] = React.useState(() => {
    const saved = localStorage.getItem('lastUsedEmopickId');
    return saved ? parseInt(saved) : null;
  });
  const [lastUsedPickNota, setLastUsedPickNota] = React.useState(() => {
    return localStorage.getItem('lastUsedPickNota') || '';
  });
  const [localResults, setLocalResults] = React.useState(results);

  // Actualizar resultados locales cuando cambien los props
  React.useEffect(() => {
    setLocalResults(results);
  }, [results]);

  /**
   * Abre el modal de PICK para un registro específico
   */
  const handleOpenPickModal = (record) => {
    setCurrentRecordToPick(record);
    setShowPickModal(true);
  };

  /**
   * Cierra el modal de PICK
   */
  const handleClosePickModal = () => {
    setShowPickModal(false);
    setCurrentRecordToPick(null);
  };

  /**
   * Guarda la selección de emopick y anotación en la base de datos
   * Si emopickId es null, desmarca el votante limpiando todos los campos relacionados
   */
  const handlePickSave = async (emopickId, pickNota) => {
    if (!currentRecordToPick) return;

    try {
      let updateData;

      if (emopickId === null) {
        // Flujo DESMARCAR: limpiar todos los campos relacionados
        updateData = {
          emopick_id: null,
          pick_nota: null,
          emopick_user: null,
          pick_check_user: null,
          pick_check: false
        };
      } else {
        // Flujo NORMAL: actualizar con los valores proporcionados
        updateData = {
          emopick_id: emopickId,
          pick_nota: pickNota || null,
          emopick_user: user?.id || null
        };
      }

      // Actualizar en la base de datos
      const { error } = await supabase
        .from('padron')
        .update(updateData)
        .eq('documento', currentRecordToPick.documento);

      if (error) {
        throw new Error('Error al guardar la selección');
      }

      // Actualizar resultados localmente
      const updatedResults = localResults.map(record =>
        record.documento === currentRecordToPick.documento
          ? {
              ...record,
              emopick_id: emopickId,
              pick_nota: emopickId === null ? null : (pickNota || null),
              emopick_user: emopickId === null ? null : (user?.id || null),
              pick_check_user: emopickId === null ? null : record.pick_check_user,
              pick_check: emopickId === null ? false : record.pick_check,
              emopicks: emopickId === null ? null : (availableEmopicks.find(e => e.id === emopickId) || record.emopicks)
            }
          : record
      );

      setLocalResults(updatedResults);

      // Guardar última selección en localStorage (solo si no es desmarcar)
      if (emopickId !== null) {
        setLastUsedEmopickId(emopickId);
        setLastUsedPickNota(pickNota);
        localStorage.setItem('lastUsedEmopickId', emopickId.toString());
        localStorage.setItem('lastUsedPickNota', pickNota);
      }

      // Cerrar modal
      handleClosePickModal();

    } catch (error) {
      alert(error.message || 'Error al guardar la selección');
    }
  };

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

  return (
    <div className="bg-white rounded-xl shadow-lg p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-900">
          <span>
            {results.length < 50 ? `-> Resultados (${results.length}) <-` : '->Al menos 50 resultados. Refine la búsqueda <-'}
          </span>
        </h3>
      </div>

      <div className="space-y-4">
        {localResults.map((record) => (
          <div
            key={record.documento}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
          >
            {/* Nivel 1: Apellido, Nombre */}
            <div className="mb-3">
              <h4 className="text-lg font-semibold text-gray-900">
                {record.apellido}, {record.nombre}
              </h4>
            </div>

            {/* Nivel 2: Domicilio */}
            <div className="mb-3">
              <div className="flex items-center space-x-2 text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>{record.domicilio || 'No especificado'}</span>
              </div>
            </div>

            {/* Nivel 3: Documento / Clase */}
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div className="flex items-center space-x-1 font-medium text-gray-600">
                <Hash className="w-4 h-4" /> 
                <span>{formatNumber(record.documento)}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                {/* <FileText className="w-4 h-4" /> */}
                <span>Clase: {formatNumber(record.clase) || '---'}</span>
              </div>
            </div>

            {/* Nivel 4: Localidad / Mesa */}
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div className="flex items-center space-x-2 font-medium text-gray-600">
                <Users className="w-4 h-4" />
                <span>Mesa: {record.mesa_numero || '---'}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                {/* <MapPin className="w-4 h-4" /> */}
                <span> {record.mesas?.establecimientos?.circuitos?.localidad || 'No especificada'}</span>
              </div>
            </div>

            {/* Nivel 5: da_es_nuevo / da_voto_obligatorio / voto_emitido */}
            <div className="grid grid-cols-3 gap-4 mb-3">
              <div className="flex items-center justify-center">
                {record.da_es_nuevo && (
                  <span className="flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                    {/* <Sparkles className="w-3 h-3" /> */} 
                    <span>NUEVO</span>
                  </span>
                )}
              </div>
              <div className="flex items-center justify-center">
                {record.da_voto_obligatorio === false ? (
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
              {/* <span className="flex items-center space-x-1 text-gray-600 text-xs font-medium">
                    <XCircle className="w-3 h-3" /> */} 
                    <span>NO.OBLIGADO</span>
                  </span>
                ) : record.da_voto_obligatorio === true ? (
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  {/* <span className="flex items-center space-x-1 text-green-600 text-sm font-medium">
                    <CheckCircle className="w-3 h-3" /> */} 
                    <span>OBLIGATORIO</span>
                  </span>
                ) : null}
              </div>
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

            {/* Nivel 6: Solo visible para usuarios tipo 3 o inferior */}
            {userRole && userRole <= 3 && (
              <div className="grid grid-cols-3 gap-4 pt-3 border-t border-gray-100">
                <div className="text-xs text-gray-600 text-center">
                  <span className="font-medium"> </span>
                  <p className="mt-1"> {record.da_texto_libre || ''}</p>
                </div>
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

      {/* Modal de PICK */}
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