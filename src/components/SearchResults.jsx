import React from 'react';
import { FileText, User, MapPin, Hash, Users, Sparkles, XCircle, CheckCircle, SquarePen } from 'lucide-react';
import PickModal from './PickModal';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export default function SearchResults({ results, isLoading, userRole, availableEmopicks = [] }) {
  // Obtener datos del usuario autenticado para registrar quién hace las actualizaciones
  const { user } = useAuth();
  
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
   */
  const handlePickSave = async (emopickId, pickNota) => {
    if (!currentRecordToPick) return;

    // Log de datos que se van a guardar
   /* console.log('=== INICIANDO ACTUALIZACIÓN DE PADRON ===');
    console.log('Documento del votante:', currentRecordToPick.documento);
    console.log('Emopick ID a guardar:', emopickId);
    console.log('Pick nota a guardar:', pickNota);
    console.log('Usuario que realiza la actualización:', user?.id);
    console.log('Tipo de emopickId:', typeof emopickId);
    console.log('Registro completo:', currentRecordToPick); */
    
    try {
    //  console.log('Ejecutando update en Supabase...');
      
      // Actualizar en la base de datos
      const { error } = await supabase
        .from('padron')
        .update({
          emopick_id: emopickId,
          pick_nota: pickNota || null,
          emopick_user: user?.id || null
        })
        .eq('documento', currentRecordToPick.documento);

     /* console.log('Respuesta de Supabase - Error:', error);
      if (error) {
        console.error('Error updating pick:', error);
        console.error('Detalles del error:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        throw new Error('Error al guardar la selección');
      }
      console.log('✅ Actualización exitosa en Supabase'); */
      
      // Actualizar resultados localmente
      const updatedResults = localResults.map(record => 
        record.documento === currentRecordToPick.documento 
          ? { 
              ...record, 
              emopick_id: emopickId,
              pick_nota: pickNota || null,
              emopick_user: user?.id || null,
              emopicks: availableEmopicks.find(e => e.id === emopickId) || record.emopicks
            }
          : record
      );
      
     // console.log('Actualizando resultados locales...');
      setLocalResults(updatedResults);

      // Guardar última selección en localStorage
      setLastUsedEmopickId(emopickId);
      setLastUsedPickNota(pickNota);
      localStorage.setItem('lastUsedEmopickId', emopickId.toString());
      localStorage.setItem('lastUsedPickNota', pickNota);

     // console.log('✅ Datos guardados en localStorage');
     // console.log('=== ACTUALIZACIÓN COMPLETADA ===');
      
    // Cerrar modal
      handleClosePickModal();

    } catch (error) {
    //  console.error('❌ Error en handlePickSave:', error);
    //  console.error('Stack trace:', error.stack);
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
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
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
              <div className="flex items-center space-x-2 font-medium text-gray-600">
               {/* <Hash className="w-4 h-4" /> */}
                <span>DNI: {record.documento}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                {/* <FileText className="w-4 h-4" /> */}
                <span>Clase: {record.clase || '---'}</span>
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
      />
    </div>
  );
}