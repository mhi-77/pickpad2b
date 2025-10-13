import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Edit3, Trash2, Mail, User, Hash, UserCheck } from 'lucide-react';
import EditUserForm from './EditUserForm';

export default function UsersList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false, nullsLast: true }); // Cambié de vuelta a created_at con nullsLast

      if (error) {
        console.error('Error fetching users:', error);
      } else {
        setUsers(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user.id);
    setShowEditModal(true);
  };

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`¿Estás seguro de que deseas eliminar a ${userName}?`)) {
      return;
    }

    try {
      // Eliminar del perfil (el usuario en auth.users permanece)
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (error) {
        console.error('Error deleting user:', error);
        alert('Error al eliminar usuario');
      } else {
        // Actualizar la lista
        fetchUsers();
        alert('Usuario eliminado exitosamente');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error inesperado al eliminar usuario');
    }
  };

  const handleUserUpdated = () => {
    fetchUsers(); // Recargar la lista después de actualizar
  };

  const getUserTypeColor = (tipo) => {
    const typeMap = {
      1: { name: 'Admin', color: 'bg-red-100 text-red-800' },
      2: { name: 'Fiscal', color: 'bg-blue-100 text-blue-800' },
      3: { name: 'Operador', color: 'bg-green-100 text-green-800' },
      4: { name: 'Consultor', color: 'bg-yellow-100 text-yellow-800' }
    };
    return typeMap[tipo] || { name: 'Sin tipo', color: 'bg-gray-100 text-gray-800' };
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Cargando usuarios...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">
          Lista de Usuarios ({users.length})
        </h3>
      </div>

      {users.length === 0 ? (
        <div className="p-6 text-center text-gray-500">
          <User className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No hay usuarios registrados</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuario
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  DNI
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Creado
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {user.full_name ? user.full_name.charAt(0).toUpperCase() : '?'}
                        </span>
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {user.full_name || 'Sin nombre'}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Mail className="w-3 h-3 mr-1" />
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <Hash className="w-3 h-3 mr-1 text-gray-400" />
                      {user.dni || 'Sin DNI'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {(() => {
                      const userType = getUserTypeColor(user.usuario_tipo);
                      return (
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${userType.color}`}>
                          <UserCheck className="w-3 h-3 mr-1" />
                          {userType.name}
                        </span>
                      );
                    })()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.created_at ? formatDate(user.created_at) : 'Sin fecha'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleEditUser(user)}
                        className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded transition-colors"
                        title="Editar usuario"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id, user.full_name)}
                        className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded transition-colors"
                        title="Eliminar usuario"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal de edición */}
      <EditUserForm
        userId={editingUser}
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingUser(null);
        }}
        onUserUpdated={handleUserUpdated}
      />
    </div>
  );
}