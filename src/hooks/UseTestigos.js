// hooks/useTestigos.js
import { useState, useEffect, useCallback, useReducer } from 'react';
import { supabase } from '../lib/supabase';

// Reducer para manejo de estado complejo
const testigosReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'SET_RECORDS':
      return { ...state, records: action.payload, isLoading: false, error: '' };
    case 'UPDATE_RECORD':
      return {
        ...state,
        records: state.records.map(record =>
          record.id === action.payload.id ? { ...record, ...action.payload.updates } : record
        )
      };
    case 'ADD_RECORD':
      return { ...state, records: [action.payload, ...state.records] };
    case 'SET_MEASURING':
      return { ...state, isMeasuring: action.payload.status, currentTestigoId: action.payload.id };
    case 'RESET_MEASURING':
      return { ...state, isMeasuring: false, currentTestigoId: null };
    default:
      return state;
  }
};

const initialState = {
  records: [],
  isLoading: false,
  error: '',
  isMeasuring: false,
  currentTestigoId: null
};

/**
 * Hook personalizado para manejo completo de Mesa Testigo
 * @param {number} mesaNumero - Número de mesa
 * @param {string} userId - ID del usuario
 * @returns {object} - Objeto con estados y funciones
 */
export const useTestigos = (mesaNumero, userId) => {
  const [state, dispatch] = useReducer(testigosReducer, initialState);
  
  // Estados adicionales para el control activo
  const [startTime, setStartTime] = useState('');
  const [votosInicio, setVotosInicio] = useState(0);

  /**
   * Obtiene el conteo actual de votos emitidos
   */
  const fetchCurrentVoteCount = useCallback(async () => {
    if (!mesaNumero) return 0;

    try {
      const { count, error } = await supabase
        .from('padron')
        .select('documento', { count: 'exact', head: true })
        .eq('mesa_numero', mesaNumero)
        .eq('voto_emitido', true);

      if (error) {
        console.error('Error fetching vote count:', error);
        return 0;
      }

      return count || 0;
    } catch (error) {
      console.error('Error:', error);
      return 0;
    }
  }, [mesaNumero]);

  /**
   * Carga todos los registros de testigos de la mesa
   */
  const fetchTestigosRecords = useCallback(async () => {
    if (!mesaNumero) return;

    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const { data, error } = await supabase
        .from('testigos')
        .select(`
          *,
          profiles!testigos_user_id_fkey(
            full_name
          )
        `)
        .eq('mesa_numero', mesaNumero)
        .order('user_at', { ascending: false });

      if (error) {
        console.error('Error fetching testigos records:', error);
        dispatch({ type: 'SET_ERROR', payload: 'Error al cargar registros de testigos' });
        return;
      }

      dispatch({ type: 'SET_RECORDS', payload: data || [] });

      // Verificar si hay una medición en curso (registro sin finalizar)
      const activeRecord = data?.find(record => 
        record.user_id === userId && 
        record.pila_faltante === null && 
        record.votos_diferencia === null
      );

      if (activeRecord) {
        dispatch({ 
          type: 'SET_MEASURING', 
          payload: { status: true, id: activeRecord.id } 
        });
        setVotosInicio(activeRecord.votos_inicio || 0);
        setStartTime(new Date(activeRecord.user_at).toLocaleTimeString('es-AR', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }));
      }

    } catch (error) {
      console.error('Error:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Error al cargar registros de testigos' });
    }
  }, [mesaNumero, userId]);

  /**
   * Inicia una nueva medición de mesa testigo
   */
  const startMeasurement = useCallback(async (pilaInicio) => {
    if (!mesaNumero || !userId || !pilaInicio || pilaInicio <= 0) {
      throw new Error('Datos insuficientes para iniciar la medición');
    }

    // Verificar que no haya otra medición activa
    if (state.isMeasuring) {
      throw new Error('Ya hay una medición en curso');
    }

    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      // 1. Obtener conteo actual de votos
      const currentVotes = await fetchCurrentVoteCount();
      
      // 2. Crear registro inicial
      const timestamp = new Date().toISOString();
      const { data, error } = await supabase
        .from('testigos')
        .insert({
          mesa_numero: mesaNumero,
          pila_inicio: parseInt(pilaInicio),
          votos_inicio: currentVotes,
          user_id: userId,
          user_at: timestamp
        })
        .select(`
          *,
          profiles!testigos_user_id_fkey(
            full_name
          )
        `)
        .single();

      if (error) {
        console.error('Error creating testigo record:', error);
        throw new Error('Error al crear el registro de testigo');
      }

      // 3. Actualizar estados
      dispatch({ type: 'ADD_RECORD', payload: data });
      dispatch({ 
        type: 'SET_MEASURING', 
        payload: { status: true, id: data.id } 
      });
      
      setVotosInicio(currentVotes);
      setStartTime(new Date().toLocaleTimeString('es-AR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }));

      dispatch({ type: 'SET_LOADING', payload: false });

      return {
        success: true,
        testigoId: data.id,
        votosInicio: currentVotes,
        mensaje: 'Medición iniciada correctamente'
      };

    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  }, [mesaNumero, userId, state.isMeasuring, fetchCurrentVoteCount]);

  /**
   * Finaliza la medición activa
   */
  const finalizeMeasurement = useCallback(async (pilaInicio, pilaRetirada) => {
    if (!state.currentTestigoId || !pilaInicio || pilaRetirada < 0) {
      throw new Error('Datos insuficientes para finalizar la medición');
    }

    if (parseInt(pilaRetirada) > parseInt(pilaInicio)) {
      throw new Error('La pila retirada no puede ser mayor a la inicial');
    }

    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      // 1. Obtener conteo actual de votos
      const currentVotes = await fetchCurrentVoteCount();
      
      // 2. Calcular diferencias
      const votos_diferencia = currentVotes - votosInicio;
      const pila_faltante = parseInt(pilaInicio) - parseInt(pilaRetirada);

      // Validación de lógica de negocio
      if (votos_diferencia < 0) {
        throw new Error('Error: el conteo de votos ha disminuido');
      }

      // 3. Actualizar registro
      const { error } = await supabase
        .from('testigos')
        .update({
          pila_faltante: pila_faltante,
          votos_diferencia: votos_diferencia,
          muestra_valida: true // Por defecto válida
        })
        .eq('id', state.currentTestigoId);

      if (error) {
        console.error('Error updating testigo record:', error);
        throw new Error('Error al finalizar el registro');
      }

      // 4. Actualizar estado local
      dispatch({
        type: 'UPDATE_RECORD',
        payload: {
          id: state.currentTestigoId,
          updates: {
            pila_faltante,
            votos_diferencia,
            muestra_valida: true
          }
        }
      });

      // 5. Resetear medición
      dispatch({ type: 'RESET_MEASURING' });
      setStartTime('');
      setVotosInicio(0);

      dispatch({ type: 'SET_LOADING', payload: false });

      // Calcular porcentaje para el resultado
      const porcentaje = votos_diferencia > 0 ? (pila_faltante / votos_diferencia) * 100 : 0;

      return {
        success: true,
        results: {
          pila_faltante,
          votos_diferencia,
          porcentaje: Math.round(porcentaje * 10) / 10,
          votosFinales: currentVotes
        },
        mensaje: 'Medición finalizada correctamente'
      };

    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  }, [state.currentTestigoId, votosInicio, fetchCurrentVoteCount]);

  /**
   * Cambia el estado de validez de una muestra
   */
  const toggleSampleValidity = useCallback(async (testigoId, isValid) => {
    try {
      const { error } = await supabase
        .from('testigos')
        .update({ muestra_valida: isValid })
        .eq('id', testigoId);

      if (error) {
        console.error('Error updating muestra_valida:', error);
        throw new Error('Error al actualizar el estado de la muestra');
      }

      dispatch({
        type: 'UPDATE_RECORD',
        payload: {
          id: testigoId,
          updates: { muestra_valida: isValid }
        }
      });

      return {
        success: true,
        mensaje: `Muestra marcada como ${isValid ? 'válida' : 'inválida'}`
      };

    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  }, []);

  /**
   * Cancela una medición en curso
   */
  const cancelMeasurement = useCallback(async () => {
    if (!state.currentTestigoId) {
      throw new Error('No hay medición activa para cancelar');
    }

    try {
      // Eliminar el registro incompleto
      const { error } = await supabase
        .from('testigos')
        .delete()
        .eq('id', state.currentTestigoId);

      if (error) {
        console.error('Error deleting testigo record:', error);
        throw new Error('Error al cancelar la medición');
      }

      // Recargar registros
      await fetchTestigosRecords();
      
      // Resetear estados
      dispatch({ type: 'RESET_MEASURING' });
      setStartTime('');
      setVotosInicio(0);

      return {
        success: true,
        mensaje: 'Medición cancelada'
      };

    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  }, [state.currentTestigoId, fetchTestigosRecords]);

  /**
   * Obtiene estadísticas de las muestras
   */
  const getStatistics = useCallback(() => {
    const validSamples = state.records.filter(r => r.muestra_valida && r.votos_diferencia > 0);
    
    if (validSamples.length === 0) {
      return {
        totalSamples: state.records.length,
        validSamples: 0,
        averageEfficiency: 0,
        medianEfficiency: 0,
        confidenceLevel: 'bajo'
      };
    }

    const percentages = validSamples.map(s => 
      (s.pila_faltante / s.votos_diferencia) * 100
    );

    const sum = percentages.reduce((a, b) => a + b, 0);
    const average = sum / percentages.length;
    
    const sortedPercentages = [...percentages].sort((a, b) => a - b);
    const median = sortedPercentages[Math.floor(sortedPercentages.length / 2)];

    const variance = percentages.reduce((sq, p) => sq + Math.pow(p - average, 2), 0) / percentages.length;
    const standardDeviation = Math.sqrt(variance);

    let confidenceLevel = 'bajo';
    if (validSamples.length >= 10 && standardDeviation <= 20) {
      confidenceLevel = 'alto';
    } else if (validSamples.length >= 5 && standardDeviation <= 35) {
      confidenceLevel = 'medio';
    }

    return {
      totalSamples: state.records.length,
      validSamples: validSamples.length,
      averageEfficiency: Math.round(average * 10) / 10,
      medianEfficiency: Math.round(median * 10) / 10,
      standardDeviation: Math.round(standardDeviation * 10) / 10,
      confidenceLevel
    };
  }, [state.records]);

  /**
   * Limpia errores
   */
  const clearError = useCallback(() => {
    dispatch({ type: 'SET_ERROR', payload: '' });
  }, []);

  // Cargar registros al montar o cambiar mesa
  useEffect(() => {
    if (mesaNumero) {
      fetchTestigosRecords();
    }
  }, [fetchTestigosRecords, mesaNumero]);

  // Retornar API completa del hook
  return {
    // Estados
    records: state.records,
    isLoading: state.isLoading,
    error: state.error,
    isMeasuring: state.isMeasuring,
    currentTestigoId: state.currentTestigoId,
    startTime,
    votosInicio,

    // Funciones principales
    startMeasurement,
    finalizeMeasurement,
    cancelMeasurement,
    toggleSampleValidity,

    // Funciones de utilidad
    fetchCurrentVoteCount,
    fetchTestigosRecords,
    getStatistics,
    clearError,

    // Funciones de validación
    validateMeasurementData: (pilaInicio, pilaRetirada) => {
      const errors = [];
      
      if (!pilaInicio || pilaInicio <= 0) {
        errors.push('La pila inicial debe ser mayor a 0');
      }
      
      if (pilaRetirada < 0) {
        errors.push('La pila retirada no puede ser negativa');
      }
      
      if (parseInt(pilaRetirada) > parseInt(pilaInicio)) {
        errors.push('La pila retirada no puede ser mayor a la inicial');
      }

      return {
        isValid: errors.length === 0,
        errors,
        pilaFaltante: parseInt(pilaInicio || 0) - parseInt(pilaRetirada || 0)
      };
    }
  };
};