import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Eye, EyeOff } from 'lucide-react';

/**
 * Componente SignupForm - Formulario para crear nuevos usuarios
 * 
 * Props:
 * - userTypes: array - Lista de tipos de usuario disponibles desde usuariost
 */
export default function SignupForm({ userTypes = [] }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [dni, setDni] = useState('');
  const [userType, setUserType] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // El trigger de la base de datos se encarga de crear el perfil automáticamente
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/welcome`,
          data: {
            full_name: fullName,
            dni: dni || null, // Si está vacío, enviar null
            usuario_tipo: parseInt(userType)
          }
        },
      });

      if (error) {
        setMessage(`Error: ${error.message}`);
      } else {
        setMessage('¡Usuario creado exitosamente! Revisa tu correo para confirmar tu cuenta.');
        // Limpiar formulario después del éxito
        setEmail('');
        setPassword('');
        setFullName('');
        setDni('');
        setUserType('');
      }
    } catch (err) {
      setMessage('Error inesperado. Intenta nuevamente.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Crear Cuenta
      </h2>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
            Nombre Completo
          </label>
          <input
            id="fullName"
            type="text"
            placeholder="Juan Pérez"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="dni" className="block text-sm font-medium text-gray-700 mb-1">
            DNI <span className="text-sm text-gray-500">(opcional)</span>
          </label>
          <input
            id="dni"
            type="number"
            placeholder="12345678"
            value={dni}
            onChange={(e) => setDni(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="userType" className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de Usuario
          </label>
          <select
            id="userType"
            value={userType}
            onChange={(e) => setUserType(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Seleccionar tipo...</option>
            {userTypes.map((type) => (
              <option key={type.tipo} value={type.tipo}>
                {type.descripcion}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Correo Electrónico
          </label>
          <input
            id="email"
            type="email"
            placeholder="tu@correo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Contraseña
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading || !email || !password || !fullName || !userType || userTypes.length === 0}
          className={`w-full py-2 px-4 rounded-md text-white font-medium ${
            loading || !email || !password || !fullName || !userType || userTypes.length === 0
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
          } transition duration-200`}
        >
          {loading ? 'Creando usuario...' : 'Crear Usuario'}
        </button>
      </div>

      {/* Mensaje de error si no hay tipos de usuario disponibles */}
      {userTypes.length === 0 && (
        <div className="mt-4 p-3 rounded-md bg-yellow-50 text-yellow-700 border border-yellow-200">
          ⚠️ No se pudieron cargar los tipos de usuario. El formulario está deshabilitado.
        </div>
      )}

      {message && (
        <div className={`mt-4 p-3 rounded-md ${
          message.includes('Error') 
            ? 'bg-red-50 text-red-700 border border-red-200' 
            : 'bg-green-50 text-green-700 border border-green-200'
        }`}>
          {message}
        </div>
      )}
      
    </div>
  );
}