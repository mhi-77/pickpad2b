import React, { createContext, useContext, useState } from 'react';
import { supabase } from '../lib/supabase';

/**
 * AuthContext - Contexto de autenticación para la aplicación
 *
 * Propósito: Proporciona estado y funciones de autenticación globales a toda la aplicación,
 * gestionando el ciclo de vida de la sesión del usuario.
 *
 * Funcionalidades principales:
 * - Login con email y contraseña usando Supabase Auth
 * - Carga automática del perfil de usuario desde la tabla profiles
 * - Obtención de tipo de usuario y descripción de rol desde usuariost
 * - Logout con limpieza de estado
 * - Refresco manual del perfil de usuario
 * - Estado de carga durante operaciones de autenticación
 *
 * Estado del usuario incluye:
 * - id: ID único del usuario
 * - email: Email del usuario
 * - name: Nombre completo
 * - dni: Documento Nacional de Identidad
 * - informacion: Información adicional
 * - usuario_tipo: Tipo numérico del usuario (1=Admin, 2=Operador, 3=General, 4=Fiscal, 5=Colaborador)
 * - mesa_numero: Mesa asignada al usuario (si aplica)
 * - roleDescription: Descripción legible del rol
 *
 * Hooks exportados:
 * - useAuth: Hook personalizado para acceder al contexto de autenticación
 */

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email, password) => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error.message);
        setIsLoading(false);
        return false;
      }

      if (data.user) {
        // Obtener el perfil del usuario
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name, dni, informacion, usuario_tipo, mesa_numero')
          .eq('id', data.user.id)
          .single();

        // Obtener la descripción del tipo de usuario
        const { data: userType } = await supabase
          .from('usuariost')
          .select('descripcion')
          .eq('tipo', profile?.usuario_tipo || 5)
          .maybeSingle();

        setUser({
          id: data.user.id,
          email: data.user.email || '',
          name: profile?.full_name || data.user.email?.split('@')[0] || 'Usuario',
          dni: profile?.dni,
          informacion: profile?.informacion,
          usuario_tipo: profile?.usuario_tipo || 5, // Default to most restricted role
          mesa_numero: profile?.mesa_numero,
          roleDescription: userType?.descripcion || 'COLABORADOR',
        });
        
        setIsLoading(false);
        return true;
      }
    } catch (error) {
      console.error('Error during login:', error);
      setIsLoading(false);
      return false;
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const refreshUserProfile = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();

      if (!authUser) {
        return false;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, dni, informacion, usuario_tipo, mesa_numero')
        .eq('id', authUser.id)
        .single();

      const { data: userType } = await supabase
        .from('usuariost')
        .select('descripcion')
        .eq('tipo', profile?.usuario_tipo || 5)
        .maybeSingle();

      setUser({
        id: authUser.id,
        email: authUser.email || '',
        name: profile?.full_name || authUser.email?.split('@')[0] || 'Usuario',
        dni: profile?.dni,
        informacion: profile?.informacion,
        usuario_tipo: profile?.usuario_tipo || 5,
        mesa_numero: profile?.mesa_numero,
        roleDescription: userType?.descripcion || 'COLABORADOR',
      });

      return true;
    } catch (error) {
      console.error('Error refreshing user profile:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, refreshUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}