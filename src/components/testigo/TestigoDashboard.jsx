import React, { useState, useEffect, useMemo } from 'react';
import { BarChart3, TrendingUp, AlertTriangle, CheckCircle, Users, Percent, Target, Activity } from 'lucide-react';

// Mock data para demostración
const mockTestigosData = [
  { id: 1, mesa_numero: 1234, pila_inicio: 20, pila_faltante: 18, votos_diferencia: 20, muestra_valida: true, localidad: 'Centro' },
  { id: 2, mesa_numero: 1235, pila_inicio: 25, pila_faltante: 22, votos_diferencia: 25, muestra_valida: true, localidad: 'Centro' },
  { id: 3, mesa_numero: 1236, pila_inicio: 30, pila_faltante: 25, votos_diferencia: 28, muestra_valida: true, localidad: 'Norte' },
  { id: 4, mesa_numero: 1237, pila_inicio: 15, pila_faltante: 12, votos_diferencia: 15, muestra_valida: false, localidad: 'Sur' },
  { id: 5, mesa_numero: 1238, pila_inicio: 35, pila_faltante: 30, votos_diferencia: 32, muestra_valida: true, localidad: 'Norte' },
];

// Utilidades (normalmente importadas)
const calculateTestigoPercentage = (pilaFaltante, votosDiferencia) => {
  if (!votosDiferencia || votosDiferencia <= 0) return 0;
  return (pilaFaltante / votosDiferencia) * 100;
};

const classifyTestigoSample = (percentage) => {
  const perc = Math.abs(percentage - 100);
  
  if (perc <= 5) {
    return {
      level: 'excellent',
      color: 'bg-green-100 text-green-800 border-green-200',
      label: 'Excelente',
      icon: CheckCircle
    };
  } else if (perc <= 15) {
    return {
      level: 'good',
      color: 'bg-blue-100 text-blue-800 border-blue-200',
      label: 'Buena',
      icon: TrendingUp
    };
  } else if (perc <= 30) {
    return {
      level: 'acceptable',
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      label: 'Aceptable',
      icon: Activity
    };
  } else {
    return {
      level: 'poor',
      color: 'bg-red-100 text-red-800 border-red-200',
      label: 'Problemática',
      icon: AlertTriangle
    };
  }
};

