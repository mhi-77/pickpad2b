import React, { useState } from 'react';
import { User } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function SignupForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [usuarioTipo, setUsuarioTipo] = useState(4); // Default: Fiscal
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Opciones de tipos de usuario disponibles para asignación
  const userTypeOptions = [
    { value: 1, label: 'SUPERUSUARIO', description: 'Acceso completo al sistema' },
    { value: 2, label: 'ADMINISTRADOR', description: 'Gestión de usuarios y padrones' },
    { value: 3, label: 'SUPERVISOR', description: 'Supervisión y estadísticas' },
    { value: 4, label: 'FISCAL', description: 'Fiscalización de mesa asignada' },
    { value: 5, label: 'COLABORADOR', description: 'Acceso básico de consulta' },
  ];
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
          // Datos adicionales del usuario incluyendo el tipo de usuario
          data: {
            created_at: new Date().toISOString(),
            usuario_tipo: usuarioTipo,
          }
        },
      });

      if (error) {
        setMessage(`Error: ${error.message}`);
      } else {
        setMessage(`¡Cuenta creada exitosamente como ${userTypeOptions.find(opt => opt.value === usuarioTipo)?.label}! Revisa tu correo para confirmar tu cuenta.`);
        // Limpiar formulario
        setEmail('');
        setPassword('');
        setUsuarioTipo(4); // Reset to default
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

        <div>
          <label htmlFor="usuarioTipo" className="block text-sm font-medium text-gray-700 mb-1">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>Tipo de Usuario</span>
            </div>
          </label>
          <select
            id="usuarioTipo"
            value={usuarioTipo}
            onChange={(e) => setUsuarioTipo(parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {userTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            {userTypeOptions.find(opt => opt.value === usuarioTipo)?.description}
          </p>
        </div>
        <button
          onClick={handleSubmit}
          disabled={loading || !email || !password || !usuarioTipo}
          className={`w-full py-2 px-4 rounded-md text-white font-medium ${
            loading || !email || !password || !usuarioTipo
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

    </div>
  );
}