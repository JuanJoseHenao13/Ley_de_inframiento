import { useMemo } from 'react';
import { useSimulationStore } from '../../store/simulationStore';
import { temperatureAtTime } from '../../engine/coolingModel';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine
} from 'recharts';

const ChartPanel = () => {
  const { T0, Tm, k, duration, currentTime: time } = useSimulationStore();

  const chartData = useMemo(() => {
    const data = [];
    const step = duration / 50;
    for (let t = 0; t <= duration; t += step) {
      data.push({
        t: Number(t.toFixed(2)),
        T: Number(temperatureAtTime({ T0, Tm, k }, t).toFixed(2))
      });
    }
    return data;
  }, [T0, Tm, k, duration]);



  return (
    <section className="bg-[#EDF3F9] dark:bg-slate-800 shadow-neu-card dark:shadow-none rounded-2xl p-3.5 flex flex-col justify-between h-[280px]">
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-bold text-xs text-slate-800 dark:text-white">Gráfica: Temperatura vs Tiempo</h3>
        <div className="flex items-center gap-2 text-[9px] font-semibold">
          <span className="flex items-center gap-1 text-red-500"><span className="w-2 h-2 rounded-full bg-red-500"></span>T(t)</span>
          <span className="flex items-center gap-1 text-blue-600"><span className="w-2 h-0.5 bg-blue-600"></span>Tm</span>
          <span className="flex items-center gap-1 text-blue-800 dark:text-blue-400"><span className="w-2 h-2 rounded-full border border-blue-600 dark:border-blue-400 bg-white dark:bg-slate-800"></span>Actual</span>
        </div>
      </div>
      
      <div className="relative w-full h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 15, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" opacity={0.5} />
            <XAxis dataKey="t" tick={{ fontSize: 10 }} minTickGap={20} />
            <YAxis domain={['auto', 'auto']} tick={{ fontSize: 10 }} />
            <Tooltip 
              contentStyle={{ borderRadius: '8px', fontSize: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <ReferenceLine y={Tm} stroke="#2563EB" strokeDasharray="4 4" />
            <ReferenceLine x={time} stroke="#2563EB" strokeDasharray="2 2" />
            <Line 
              type="monotone" 
              dataKey="T" 
              stroke="#EF4444" 
              strokeWidth={2.5} 
              dot={false}
              activeDot={{ r: 6, fill: '#FFFFFF', stroke: '#2563EB', strokeWidth: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};

export default ChartPanel;
