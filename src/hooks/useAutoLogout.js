import { useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
export function useAutoLogout({ 
  timeoutMinutes = 2, // Tiempo total de inactividad antes del logout
  warningMinutes = 1, // Tiempo de advertencia antes del logout
  onWarning 
} = {}) {
  const { logout, user } = useAuth();
  const timeoutRef = useRef();
  const warningTimeoutRef = useRef();
  const lastActivityRef = useRef(Date.now());
  const resetTimer = () => {
    if (!user) return;
    lastActivityRef.current = Date.now();
    // Limpiar timers existentes
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current);
    }
    // Timer para mostrar advertencia
    const warningTime = (timeoutMinutes - warningMinutes) * 60 * 1000;
    if (warningTime > 0 && onWarning) {
      warningTimeoutRef.current = setTimeout(() => {
        onWarning();
        
        // Limpiar el timeout original y establecer uno nuevo para el logout
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        
        // Nuevo timeout que ejecutará logout después del tiempo de advertencia
        timeoutRef.current = setTimeout(() => {
          logout();
        }, warningMinutes * 60 * 1000);
      }, warningTime);
    }

    // Timer para logout automático (solo si no hay advertencia)
    if (warningTime <= 0 || !onWarning) {
      timeoutRef.current = setTimeout(() => {
        logout();
      }, timeoutMinutes * 60 * 1000);
    }
  };
  useEffect(() => {
    if (!user) return;
    // Eventos que resetean el timer
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];

    const handleActivity = () => {
      resetTimer();
    };
    // Agregar listeners
    events.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });
    // Inicializar timer
    resetTimer();
    // Cleanup
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (warningTimeoutRef.current) {
        clearTimeout(warningTimeoutRef.current);
      }
    };
  }, [user, timeoutMinutes, warningMinutes, logout, onWarning]);
  return {
    resetTimer,
    warningMinutes,
    getLastActivity: () => lastActivityRef.current,
    getRemainingTime: () => {
      const elapsed = Date.now() - lastActivityRef.current;
      const remaining = (timeoutMinutes * 60 * 1000) - elapsed;
      return Math.max(0, remaining);
    }
  };
}