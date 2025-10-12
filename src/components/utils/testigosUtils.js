// utils/testigosUtils.js

/**
 * Calcula el porcentaje de eficiencia de la mesa testigo
 * @param {number} pilaFaltante - Boletas que faltaron del montón
 * @param {number} votosDiferencia - Votos registrados en el período
 * @returns {number} - Porcentaje de eficiencia
 */
export const calculateTestigoPercentage = (pilaFaltante, votosDiferencia) => {
  if (!votosDiferencia || votosDiferencia <= 0) return 0;
  return (pilaFaltante / votosDiferencia) * 100;
};

/**
 * Clasifica la calidad de la muestra basada en el porcentaje
 * @param {number} percentage - Porcentaje calculado
 * @returns {object} - Clasificación con color y texto
 */
export const classifyTestigoSample = (percentage) => {
  const perc = Math.abs(percentage - 100); // Distancia del 100% ideal
  
  if (perc <= 5) {
    return {
      level: 'excellent',
      color: 'bg-green-100 text-green-800',
      label: 'Excelente',
      description: 'Muestra muy confiable (±5%)'
    };
  } else if (perc <= 15) {
    return {
      level: 'good',
      color: 'bg-blue-100 text-blue-800',
      label: 'Buena',
      description: 'Muestra confiable (±15%)'
    };
  } else if (perc <= 30) {
    return {
      level: 'acceptable',
      color: 'bg-yellow-100 text-yellow-800',
      label: 'Aceptable',
      description: 'Muestra con desviación moderada'
    };
  } else {
    return {
      level: 'poor',
      color: 'bg-red-100 text-red-800',
      label: 'Problemática',
      description: 'Muestra con alta desviación - revisar'
    };
  }
};

/**
 * Calcula estadísticas agregadas de múltiples muestras
 * @param {Array} samples - Array de muestras de testigos
 * @returns {object} - Estadísticas calculadas
 */
export const calculateAggregateStats = (samples) => {
  const validSamples = samples.filter(s => s.muestra_valida && s.votos_diferencia > 0);
  
  if (validSamples.length === 0) {
    return {
      totalSamples: samples.length,
      validSamples: 0,
      averagePercentage: 0,
      medianPercentage: 0,
      confidenceLevel: 'low',
      participationEstimate: 0
    };
  }

  // Calcular porcentajes
  const percentages = validSamples.map(s => 
    calculateTestigoPercentage(s.pila_faltante, s.votos_diferencia)
  );

  // Estadísticas básicas
  const sum = percentages.reduce((a, b) => a + b, 0);
  const average = sum / percentages.length;
  
  const sortedPercentages = [...percentages].sort((a, b) => a - b);
  const median = sortedPercentages[Math.floor(sortedPercentages.length / 2)];

  // Nivel de confianza basado en cantidad y dispersión
  const standardDeviation = Math.sqrt(
    percentages.reduce((sq, p) => sq + Math.pow(p - average, 2), 0) / percentages.length
  );

  let confidenceLevel = 'low';
  if (validSamples.length >= 10 && standardDeviation <= 20) {
    confidenceLevel = 'high';
  } else if (validSamples.length >= 5 && standardDeviation <= 35) {
    confidenceLevel = 'medium';
  }

  return {
    totalSamples: samples.length,
    validSamples: validSamples.length,
    averagePercentage: Math.round(average * 10) / 10,
    medianPercentage: Math.round(median * 10) / 10,
    standardDeviation: Math.round(standardDeviation * 10) / 10,
    confidenceLevel,
    participationEstimate: Math.round(average), // Estimación simple
    qualityDistribution: getQualityDistribution(percentages)
  };
};

/**
 * Obtiene la distribución de calidad de las muestras
 * @param {Array} percentages - Array de porcentajes
 * @returns {object} - Distribución por categoría
 */
const getQualityDistribution = (percentages) => {
  const distribution = {
    excellent: 0,
    good: 0,
    acceptable: 0,
    poor: 0
  };

  percentages.forEach(perc => {
    const classification = classifyTestigoSample(perc);
    distribution[classification.level]++;
  });

  return distribution;
};

/**
 * Genera recomendaciones basadas en las estadísticas
 * @param {object} stats - Estadísticas calculadas
 * @returns {Array} - Array de recomendaciones
 */
export const generateRecommendations = (stats) => {
  const recommendations = [];

  if (stats.validSamples < 5) {
    recommendations.push({
      type: 'warning',
      message: 'Se necesitan más muestras para obtener estimaciones confiables (mínimo 5)'
    });
  }

  if (stats.standardDeviation > 40) {
    recommendations.push({
      type: 'error',
      message: 'Alta dispersión en las muestras - revisar procedimientos de medición'
    });
  }

  if (stats.averagePercentage < 70) {
    recommendations.push({
      type: 'info',
      message: 'Las boletas se están usando menos de lo esperado - posible baja participación'
    });
  } else if (stats.averagePercentage > 130) {
    recommendations.push({
      type: 'warning',
      message: 'Se están usando más boletas de lo registrado - revisar conteo de votos'
    });
  }

  if (stats.confidenceLevel === 'high') {
    recommendations.push({
      type: 'success',
      message: 'Datos confiables para proyección de boca de urna'
    });
  }

  return recommendations;
};

/**
 * Formatea un porcentaje para mostrar
 * @param {number} percentage - Porcentaje a formatear
 * @returns {string} - Porcentaje formateado
 */
export const formatPercentage = (percentage) => {
  if (!percentage || isNaN(percentage)) return '0.0%';
  return `${percentage.toFixed(1)}%`;
};

/**
 * Valida los datos de entrada para una muestra
 * @param {object} data - Datos de la muestra
 * @returns {object} - Resultado de validación
 */
export const validateTestigoData = (data) => {
  const errors = [];
  const warnings = [];

  // Validaciones básicas
  if (!data.pila_inicio || data.pila_inicio <= 0) {
    errors.push('La pila inicial debe ser mayor a 0');
  }

  if (data.pila_retirada < 0) {
    errors.push('La pila retirada no puede ser negativa');
  }

  if (data.pila_retirada > data.pila_inicio) {
    errors.push('La pila retirada no puede ser mayor a la inicial');
  }

  // Validaciones de lógica
  const pilaFaltante = data.pila_inicio - data.pila_retirada;
  if (data.votos_diferencia && pilaFaltante > data.votos_diferencia * 2) {
    warnings.push('Las boletas faltantes son muy superiores a los votos registrados');
  }

  if (data.votos_diferencia && pilaFaltante < data.votos_diferencia * 0.5) {
    warnings.push('Las boletas faltantes son muy inferiores a los votos registrados');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    pilaFaltante
  };
};