export default function TestigoDashboard() {
  const [selectedLocalidad, setSelectedLocalidad] = useState('todas');
  const [selectedPeriod, setSelectedPeriod] = useState('hoy');

  // Filtrar y procesar datos
  const filteredData = useMemo(() => {
    let filtered = mockTestigosData.filter(item => item.muestra_valida);
    
    if (selectedLocalidad !== 'todas') {
      filtered = filtered.filter(item => item.localidad === selectedLocalidad);
    }
    
    return filtered;
  }, [selectedLocalidad]);

  // Calcular estadísticas principales
  const stats = useMemo(() => {
    if (filteredData.length === 0) {
      return {
        totalMuestras: 0,
        promedioEficiencia: 0,
        medianaEficiencia: 0,
        desviacionEstandar: 0,
        nivelConfianza: 'bajo',
        distribucion: { excellent: 0, good: 0, acceptable: 0, poor: 0 }
      };
    }

    const percentages = filteredData.map(item => 
      calculateTestigoPercentage(item.pila_faltante, item.votos_diferencia)
    );

    const sum = percentages.reduce((a, b) => a + b, 0);
    const promedio = sum / percentages.length;
    
    const sortedPercentages = [...percentages].sort((a, b) => a - b);
    const mediana = sortedPercentages[Math.floor(sortedPercentages.length / 2)];

    const varianza = percentages.reduce((sq, p) => sq + Math.pow(p - promedio, 2), 0) / percentages.length;
    const desviacionEstandar = Math.sqrt(varianza);

    // Calcular distribución de calidad
    const distribucion = { excellent: 0, good: 0, acceptable: 0, poor: 0 };
    percentages.forEach(perc => {
      const classification = classifyTestigoSample(perc);
      distribucion[classification.level]++;
    });

    // Nivel de confianza
    let nivelConfianza = 'bajo';
    if (filteredData.length >= 10 && desviacionEstandar <= 20) {
      nivelConfianza = 'alto';
    } else if (filteredData.length >= 5 && desviacionEstandar <= 35) {
      nivelConfianza = 'medio';
    }

    return {
      totalMuestras: filteredData.length,
      promedioEficiencia: Math.round(promedio * 10) / 10,
      medianaEficiencia: Math.round(mediana * 10) / 10,
      desviacionEstandar: Math.round(desviacionEstandar * 10) / 10,
      nivelConfianza,
      distribucion
    };
  }, [filteredData]);

  // Obtener localidades únicas
  const localidades = useMemo(() => {
    const unique = [...new Set(mockTestigosData.map(item => item.localidad))];
    return unique.sort();
  }, []);

  // Generar recomendaciones
  const recomendaciones = useMemo(() => {
    const recs = [];

    if (stats.totalMuestras < 5) {
      recs.push({
        type: 'warning',
        icon: AlertTriangle,
        message: 'Se necesitan más muestras para estimaciones confiables (mínimo 5)',
        color: 'text-yellow-600'
      });
    }

    if (stats.desviacionEstandar > 40) {
      recs.push({
        type: 'error',
        icon: AlertTriangle,
        message: 'Alta dispersión en muestras - revisar procedimientos',
        color: 'text-red-600'
      });
    }

    if (stats.promedioEficiencia < 70) {
      recs.push({
        type: 'info',
        icon: TrendingUp,
        message: 'Baja utilización de boletas - posible baja participación',
        color: 'text-blue-600'
      });
    } else if (stats.promedioEficiencia > 130) {
      recs.push({
        type: 'warning',
        icon: AlertTriangle,
        message: 'Sobre-utilización de boletas - revisar conteo de votos',
        color: 'text-yellow-600'
      });
    }

    if (stats.nivelConfianza === 'alto') {
      recs.push({
        type: 'success',
        icon: CheckCircle,
        message: 'Datos confiables para proyección electoral',
        color: 'text-green-600'
      });
    }

    return recs;
  }, [stats]);

  return (
    <div className="space-y-6">
      {/* Header y controles */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Dashboard Mesa Testigo</h2>
            <p className="text-gray-600 mt-1">Análisis estadístico y boca de urna</p>
          </div>
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">Análisis Electoral</span>
          </div>
        </div>

        {/* Filtros */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Localidad
            </label>
            <select
              value={selectedLocalidad}
              onChange={(e) => setSelectedLocalidad(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="todas">Todas las localidades</option>
              {localidades.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Período
            </label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="hoy">Hoy</option>
              <option value="semana">Última semana</option>
              <option value="mes">Último mes</option>
            </select>
          </div>
        </div>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.totalMuestras}</p>
              <p className="text-sm text-gray-600">Muestras Válidas</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Percent className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.promedioEficiencia}%</p>
              <p className="text-sm text-gray-600">Eficiencia Promedio</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.medianaEficiencia}%</p>
              <p className="text-sm text-gray-600">Mediana</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              stats.nivelConfianza === 'alto' ? 'bg-green-100' :
              stats.nivelConfianza === 'medio' ? 'bg-yellow-100' : 'bg-red-100'
            }`}>
              <Activity className={`w-6 h-6 ${
                stats.nivelConfianza === 'alto' ? 'text-green-600' :
                stats.nivelConfianza === 'medio' ? 'text-yellow-600' : 'text-red-600'
              }`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 capitalize">{stats.nivelConfianza}</p>
              <p className="text-sm text-gray-600">Confianza</p>
            </div>
          </div>
        </div>
      </div>

      {/* Distribución de calidad */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Distribución de Calidad</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(stats.distribucion).map(([level, count]) => {
            const classification = classifyTestigoSample(level === 'excellent' ? 100 : level === 'good' ? 110 : level === 'acceptable' ? 125 : 150);
            const Icon = classification.icon;
            
            return (
              <div key={level} className={`border rounded-lg p-4 ${classification.color}`}>
                <div className="flex items-center justify-between mb-2">
                  <Icon className="w-5 h-5" />
                  <span className="font-bold text-lg">{count}</span>
                </div>
                <p className="text-sm font-medium">{classification.label}</p>
                <p className="text-xs opacity-75">
                  {stats.totalMuestras > 0 ? Math.round((count / stats.totalMuestras) * 100) : 0}%
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recomendaciones */}
      {recomendaciones.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Recomendaciones</h3>
          
          <div className="space-y-3">
            {recomendaciones.map((rec, index) => {
              const Icon = rec.icon;
              return (
                <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Icon className={`w-5 h-5 mt-0.5 ${rec.color}`} />
                  <p className="text-sm text-gray-700">{rec.message}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Detalle de muestras */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          Detalle de Muestras ({filteredData.length})
        </h3>
        
        {filteredData.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <BarChart3 className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No hay muestras válidas para mostrar</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mesa</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Localidad</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Inicial</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Faltante</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Votos</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Eficiencia</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Calidad</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredData.map((item) => {
                  const percentage = calculateTestigoPercentage(item.pila_faltante, item.votos_diferencia);
                  const classification = classifyTestigoSample(percentage);
                  
                  return (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        Mesa {item.mesa_numero}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.localidad}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.pila_inicio}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.pila_faltante}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.votos_diferencia}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className="font-medium">
                          {percentage.toFixed(1)}%
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${classification.color}`}>
                          {classification.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Información técnica */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-3">ℹ️ Cómo interpretar los datos</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-700">
          <div>
            <h5 className="font-medium text-gray-900 mb-2">Eficiencia:</h5>
            <ul className="space-y-1 list-disc list-inside">
              <li>100% = Relación perfecta (1 boleta = 1 voto)</li>
              <li>90-110% = Rango normal esperado</li>
              <li>&lt;90% = Posible baja participación</li>
              <li>&gt;110% = Revisar conteo o procedimientos</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium text-gray-900 mb-2">Calidad de Muestra:</h5>
            <ul className="space-y-1 list-disc list-inside">
              <li><strong>Excelente:</strong> ±5% de desviación</li>
              <li><strong>Buena:</strong> ±15% de desviación</li>
              <li><strong>Aceptable:</strong> ±30% de desviación</li>
              <li><strong>Problemática:</strong> &gt;30% de desviación</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}