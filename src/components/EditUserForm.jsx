import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { X, Save, User } from 'lucide-react';

export default function EditUserForm({ userId, isOpen, onClose, onUserUpdated }) {
  const [formData, setFormData] = useState({
    full_name: '',
    dni: '',
    usuario_tipo: '',
    email: ''
  });
  const [loading, setLoading] = useState(false);
  const [loadingUser, setLoadingUser] = useState(false);
  const [message, setMessage] = useState('');

  // Cargar datos del usuario cuando se abre el modal
  useEffect(() => {
    if (isOpen && userId) {
      fetchUserData();
    }
  }, [isOpen, userId]);

  const fetchUserData = async () => {
    setLoadingUser(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user:', error);
        setMessage('Error al cargar datos del usuario');
      } else {
        setFormData({
          full_name: data.full_name || '',
          dni: data.dni?.toString() || '',
          usuario_tipo: data.usuario_tipo?.toString() || '',
          email: data.email || ''
        });
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Error inesperado al cargar usuario');
    } finally {
      setLoadingUser(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          dni: parseInt(formData.dni),
          usuario_tipo: parseInt(formData.usuario_tipo),
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) {
        setMessage(`Error: ${error.message}`);
      } else {
        setMessage('¡Usuario actualizado exitosamente!');
        // Notificar al componente padre que se actualizó
        if (onUserUpdated) {
          onUserUpdated();
        }
        // Cerrar modal después de 1.5 segundos
        setTimeout(() => {
          onClose();
          setMessage('');
        }, 1500);
      }
    } catch (err) {
      setMessage('Error inesperado. Intenta nuevamente.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <User className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Editar Usuario</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loadingUser ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Cargando datos...</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre Completo
                </label>
                <input
                  id="full_name"
                  name="full_name"
                  type="text"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label htmlFor="dni" className="block text-sm font-medium text-gray-700 mb-1">
                  DNI
                </label>
                <input
                  id="dni"
                  name="dni"
                  type="number"
                  value={formData.dni}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label htmlFor="usuario_tipo" className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Usuario
                </label>
                <select
                  id="usuario_tipo"
                  name="usuario_tipo"
                  value={formData.usuario_tipo}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Seleccionar tipo...</option>
                  <option value="1">Administrador</option>
                  <option value="2">Fiscal</option>
                  <option value="3">Operador</option>
                  <option value="4">Consultor</option>
                </select>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-sm text-gray-500">(solo lectura)</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 cursor-not-allowed"
                  disabled
                />
                <p className="text-xs text-gray-500 mt-1">
                  Para cambiar el email, el usuario debe hacerlo desde su perfil
                </p>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md text-white font-medium ${
                    loading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                  } transition duration-200`}
                >
                  <Save className="w-4 h-4" />
                  <span>{loading ? 'Guardando...' : 'Guardar Cambios'}</span>
                </button>
                
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md font-medium transition duration-200"
                >
                  Cancelar
                </button>
              </div>

              {message && (
                <div className={`mt-4 p-3 rounded-md ${
                  message.includes('Error') 
                    ? 'bg-red-50 text-red-700 border border-red-200' 
                    : 'bg-green-50 text-green-700 border border-green-200'
                }`}>
                  {message}
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}