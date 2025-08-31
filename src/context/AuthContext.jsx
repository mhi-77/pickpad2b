import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  /**
   * Obtiene el perfil completo del usuario desde la base de datos
   * @param {Object} authUser - Usuario de Supabase Auth
   * @returns {Object|null} - Objeto de usuario completo o null si hay error
   */
  const fetchUserProfile = async (authUser) => {
    try {
      // Obtener el perfil del usuario
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, usuario_tipo, mesa_numero')
        .eq('id', authUser.id)
        .single();

      // Obtener la descripción del tipo de usuario
      const { data: userType } = await supabase
        .from('usuariost')
        .select('descripcion')
        .eq('tipo', profile?.usuario_tipo || 5)
        .maybeSingle();

      return {
        id: authUser.id,
        email: authUser.email || '',
        name: profile?.full_name || authUser.email?.split('@')[0] || 'Usuario',
        usuario_tipo: profile?.usuario_tipo || 5,
        mesa_numero: profile?.mesa_numero,
        roleDescription: userType?.descripcion || 'COLABORADOR',
      };
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  /**
   * Efecto para manejar la sesión inicial y cambios de autenticación
   * Se ejecuta al cargar la aplicación y escucha cambios en el estado de auth
   */
  useEffect(() => {
    let mounted = true;

    // Función para manejar cambios en el estado de autenticación
    const handleAuthStateChange = async (event, session) => {
      console.log('Auth state change:', event, session?.user?.email);
      
      if (event === 'SIGNED_IN' && session?.user) {
        // Usuario ha iniciado sesión - cargar perfil completo
        const userProfile = await fetchUserProfile(session.user);
        if (mounted && userProfile) {
          setUser(userProfile);
        }
      } else if (event === 'SIGNED_OUT') {
        // Usuario ha cerrado sesión - limpiar estado
        if (mounted) {
          setUser(null);
        }
      }
      
      if (mounted) {
        setIsInitializing(false);
      }
    };

    // Verificar sesión existente al cargar la aplicación
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          if (mounted) {
            setIsInitializing(false);
          }
          return;
        }

        if (session?.user) {
          // Hay una sesión activa - cargar perfil del usuario
          const userProfile = await fetchUserProfile(session.user);
          if (mounted && userProfile) {
            setUser(userProfile);
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        if (mounted) {
          setIsInitializing(false);
        }
      }
    };

    // Inicializar autenticación
    initializeAuth();

    // Escuchar cambios en el estado de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthStateChange);

    // Cleanup function
    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

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
        // El perfil del usuario se cargará automáticamente por onAuthStateChange
        // No necesitamos setUser aquí ya que se maneja en el listener
        
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

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading: isLoading || isInitializing }}>
      {isInitializing ? (
        // Mostrar pantalla de carga mientras se inicializa la autenticación
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Verificando sesión...</p>
          </div>
        </div>
      ) : (
        children
      )}
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