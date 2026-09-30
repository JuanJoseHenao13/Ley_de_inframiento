import React, { useMemo } from 'react';
import { useSimulationStore } from '../../store/simulationStore';
import { temperatureAtTime } from '../../engine/coolingModel';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer
} from 'recharts';

const ComparePanel = () => {
  const { T0, Tm, k, duration } = useSimulationStore();
  const kCompare = -0.065; // Fixed scenario B for demo

  const chartData = useMemo(() => {
    const data = [];
    const step = duration / 30;
    for (let t = 0; t <= duration; t += step) {
      data.push({
        t: Number(t.toFixed(2)),
        TA: Number(temperatureAtTime({ T0, Tm, k }, t).toFixed(2)),
        TB: Number(temperatureAtTime({ T0, Tm, k: kCompare }, t).toFixed(2))
      });
    }
    return data;
  }, [T0, Tm, k, duration]);

  return (
    <section className="bg-[#EDF3F9] dark:bg-slate-800 shadow-neu-card dark:shadow-none rounded-2xl p-3.5 flex flex-col justify-between h-[280px]">
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-bold text-xs text-slate-800 dark:text-white">Comparar escenarios</h3>
        <button className="px-2 py-0.5 rounded-lg text-[10px] font-bold text-slate-600 dark:text-slate-300 bg-[#EDF3F9] dark:bg-slate-700 shadow-neu-btn dark:shadow-none flex items-center gap-1 hover:text-blue-600">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><circle cx="12" cy="12" r="3"></circle></svg>
          Configurar
        </button>
      </div>
      
      <div className="flex items-center gap-3 text-[9px] font-semibold text-slate-600 dark:text-slate-400 px-1 mb-2">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span>Escenario A (Actual)</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-600"></span>Escenario B (k = -0.065)</span>
      </div>
      
      <div className="relative w-full h-[180px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" opacity={0.5} />
            <XAxis dataKey="t" tick={{ fontSize: 9 }} minTickGap={20} />
            <YAxis domain={['auto', 'auto']} tick={{ fontSize: 9 }} />
            <Line type="monotone" dataKey="TA" stroke="#EF4444" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="TB" stroke="#2563EB" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};

export default ComparePanel;
