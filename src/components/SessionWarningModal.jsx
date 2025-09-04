import React, { useState, useEffect, useRef } from 'react';
import { AlertTriangle, Clock, RefreshCw } from 'lucide-react';

// Componente modal que muestra una advertencia de expiración de sesión
export default function SessionWarningModal({ 
  isOpen,                    // Prop: Booleano que indica si el modal está abierto
  warningMinutes = 1,        // Prop: Minutos de advertencia (valor por defecto: 1 minuto)
  onExtendSession,           // Prop: Función callback para extender la sesión
  onLogout                   // Prop: Función callback para cerrar sesión
}) {
  // Estado para llevar la cuenta de los segundos restantes
  const [seconds, setSeconds] = useState(warningMinutes * 60);
  
  // Referencia para almacenar el ID del intervalo y poder limpiarlo
  const intervalRef = useRef(null);

  // Efecto que se ejecuta cuando cambia isOpen, warningMinutes u onLogout
  useEffect(() => {
    // Si el modal no está abierto, no hacer nada
    if (!isOpen) return;
    
    // Convertir minutos de advertencia a segundos
    const warningSeconds = warningMinutes * 60;
    setSeconds(warningSeconds); // Reiniciar el contador

    // Limpiar cualquier intervalo previo para evitar múltiples intervalos
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Crear un nuevo intervalo que se ejecuta cada segundo (1000ms)
    intervalRef.current = setInterval(() => {
      setSeconds(prev => {
        if (prev <= 1) {
          // Cuando quedan 0 o 1 segundos, limpiar el intervalo y hacer logout automático
          clearInterval(intervalRef.current);
          onLogout(); // Ejecutar callback de cierre de sesión
          return 0;
        }
        return prev - 1; // Decrementar el contador en 1 segundo
      });
    }, 1000);

    // Función de limpieza: se ejecuta cuando el componente se desmonta o cuando cambian las dependencias
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current); // Limpiar el intervalo para evitar memory leaks
      }
    };
  }, [isOpen, warningMinutes, onLogout]); // Dependencias del efecto

  // Si el modal no está abierto, no renderizar nada
  if (!isOpen) return null;

  // Calcular minutos y segundos para mostrar en formato MM:SS
  const minutes = Math.floor(seconds / 60);
  const remainingSecondsDisplay = seconds % 60;

  // Renderizar el modal con la interfaz de advertencia
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4">
        {/* Encabezado con icono de advertencia */}
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

        {/* Sección de cuenta regresiva */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-2 text-yellow-800">
            <Clock className="w-5 h-5" />
            <span className="font-medium">
              Tiempo restante: {minutes}:{remainingSecondsDisplay.toString().padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* Botones de acción */}
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