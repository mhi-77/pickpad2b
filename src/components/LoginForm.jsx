import React, { useState } from 'react';
import { LogIn, Eye, EyeOff, AlertCircle, CheckCheck, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import logoImage from '../pblanca.png';
import mhiImage from '../mhi.png';

/**
 * Componente LoginForm - Formulario de inicio de sesión
 * 
 * Propósito: Proporciona una interfaz de usuario para que los usuarios se autentiquen
 * en el sistema PickPad. Incluye validación de campos y manejo de errores.
 * 
 * Props:
 * - appVersion: string - Versión de la aplicación para mostrar en la UI
 */
export default function LoginForm({ appVersion }) {
  // Estados locales para el manejo del formulario
  const [email, setEmail] = useState('');
  // Estado para almacenar la contraseña ingresada por el usuario
  const [password, setPassword] = useState('');
  // Estado para controlar la visibilidad de la contraseña (mostrar/ocultar)
  const [showPassword, setShowPassword] = useState(false);
  // Estado para almacenar y mostrar mensajes de error de autenticación
  const [error, setError] = useState('');
  // Estado para controlar la visibilidad del modal de créditos
  const [showCreditsModal, setShowCreditsModal] = useState(false);
  // Obtener funciones de autenticación del contexto
  const { login, isLoading } = useAuth();

  /**
   * Maneja el envío del formulario de inicio de sesión
   * 
   * Flujo:
   * 1. Previene el comportamiento por defecto del formulario
   * 2. Limpia errores previos
   * 3. Valida que ambos campos estén completos
   * 4. Llama a la función de login del contexto
   * 5. Maneja el resultado (éxito o error)
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validación básica de campos requeridos
    if (!email || !password) {
      setError('Por favor, completa todos los campos');
      return;
    }

    // Intentar autenticar al usuario
    const success = await login(email, password);
    if (!success) {
      setError('Credenciales incorrectas');
    }
  };

  return (
    // Contenedor principal con diseño centrado y fondo degradado
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        {/* Header del formulario con logo y título */}
        <div className="text-center mb-8">
          <button
            type="button"
            onClick={() => setShowCreditsModal(true)}
            className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4 overflow-hidden hover:bg-blue-700 transition-colors cursor-pointer"
          >
            <img
              src={logoImage}
              alt="Logo de la aplicación"
              className="w-11 h-11 object-cover"
            />
          </button>
          <button
            type="button"
            onClick={() => setShowCreditsModal(true)}
            className="text-2xl font-bold text-gray-900 mb-2 hover:text-blue-600 transition-colors cursor-pointer"
          >
            PickPad <span className="text-sm text-gray-900">v{appVersion}</span>
          </button>
          <p className="text-gray-600">Ingresa tus credenciales para continuar</p>
        </div>

        {/* Formulario de inicio de sesión */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Campo de correo electrónico */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              placeholder="usuario@ejemplo.com"
              required
            />
          </div>

          {/* Campo de contraseña con botón para mostrar/ocultar */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="••••••••"
                required
              />
              {/* Botón para alternar visibilidad de la contraseña */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mensaje de error (se muestra condicionalmente) */}
          {error && (
            <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Botón de envío con estado de carga */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              // Spinner de carga mientras se procesa la autenticación
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                <span>Iniciar Sesión</span>
              </>
            )}
          </button>
        </form>

        {/* Sección de credenciales de prueba para desarrollo */}
        <div className="mt-8 p-2 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Credenciales temporales</h3>
          <div className="text-xs text-gray-600 space-y-1">
            <p><strong>Colaborador:</strong> colabor@dor.pp / solover2025</p>
            {/* <p><strong>Usuario:</strong> usuario@padrones.gov / admin123</p> */}
          </div>
        </div>
      </div>

      {/* Modal de créditos */}
      {showCreditsModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setShowCreditsModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl p-8 w-80 max-w-md relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botón cerrar */}
            <button
              onClick={() => setShowCreditsModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Contenido del modal */}
            <div className="text-center">
              {/* Logo MHI */}
              <div className="mb-6 flex justify-center">
                <img
                  src={mhiImage}
                  alt="MHI - Me Havas Idean"
                  className="w-32 h-32 object-contain"
                />
              </div>

              {/* Información de contacto y detalles */}
              <div className="space-y-3 text-gray-700">
                <div>
                  <p className="text-sm font-medium text-gray-500">Contacto</p>
                  <p className="text-base">contacto@mehavasidean.com</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500">Sitio Web</p>
                  <p className="text-base text-blue-600">www.mehavasidean.com</p>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <p className="text-lg font-bold text-gray-900">PickPad</p>
                  <p className="text-sm text-gray-600">Versión {appVersion}</p>
                  <p className="text-xs text-gray-500 mt-1">Última actualización: Noviembre 2025</p>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-600 italic">
                    Licencia de uso: Municipalidad de XXX
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}