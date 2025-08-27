import React, { useState, useEffect } from 'react';
import { AlertCircle, Users, CheckCircle, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import FiscalizarSearchForm from './FiscalizarSearchForm';
import FiscalizarResults from './FiscalizarResults';

export default function FiscalizarView() {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState(null);
  const [padronData, setPadronData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState('');

  // Cargar perfil del usuario y datos del padrón
  useEffect(() => {
    loadUserProfile();
  }, [user]);

  useEffect(() => {
    if (userProfile?.mesa_numero) {
      loadPadronData();
    }
  }, [userProfile]);

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

      // Verificar que el usuario tenga permisos (tipo 2 o 3)
      if (data.usuario_tipo !== 2 && data.usuario_tipo !== 3) {
        setError('No tiene permisos para acceder a la fiscalización');
        return;
      }

      // Verificar que tenga mesa asignada
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

  const loadPadronData = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('padron')
        .select('*')
        .eq('mesa_numero', userProfile.mesa_numero)
        .order('orden', { ascending: true });

      if (error) {
        console.error('Error loading padron:', error);
        setError('Error al cargar los datos del padrón');
        return;
      }

      setPadronData(data || []);
      setFilteredData(data || []);
    } catch (error) {
      console.error('Error loading padron data:', error);
      setError('Error al cargar los datos del padrón');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (documento) => {
    if (!documento.trim()) {
      // Si no hay documento, mostrar todos los registros
      setFilteredData(padronData);
    } else {
      // Buscar por documento exacto
      const filtered = padronData.filter(record => 
        record.documento.toString() === documento.trim()
      );
      setFilteredData(filtered);
    }
  };

  const handleMarcarVoto = async (documento) => {
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('padron')
        .update({
          voto_emitido: true,
          voto_pick_at: new Date().toISOString(),
          voto_pick_user: user.id
        })
        .eq('documento', documento)
        .eq('mesa_numero', userProfile.mesa_numero); // Seguridad adicional

      if (error) {
        console.error('Error updating vote:', error);
        alert('Error al registrar el voto');
        return;
      }

      // Actualizar los datos localmente
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
      
      setPadronData(updatedPadron);
      
      // Actualizar también los datos filtrados
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

    } catch (error) {
      console.error('Error marking vote:', error);
      alert('Error al registrar el voto');
    } finally {
      setIsUpdating(false);
    }
  };

  // Calcular estadísticas
  const totalEmpadronados = padronData.length;
  const totalVotaron = padronData.filter(record => record.voto_emitido).length;
  const pendientes = totalEmpadronados - totalVotaron;
  const porcentajeParticipacion = totalEmpadronados > 0 ? ((totalVotaron / totalEmpadronados) * 100).toFixed(1) : 0;

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
    <div className="space-y-6">
      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <Users className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-2xl font-bold text-blue-900">{totalEmpadronados}</p>
              <p className="text-sm text-blue-700">Empadronados</p>
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-2xl font-bold text-green-900">{totalVotaron}</p>
              <p className="text-sm text-green-700">Votaron</p>
            </div>
          </div>
        </div>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <Clock className="w-8 h-8 text-yellow-600" />
            <div>
              <p className="text-2xl font-bold text-yellow-900">{pendientes}</p>
              <p className="text-sm text-yellow-700">Pendientes</p>
            </div>
          </div>
        </div>
        
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
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

      {/* Formulario de búsqueda */}
      <FiscalizarSearchForm
        onSearch={handleSearch}
        isLoading={isLoading}
        mesaNumero={userProfile.mesa_numero}
        totalRegistros={totalEmpadronados}
      />

      {/* Resultados */}
      <FiscalizarResults
        results={filteredData}
        isLoading={isLoading}
        onMarcarVoto={handleMarcarVoto}
        isUpdating={isUpdating}
      />
    </div>
  );
}