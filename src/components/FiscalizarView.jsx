import React, { useState, useEffect } from 'react';
import { AlertCircle, Users, CheckCircle, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import FiscalizarSearchForm from './FiscalizarSearchForm';
import FiscalizarResults from './FiscalizarResults';

/**
 * Componente FiscalizarView - Vista principal para la fiscalización electoral
 * 
 * Propósito: Permite a los fiscales (usuarios con tipo 2 o 3) gestionar el proceso
 * de votación en su mesa asignada. Incluye búsqueda de votantes, marcado de votos
 * y estadísticas en tiempo real.
 * 
 * Funcionalidades:
 * - Verificación de permisos de usuario
 * - Carga de datos del padrón de la mesa asignada
 * - Búsqueda de votantes por documento
 * - Marcado de votos emitidos
 * - Estadísticas de participación
 */
export default function FiscalizarView() {
  // Obtener datos del usuario autenticado
  const { user } = useAuth();
  
  // Estados para el manejo de datos y UI
  const [userProfile, setUserProfile] = useState(null);
  // Datos completos del padrón de la mesa
  const [padronData, setPadronData] = useState([]);
  // Datos filtrados según la búsqueda actual
  const [filteredData, setFilteredData] = useState([]);
  // Estado de carga para búsquedas
  const [isLoading, setIsLoading] = useState(false);
  // Estado de carga para actualizaciones de votos
  const [isUpdating, setIsUpdating] = useState(false);
  // Mensajes de error
  const [error, setError] = useState('');
  // Control del modal de éxito
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  /**
   * Efecto para cargar el perfil del usuario al montar el componente
   * Se ejecuta cuando cambia el usuario autenticado
   */
  useEffect(() => {
    loadUserProfile();
  }, [user]);

  /**
   * Efecto para cargar los datos del padrón cuando el perfil esté disponible
   * Se ejecuta cuando se obtiene el número de mesa del usuario
   */
  useEffect(() => {
    if (userProfile?.mesa_numero) {
      handleSearch(''); // Cargar todos los registros de la mesa asignada
    }
  }, [userProfile?.mesa_numero]);

  /**
   * Carga el perfil del usuario desde la base de datos
   * Verifica permisos y mesa asignada
   */
  const loadUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error loading profile:', error);
        setError('Error al cargar el perfil del usuario');
        return;
      }

      // Verificar que el usuario tenga permisos de fiscal (tipo 2 o 3)
      if (data.usuario_tipo !== 2 && data.usuario_tipo !== 3) {
        setError('No tiene permisos para acceder a la fiscalización');
        return;
      }

      // Verificar que el usuario tenga una mesa asignada
      if (!data.mesa_numero) {
        setError('No tiene mesa asignada para fiscalizar');
        return;
      }

      setUserProfile(data);
    } catch (error) {
      console.error('Error loading user profile:', error);
      setError('Error al cargar los datos del usuario');
    }
  };

  /**
   * Maneja la búsqueda de votantes en el padrón de la mesa
   * 
   * @param {string} documento - Número de documento a buscar (vacío para todos)
   */
  const handleSearch = async (documento) => {
    if (!userProfile?.mesa_numero) {
      setError('No se ha cargado la información de la mesa');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      // Construir consulta base para la mesa asignada
      let query = supabase
        .from('padron')
        .select('*')
        .eq('mesa_numero', userProfile.mesa_numero)
        .order('orden', { ascending: true });

      if (documento.trim()) {
        // Si se proporciona documento, filtrar por ese número específico
        const docNumber = parseInt(documento.trim());
        if (!isNaN(docNumber)) {
          query = query.eq('documento', docNumber);
        }
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error searching padron:', error);
        setError('Error al buscar en el padrón');
        setFilteredData([]);
        return;
      }

      setFilteredData(data || []);
      
      // Si es búsqueda general (sin documento específico), actualizar datos completos
      if (!documento.trim()) {
        setPadronData(data || []);
      }
    } catch (error) {
      console.error('Error during search:', error);
      setError('Error al buscar en el padrón');
      setFilteredData([]);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Marca un voto como emitido en la base de datos
   * 
   * @param {number} documento - Número de documento del votante
   */
  const handleMarcarVoto = async (documento) => {
    setIsUpdating(true);
    try {
      // Actualizar el registro en la base de datos
      const { error } = await supabase
        .from('padron')
        .update({
          voto_emitido: true,
          voto_pick_at: new Date().toISOString(),
          voto_pick_user: user.id
        })
        .eq('documento', documento)
        .eq('mesa_numero', userProfile.mesa_numero); // Seguridad: solo mesa asignada

      if (error) {
        console.error('Error updating vote:', error);
        alert('Error al registrar el voto');
        return;
      }

      // Actualizar los datos localmente para reflejar el cambio inmediatamente
      const updatedPadron = padronData.map(record => 
        record.documento === documento 
          ? { 
              ...record, 
              voto_emitido: true, 
              voto_pick_at: new Date().toISOString(),
              voto_pick_user: user.id
            }
          : record
      );
      
      // Actualizar datos completos solo si existen
      if (padronData.length > 0) {
        setPadronData(updatedPadron);
      }
      
      // Actualizar también los datos filtrados para la vista actual
      const updatedFiltered = filteredData.map(record => 
        record.documento === documento 
          ? { 
              ...record, 
              voto_emitido: true, 
              voto_pick_at: new Date().toISOString(),
              voto_pick_user: user.id
            }
          : record
      );
      
      setFilteredData(updatedFiltered);

      // Mostrar confirmación de éxito al usuario
      setShowSuccessModal(true);

    } catch (error) {
      console.error('Error marking vote:', error);
      alert('Error al registrar el voto');
    } finally {
      setIsUpdating(false);
    }
  };

  // Calcular estadísticas de participación en tiempo real
  const totalEmpadronados = padronData.length;
  const totalVotaron = padronData.filter(record => record.voto_emitido).length;
  const pendientes = totalEmpadronados - totalVotaron;
  const porcentajeParticipacion = totalEmpadronados > 0 ? ((totalVotaron / totalEmpadronados) * 100).toFixed(1) : 0;

  // Renderizado condicional para errores
  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="text-center py-12">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error</h3>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  // Renderizado condicional para carga inicial
  if (!userProfile) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-600">Cargando datos del usuario...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Panel de estadísticas de participación */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center space-x-3">
            <Users className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-2xl font-bold text-blue-900">{totalEmpadronados}</p>
              <p className="text-sm text-blue-700">Empadronados</p>
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-2xl font-bold text-green-900">{totalVotaron}</p>
              <p className="text-sm text-green-700">Votaron</p>
            </div>
          </div>
        </div>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <div className="flex items-center space-x-3">
            <Clock className="w-8 h-8 text-yellow-600" />
            <div>
              <p className="text-2xl font-bold text-yellow-900">{pendientes}</p>
              <p className="text-sm text-yellow-700">Pendientes</p>
            </div>
          </div>
        </div>
        
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">%</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-900">{porcentajeParticipacion}%</p>
              <p className="text-sm text-purple-700">Participación</p>
            </div>
          </div>
        </div>
      </div>

      {/* Formulario de búsqueda específico para fiscalización */}
      <FiscalizarSearchForm
        onSearch={handleSearch}
        isLoading={isLoading}
        mesaNumero={userProfile.mesa_numero}
        totalRegistros={totalEmpadronados}
      />

      {/* Componente de resultados con funcionalidad de marcado de votos */}
      <FiscalizarResults
        results={filteredData}
        isLoading={isLoading}
        onMarcarVoto={handleMarcarVoto}
        isUpdating={isUpdating}
        showSuccessModal={showSuccessModal}
        setShowSuccessModal={setShowSuccessModal}
      />
    </div>
  );
}