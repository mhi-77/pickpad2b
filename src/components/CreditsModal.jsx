import React from 'react';
import { X } from 'lucide-react';
import mhiImage from '../mhi.png';

/**
 * Componente CreditsModal - Modal reutilizable para mostrar créditos
 *
 * Propósito: Mostrar información de la aplicación, contacto y licencia
 *
 * Props:
 * - isOpen: boolean - Controla si el modal está visible
 * - onClose: function - Función para cerrar el modal
 * - appVersion: string - Versión de la aplicación
 */
export default function CreditsModal({ isOpen, onClose, appVersion }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[100]"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl p-4 w-70 max-w-md relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Contenido del modal */}
        <div className="text-center">
          {/* Logo MHI */}
          <div className="pt-4 flex justify-center">
            <img
              src={mhiImage}
              alt="MHI - Mi Havas Ideon"
              className="w-24 h-24 object-contain"
            />
          </div>

          {/* Información de contacto y detalles */}
          <div className="space-y-3 text-gray-700">
            <div>
              <p className="text-sm font-medium text-gray-500">Contacto</p>
              <p className="text-base">contacto@mihavasideon.com</p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">Sitio Web</p>
              <a
                href="https://www.mehavasidean.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-base text-blue-600 hover:text-blue-800 hover:underline transition-colors"
              >
                www.mihavasideon.com
              </a>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <p className="text-lg font-bold text-gray-900">PickPad</p>
              <p className="text-sm text-gray-600">Versión {appVersion}</p>
              <p className="text-xs text-gray-500 mt-1">Última actualización: Febrero 2026</p>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-600 italic">
                Licencia de uso: PJ-TQST
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
