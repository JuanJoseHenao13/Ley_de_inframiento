import React from 'react';
import { useSimulationStore } from '../../store/simulationStore';
import { temperatureAtTime } from '../../engine/coolingModel';

const MathModelPanel = () => {
  const { T0, Tm, k, currentTime: time } = useSimulationStore();
  const currentTemp = temperatureAtTime({ T0, Tm, k }, time);

  const amp = (T0 - Tm);
  const signTm = Tm >= 0 ? `+ ${Tm}` : `- ${Math.abs(Tm)}`;

  return (
    <section className="bg-[#EDF3F9] dark:bg-slate-800 shadow-neu-card dark:shadow-none rounded-2xl p-3.5 flex flex-col justify-between h-[280px]">
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <h3 className="font-bold text-xs text-slate-800 dark:text-white">Modelo matemático</h3>
          <button className="text-slate-400 hover:text-slate-600">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path></svg>
          </button>
        </div>
        <div className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
          <div>
            <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 block">Ley de Enfriamiento de Newton</span>
            <p className="font-serif italic font-bold tracking-wide text-slate-800 dark:text-white text-sm">
              <span className="not-italic">dT</span>/<span className="not-italic">dt</span> = k(T - T<sub>m</sub>)
            </p>
          </div>
          <div>
            <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 block">Solución analítica:</span>
            <p className="font-serif italic font-bold text-slate-800 dark:text-white text-xs">
              T(t) = (T<sub>0</sub> - T<sub>m</sub>)e<sup>kt</sup> + T<sub>m</sub>
            </p>
          </div>
          <div className="border-t border-slate-300 dark:border-slate-700 pt-1">
            <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 block">Con los valores actuales:</span>
            <p className="font-serif text-[11px] font-semibold text-slate-700 dark:text-slate-300">
              T(t) = ({T0} - {Tm})e<sup>{k}t</sup> {signTm}
            </p>
            <p className="font-serif text-[11px] font-bold text-blue-600 dark:text-blue-400">
              T(t) = {amp}e<sup>{k}t</sup> {signTm}
            </p>
          </div>
        </div>
      </div>
      
      {/* Instanced calculation pill */}
      <div className="bg-[#E1EAF4] dark:bg-slate-900 shadow-neu-pressed dark:shadow-none p-2 rounded-xl text-center">
        <span className="text-[10px] text-slate-500 font-semibold block">Para el tiempo seleccionado (t = {time.toFixed(2)}):</span>
        <div className="font-serif text-xs font-semibold text-slate-700 dark:text-slate-300">
          T({time.toFixed(2)}) = {amp}e<sup>{k}({time.toFixed(2)})</sup> {signTm}
        </div>
        <div className="text-sm font-extrabold text-blue-600 dark:text-blue-400 mt-0.5">
          T({time.toFixed(2)}) = {currentTemp.toFixed(1)} °C
        </div>
      </div>
    </section>
  );
};

export default MathModelPanel;
