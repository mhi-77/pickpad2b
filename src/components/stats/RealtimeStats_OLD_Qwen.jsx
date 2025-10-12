// src/components/stats/RealtimeStats.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { RefreshCw, TrendingUp, Users, CheckCircle } from 'lucide-react';

export default function RealtimeStats() {
  const [stats, setStats] = useState({ total: 0, votos: 0, porcentaje: 0 });
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    fetchStats();
    setupRealtime();
  }, []);

  const fetchStats = async () => {
    const { count: total } = await supabase
      .from('padron')
      .select('*', { count: 'exact', head: true });

    const { count: votos } = await supabase
      .from('padron')
      .select('*', { count: 'exact', head: true })
      .eq('voto_emitido', true);

    setStats({
      total,
      votos,
      porcentaje: total > 0 ? ((votos / total) * 100).toFixed(1) : 0
    });
  };

  const setupRealtime = () => {
    const channel = supabase
      .channel('realtime-stats')
      .on('postgres_changes', 
        { event: 'UPDATE', schema: 'public', table: 'padron' }, 
        (payload) => {
          if (payload.new.voto_emitido !== payload.old.voto_emitido) {
            setIsSyncing(true);
            setTimeout(() => {
              fetchStats();
              setIsSyncing(false);
            }, 1000); // Debounce
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Estadísticas en Tiempo Real</h2>
          <div className={`flex items-center space-x-2 text-sm ${isSyncing ? 'text-blue-600' : 'text-green-600'}`}>
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Actualizando...' : 'En tiempo real'}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
            <Users className="w-10 h-10 text-blue-600 mx-auto mb-3" />
            <p className="text-2xl font-bold text-blue-900">{stats.total.toLocaleString()}</p>
            <p className="text-sm text-blue-700">Total Empadronados</p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <CheckCircle className="w-10 h-10 text-green-600 mx-auto mb-3" />
            <p className="text-2xl font-bold text-green-900">{stats.votos.toLocaleString()}</p>
            <p className="text-sm text-green-700">Votos Emitidos</p>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <TrendingUp className="w-10 h-10 text-yellow-600 mx-auto mb-3" />
            <p className="text-2xl font-bold text-yellow-900">{stats.porcentaje}%</p>
            <p className="text-sm text-yellow-700">Participación</p>
          </div>
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            ✅ Este dashboard se actualiza automáticamente cuando un voto es registrado.
          </p>
        </div>
      </div>
    </div>
  );
}