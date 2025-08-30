import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function SignupForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          // Redirige después de confirmar email
          emailRedirectTo: `${window.location.origin}/welcome`,
          // Opcional: datos adicionales del usuario
          data: {
            created_at: new Date().toISOString(),
          }
        },
      });

      if (error) {
        setMessage(`Error: ${error.message}`);
      } else {
        setMessage('¡Cuenta creada exitosamente! Revisa tu correo para confirmar tu cuenta.');
        // Limpiar formulario
        setEmail('');
        setPassword('');
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
          <input
            id="password"
            type="password"
            placeholder="Mínimo 6 caracteres"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading || !email || !password}
          className={`w-full py-2 px-4 rounded-md text-white font-medium ${
            loading || !email || !password
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
          } transition duration-200`}
        >
          {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
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

      {/* <p className="mt-6 text-center text-sm text-gray-600">
        ¿Ya tienes cuenta?{' '}
        <button className="text-blue-600 hover:text-blue-500 font-medium">
          Iniciar Sesión
        </button>
      </p> */}
    </div>
  );
}