import React, { useState, useEffect } from 'react';
import { X, Save, SquarePen } from 'lucide-react';

/**
 * Componente PickModal - Modal para seleccionar emopick y agregar anotación
 *
 * Propósito: Permite al usuario seleccionar un emoji/display de la tabla emopicks
 * y agregar una anotación breve para un votante específico.
 *
 * Props:
 * - isOpen: boolean - Controla la visibilidad del modal
 * - onClose: function - Callback para cerrar el modal
 * - onSave: function - Callback para guardar la selección (emopickId, pickNota)
 * - emopicksList: array - Lista de emopicks disponibles
 * - initialEmopickId: number - ID del emopick inicialmente seleccionado (para pre-seleccionar el dropdown)
 * - initialPickNota: string - Anotación inicial
 * - votanteName: string - Nombre del votante para mostrar en el modal
 * - currentVoterEmopickId: number - ID del emopick que tiene asignado el votante actual (para verificar si tiene emopick)
 */
export default function PickModal({
  isOpen,
  onClose,
  onSave,
  emopicksList = [],
  initialEmopickId = null,
  initialPickNota = '',
  votanteName = '',
  currentVoterEmopickId = null
}) {
  // Estados locales del modal
  const [selectedEmopickId, setSelectedEmopickId] = useState(initialEmopickId);
  const [pickNota, setPickNota] = useState(initialPickNota);
  const [isSaving, setIsSaving] = useState(false);

  // Actualizar estados cuando cambian las props iniciales
  useEffect(() => {
    setSelectedEmopickId(initialEmopickId);
    setPickNota(initialPickNota);
  }, [initialEmopickId, initialPickNota]);

  /**
   * Maneja el guardado de la selección
   * Valida que se haya seleccionado un emopick y llama al callback onSave
   * Si se selecciona UNMARK, se envía null para desmarcar
   */
  const handleSave = async () => {
    if (!selectedEmopickId) {
      alert('Por favor selecciona una opción');
      return;
    }

    setIsSaving(true);
    try {
      if (selectedEmopickId === 'UNMARK') {
        await onSave(null, '');
      } else {
        await onSave(selectedEmopickId, pickNota.trim());
      }
    } catch (error) {
      console.error('Error saving pick:', error);
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Maneja el cierre del modal
   * Resetea el estado de guardado y llama al callback onClose
   */
  const handleClose = () => {
    setIsSaving(false);
    onClose();
  };

  // No renderizar si el modal no está abierto
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4">
        {/* Header del modal */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <SquarePen className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Marcar Votante
              </h3>
              <p className="text-sm text-gray-600">
                {votanteName}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Contenido del modal */}
        <div className="space-y-6">
          {/* Selector de emopick */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Seleccionar marcador:
            </label>
            <select
              value={selectedEmopickId || ''}
              onChange={(e) => {
                const value = e.target.value;
                if (value === 'UNMARK') {
                  setSelectedEmopickId('UNMARK');
                } else {
                  setSelectedEmopickId(value ? parseInt(value) : null);
                }
              }}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            >
              {currentVoterEmopickId ? (
                <option value="UNMARK" className="font-bold text-red-600">
                 X X = DESMARCAR = X X
                </option>
              ) : (
                <option value="">Selecciona una opción</option>
              )}
              {emopicksList.map((emopick) => (
                <option key={emopick.id} value={emopick.id}>
                  {emopick.display}
                </option>
              ))}
            </select>
          </div>

          {/* Campo de anotación */}
          <div>
            <label htmlFor="pickNota" className="block text-sm font-medium text-gray-700 mb-2">
              Anotación breve (opcional):
            </label>
            <input
              id="pickNota"
              type="text"
              value={pickNota}
              onChange={(e) => setPickNota(e.target.value)}
              maxLength={20}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              placeholder="Máximo 20 caracteres"
            />
            <div className="text-right text-xs text-gray-500 mt-1">
              {pickNota.length}/20 caracteres
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex space-x-3 mt-8">
          <button
            onClick={handleClose}
            disabled={isSaving}
            className="flex-1 px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          
          <button
            onClick={handleSave}
            disabled={isSaving || !selectedEmopickId}
            className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Save className="w-5 h-5" />
            )}
            <span>Guardar</span>
          </button>
        </div>
      </div>
    </div>
  );
}