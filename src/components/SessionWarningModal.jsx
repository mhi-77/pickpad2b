import React, { useState, useEffect, useRef } from 'react';
import { AlertTriangle, Clock, RefreshCw } from 'lucide-react';

export default function SessionWarningModal({ 
  isOpen, 
  onExtendSession, 
  onLogout
}) {
  const [seconds, setSeconds] = useState(60); // 1 minuto de advertencia
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    
    setSeconds(60); //lo modifique a 60

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      setSeconds(prev => {
        
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const minutes = Math.floor(seconds / 60);
  const remainingSecondsDisplay = seconds % 60;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-yellow-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Sesión por expirar
            </h3>
            <p className="text-sm text-gray-600">
              Tu sesión expirará pronto por inactividad
            </p>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-2 text-yellow-800">
            <Clock className="w-5 h-5" />
            <span className="font-medium">
              Tiempo restante: {minutes}:{remainingSecondsDisplay.toString().padStart(2, '0')}
            </span>
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={onExtendSession}
            className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Extender sesión</span>
          </button>
          
          <button
            onClick={onLogout}
            className="flex-1 px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
}