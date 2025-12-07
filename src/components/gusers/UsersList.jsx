import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Edit3, Trash2, Mail, User, Hash, UserCheck, Clock, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import EditUserForm from './EditUserForm';
import { useAuth } from '../../context/AuthContext';
import DeleteConfirmModal from './DeleteConfirmModal';
import NotificationToast from './NotificationToast';
import Pagination from '../shared/Pagination';

export default function UsersList({ userTypes = [] }) {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [notification, setNotification] = useState({ isOpen: false, type: 'success', message: '' });

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(() => {
    const saved = localStorage.getItem('usersListPageSize');
    return saved ? Number(saved) : 25;
  });
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetchUsers();
  }, [currentPage, pageSize, filterStatus]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data, error } = await supabase
        .from('users_status')
        .select('status');

      if (!error && data) {
        const stats = data.reduce((acc, user) => {
          acc[user.status] = (acc[user.status] || 0) + 1;
          return acc;
        }, {});

        setStats({
          total: data.length,
          active: stats.active || 0,
          invited: stats.invited || 0,
          pending: stats.pending || 0
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('users_status')
        .select('*', { count: 'exact' })
        .order('full_name', { ascending: true, nullsFirst: false });

      if (filterStatus) {
        query = query.eq('status', filterStatus);
      }

      const from = (currentPage - 1) * pageSize;
      const to = from + pageSize - 1;

      const { data, error, count } = await query.range(from, to);

      if (error) {
        console.error('Error fetching users:', error);
      } else {
        setUsers(data || []);
        setTotalCount(count || 0);
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

  const handleDeleteUser = (userId, userName) => {
    setUserToDelete({ id: userId, name: userName });
    setShowDeleteModal(true);
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userToDelete.id);

      if (error) {
        console.error('Error deleting user:', error);
        setNotification({
          isOpen: true,
          type: 'error',
          message: 'Error al eliminar usuario'
        });
      } else {
        await fetchUsers();
        await fetchStats();
        setNotification({
          isOpen: true,
          type: 'success',
          message: 'Usuario eliminado exitosamente'
        });
      }
    } catch (error) {
      console.error('Error:', error);
      setNotification({
        isOpen: true,
        type: 'error',
        message: 'Error inesperado al eliminar usuario'
      });
    } finally {
      setShowDeleteModal(false);
      setUserToDelete(null);
    }
  };

  const cancelDeleteUser = () => {
    setShowDeleteModal(false);
    setUserToDelete(null);
  };

  const handleUserUpdated = async () => {
    await fetchUsers();
    await fetchStats();
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
    setCurrentPage(1);
    localStorage.setItem('usersListPageSize', newSize.toString());
  };

  const handleFilterChange = (status) => {
    setFilterStatus(status);
    setCurrentPage(1);
  };

  const canModifyUser = (targetUser) => {
    if (!currentUser) return false;
    if (currentUser.usuario_tipo > 1 && targetUser.usuario_tipo === 1) {
      return false;
    }
    return true;
  };

  const getUserTypeColor = (tipo) => {
    const userType = userTypes.find(ut => ut.tipo === tipo);
    const name = userType ? userType.descripcion : 'Tipo desconocido';
    
    let color = 'bg-gray-100 text-gray-800';
    
    if (tipo === 1 || tipo === 2) {
      color = 'bg-yellow-100 text-yellow-800';
    } else if (tipo === 3 || tipo === 4) {
      color = 'bg-blue-100 text-blue-800';
    } else if (userTypes.length > 0) {
      const maxTipo = Math.max(...userTypes.map(ut => ut.tipo));
      if (tipo === maxTipo) {
        color = 'bg-red-100 text-red-800';
      }
    }
    
    return { name, color };
  };

  const getStatusConfig = (status) => {
    const statusMap = {
      'active': { 
        name: 'Operativo', 
        color: 'bg-green-100 text-green-800', 
        icon: CheckCircle,
        description: 'Usuario activo y operativo' 
      },
      'invited': { 
        name: 'Invitado', 
        color: 'bg-yellow-100 text-yellow-800', 
        icon: Clock,
        description: 'Invitación enviada, pendiente de activación' 
      },
      'pending': { 
        name: 'Pendiente', 
        color: 'bg-gray-100 text-gray-800', 
        icon: AlertCircle,
        description: 'Usuario creado pero sin invitar' 
      }
    };
    return statusMap[status] || { 
      name: 'Desconocido', 
      color: 'bg-red-100 text-red-800', 
      icon: XCircle,
      description: 'Estado desconocido' 
    };
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Sin fecha';
    return new Date(dateString).toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDateOnly = (dateString) => {
    if (!dateString) return 'Sin fecha';
    return new Date(dateString).toLocaleDateString('es-AR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTimeOnly = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleTimeString('es-AR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
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

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="space-y-6">
      {/* Estadísticas con filtro */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2">
          {/* Total */}
          <button
            type="button"
            onClick={() => handleFilterChange(null)}
            title="Mostrar todos los usuarios"
            className={`bg-white rounded-lg shadow p-3 sm:p-3 text-left transition-all duration-200 ${
              filterStatus === null
                ? 'ring-2 ring-blue-500 bg-blue-50'
                : 'hover:shadow-md hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center">
              <User className="h-6 w-6 text-blue-600" />
              <div className="ml-3">
                <p className="text-xs sm:text-sm font-medium text-gray-500">Total</p>
                <p className="text-lg sm:text-2xl font-semibold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </button>

          {/* Operativos */}
          <button
            type="button"
            onClick={() => handleFilterChange('active')}
            title="Mostrar solo usuarios operativos"
            className={`bg-white rounded-lg shadow p-3 sm:p-4 text-left transition-all duration-200 ${
              filterStatus === 'active'
                ? 'ring-2 ring-green-500 bg-green-50'
                : 'hover:shadow-md hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <div className="ml-3">
                <p className="text-xs sm:text-sm font-medium text-gray-500">Operativos</p>
                <p className="text-lg sm:text-2xl font-semibold text-gray-900">{stats.active}</p>
              </div>
            </div>
          </button>

          {/* Invitados */}
          <button
            type="button"
            onClick={() => handleFilterChange('invited')}
            title="Mostrar solo usuarios invitados"
            className={`bg-white rounded-lg shadow p-3 sm:p-4 text-left transition-all duration-200 ${
              filterStatus === 'invited'
                ? 'ring-2 ring-yellow-500 bg-yellow-50'
                : 'hover:shadow-md hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center">
              <Clock className="h-6 w-6 text-yellow-600" />
              <div className="ml-3">
                <p className="text-xs sm:text-sm font-medium text-gray-500">Invitados</p>
                <p className="text-lg sm:text-2xl font-semibold text-gray-900">{stats.invited}</p>
              </div>
            </div>
          </button>

          {/* Pendientes */}
          <button
            type="button"
            onClick={() => handleFilterChange('pending')}
            title="Mostrar solo usuarios pendientes"
            className={`bg-white rounded-lg shadow p-3 sm:p-4 text-left transition-all duration-200 ${
              filterStatus === 'pending'
                ? 'ring-2 ring-gray-500 bg-gray-50'
                : 'hover:shadow-md hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center">
              <AlertCircle className="h-6 w-6 text-gray-600" />
              <div className="ml-3">
                <p className="text-xs sm:text-sm font-medium text-gray-500">Pendientes</p>
                <p className="text-lg sm:text-2xl font-semibold text-gray-900">{stats.pending}</p>
              </div>
            </div>
          </button>
        </div>
      )}

      {/* Lista de usuarios */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Espacio inferior, sin título redundante */}
        <div className="px-4 sm:px-6 pb-2 sm:pb-4"></div>

        {users.length === 0 ? (
          <div className="text-center text-gray-500 py-12">
            <User className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>
              {filterStatus
                ? `No hay usuarios con estado "${getStatusConfig(filterStatus).name}"`
                : 'No hay usuarios registrados'
              }
            </p>
          </div>
        ) : (
          <>
        {/* Tabla para desktop */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuario
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Última Conexión
                </th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {users.map((user) => {
                const statusConfig = getStatusConfig(user.status);
                const StatusIcon = statusConfig.icon;
        
                return (
                  <tr key={user.id} className="hover:bg-gray-25 transition-colors">
                    <td className="px-4 py-2">
                      <div className="flex items-center">
                        <div className="ml-2">
                          <div className="text-sm font-medium text-gray-900">
                            {user.full_name || 'Sin nombre'}
                          </div>
                          <div className="text-xs text-gray-500 flex items-center">
                            <Mail className="w-3 h-3 mr-1" />
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {(() => {
                        const userType = getUserTypeColor(user.usuario_tipo);
                        return (
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${userType.color}`}>
                            <UserCheck className="w-3 h-3 mr-1" />
                            {userType.name}
                          </span>
                        );
                      })()}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <span 
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig.color}`}
                        title={statusConfig.description}
                      >
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {statusConfig.name}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-xs text-gray-500">
                      <div>{user.last_sign_in_at ? formatDateOnly(user.last_sign_in_at) : 'Nunca'}</div>
                      <div>{user.last_sign_in_at ? formatTimeOnly(user.last_sign_in_at) : '--:--'}</div>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-1">
                        {(() => {
                          const canModify = canModifyUser(user);
                          return (
                            <>
                              <button
                                onClick={() => canModify && handleEditUser(user)}
                                disabled={!canModify}
                                className={`p-1 rounded transition-colors ${
                                  canModify
                                    ? 'text-blue-600 hover:text-blue-900 hover:bg-blue-50 cursor-pointer'
                                    : 'text-gray-400 cursor-not-allowed opacity-50'
                                }`}
                                title={canModify ? "Editar usuario" : "No puedes editar superusuarios"}
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => canModify && handleDeleteUser(user.id, user.full_name)}
                                disabled={!canModify}
                                className={`p-1 rounded transition-colors ${
                                  canModify
                                    ? 'text-red-600 hover:text-red-900 hover:bg-red-50 cursor-pointer'
                                    : 'text-gray-400 cursor-not-allowed opacity-50'
                                }`}
                                title={canModify ? "Eliminar usuario" : "No puedes eliminar superusuarios"}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          );
                        })()}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Tarjetas para móvil */}
        <div className="sm:hidden divide-y divide-gray-100">
          {users.map((user) => {
            const statusConfig = getStatusConfig(user.status);
            const StatusIcon = statusConfig.icon;
        
            return (
              <div key={user.id} className="p-3 hover:bg-gray-25 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {user.full_name || 'Sin nombre'}
                    </div>
                    <div className="text-xs text-gray-500 flex items-center mt-0.5">
                      <Mail className="w-3 h-3 mr-1" />
                      {user.email}
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    {(() => {
                      const canModify = canModifyUser(user);
                      return (
                        <>
                          <button
                            onClick={() => canModify && handleEditUser(user)}
                            disabled={!canModify}
                            className={`p-1 rounded ${
                              canModify
                                ? 'text-blue-600 hover:text-blue-900 hover:bg-blue-50'
                                : 'text-gray-400 cursor-not-allowed opacity-50'
                            }`}
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => canModify && handleDeleteUser(user.id, user.full_name)}
                            disabled={!canModify}
                            className={`p-1 rounded ${
                              canModify
                                ? 'text-red-600 hover:text-red-900 hover:bg-red-50'
                                : 'text-gray-400 cursor-not-allowed opacity-50'
                            }`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      );
                    })()}
                  </div>
                </div>
        
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {(() => {
                    const userType = getUserTypeColor(user.usuario_tipo);
                    return (
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${userType.color}`}>
                        <UserCheck className="w-3 h-3 mr-1" />
                        {userType.name}
                      </span>
                    );
                  })()}
                  <span 
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig.color}`}
                  >
                    <StatusIcon className="w-3 h-3 mr-1" />
                    {statusConfig.name}
                  </span>
                </div>
        
                <div className="text-xs text-gray-500">
                  <span className="font-medium">Últ. conexión: </span>
                  {user.last_sign_in_at 
                    ? `${formatDateOnly(user.last_sign_in_at)} ${formatTimeOnly(user.last_sign_in_at)}`
                    : 'Nunca'
                   }
                </div>
              </div>
            );
          })}
        </div>
          </>
        )}

        {/* Paginación */}
        {users.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalCount}
            pageSize={pageSize}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            loading={loading}
          />
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
          userTypes={userTypes}
        />

        {/* Modal de confirmación de eliminación */}
        <DeleteConfirmModal
          isOpen={showDeleteModal}
          userName={userToDelete?.name || ''}
          onConfirm={confirmDeleteUser}
          onCancel={cancelDeleteUser}
        />

        {/* Notificación Toast */}
        <NotificationToast
          isOpen={notification.isOpen}
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification({ ...notification, isOpen: false })}
        />
      </div>
    </div>
  );
}