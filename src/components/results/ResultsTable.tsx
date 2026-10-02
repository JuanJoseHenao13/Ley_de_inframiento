import { useMemo } from 'react';
import { useSimulationStore } from '../../store/simulationStore';
import { temperatureAtTime } from '../../engine/coolingModel';

const ResultsTable = () => {
  const { T0, Tm, k, duration, measurementInterval: interval, currentTime: time } = useSimulationStore();

  const tableData = useMemo(() => {
    const data = [];
    let prevT = T0;
    
    for (let t = 0; t <= duration; t += interval) {
      const curTemp = temperatureAtTime({ T0, Tm, k }, t);
      const deltaTm = curTemp - Tm;
      const rate = t === 0 ? '-' : ((curTemp - prevT) / interval).toFixed(2);
      prevT = curTemp;
      
      const isCurrentActive = Math.abs(time - t) < interval * 0.55;

      data.push({ t, curTemp, deltaTm, rate, isCurrentActive });
    }
    return data;
  }, [T0, Tm, k, duration, interval, time]);

  return (
    <section className="bg-[#EDF3F9] dark:bg-slate-800 shadow-neu-card dark:shadow-none rounded-2xl p-3.5 flex flex-col h-[280px]">
      <h3 className="font-bold text-xs text-slate-800 dark:text-white mb-2">Tabla de resultados</h3>
      <div className="overflow-y-auto custom-scrollbar flex-1 rounded-xl bg-[#E5ECF4] dark:bg-slate-900 shadow-neu-pressed dark:shadow-none p-1">
        <table className="w-full text-[10px] text-center">
          <thead className="sticky top-0 bg-[#DCE5EF] dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold border-b border-slate-300 dark:border-slate-700 shadow-sm">
            <tr>
              <th className="py-1 px-1">Tiempo<br/><span className="font-normal">(min)</span></th>
              <th className="py-1 px-1">T(t)<br/><span className="font-normal">(°C)</span></th>
              <th className="py-1 px-1">T(t)-Tm<br/><span className="font-normal">(°C)</span></th>
              <th className="py-1 px-1">ΔT/Δt<br/><span className="font-normal">(°C/min)</span></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700 font-medium text-slate-700 dark:text-slate-300">
            {tableData.map((row) => (
              <tr key={row.t} className={row.isCurrentActive ? 'bg-blue-100/90 dark:bg-blue-900/50 text-blue-900 dark:text-blue-200 font-bold' : 'hover:bg-slate-100/70 dark:hover:bg-slate-800/70 transition-colors'}>
                <td className="py-1 px-1 font-semibold">{row.t}</td>
                <td className="py-1 px-1">{row.curTemp.toFixed(2)}</td>
                <td className="py-1 px-1">{row.deltaTm.toFixed(2)}</td>
                <td className={`py-1 px-1 ${row.rate !== '-' && parseFloat(row.rate as string) < 0 ? 'text-blue-600 dark:text-blue-400' : ''}`}>{row.rate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default ResultsTable;
