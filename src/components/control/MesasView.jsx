import React from 'react';
import { Archive, Clock } from 'lucide-react';

/**
 * Componente MesasView - Vista de gestión de mesas electorales
 *
 * Propósito: Placeholder para el módulo de gestión de mesas electorales.
 * Este componente será expandido para incluir funcionalidades completas de
 * administración de mesas, asignación de fiscales y monitoreo de estado.
 *
 * Funcionalidades planificadas:
 * - Listado de todas las mesas electorales
 * - Asignación de establecimientos y circuitos
 * - Configuración de capacidad de cada mesa
 * - Visualización de estado en tiempo real
 * - Asignación de fiscales por mesa
 */
export default function MesasView() {
  return (
    <div className="space-y-4">
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <div className="flex items-center space-x-3">
          <Archive className="w-6 h-6 text-purple-600" />
          <div>
            <h3 className="font-semibold text-purple-800">Gestión de Mesas</h3>
            <p className="text-sm text-purple-700">
              Administra y configura las mesas electorales
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-8">
        <div className="text-center max-w-md mx-auto space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full">
            <Clock className="w-8 h-8 text-gray-400" />
          </div>

          <h3 className="text-lg font-semibold text-gray-900">
            Funcionalidad en Desarrollo
          </h3>

          <p className="text-sm text-gray-600">
            El módulo de gestión de mesas estará disponible próximamente.
            Aquí podrás configurar, asignar y visualizar el estado de todas las mesas electorales.
          </p>
        </div>
      </div>
    </div>
  );
}
