import { useState } from 'react';
import { useSimulationStore } from '../../store/simulationStore';
import { temperatureAtTime, timeToTarget } from '../../engine/coolingModel';

const StatePanel = () => {
  const { T0, Tm, k, currentTime: time, duration, setCurrentTime: setTime, setDuration } = useSimulationStore();
  const [targetTemp, setTargetTemp] = useState<number>(40);
  const [estimatedTime, setEstimatedTime] = useState<number | null>(null);

  const currentTemp = temperatureAtTime({ T0, Tm, k }, time);
  const deltaT = currentTemp - Tm;
  const thermoPercent = Math.max(0, Math.min(100, (currentTemp / 100) * 100));

  const handleCalculate = () => {
    const t = timeToTarget({ T0, Tm, k }, targetTemp);
    setEstimatedTime(t);
  };

  const handleGotoTarget = () => {
    if (estimatedTime !== null && !isNaN(estimatedTime)) {
      if (estimatedTime > duration) setDuration(Math.ceil(estimatedTime + 10));
      setTime(parseFloat(estimatedTime.toFixed(2)));
    }
  };

  let physicsText = "La diferencia térmica entre el objeto y el ambiente está disminuyendo, por lo que la velocidad de enfriamiento también disminuye. La temperatura se aproxima progresivamente a la ambiental de manera exponencial.";
  if (Math.abs(deltaT) < 0.2) {
    physicsText = "El sistema ha alcanzado el equilibrio térmico con el ambiente. La tasa de transferencia de calor es prácticamente nula (dT/dt ≈ 0).";
  } else if (time < 5) {
    physicsText = `Gradiente térmico inicial elevado (${Math.abs(deltaT).toFixed(1)} °C). La velocidad de pérdida de calor es máxima debido a la gran diferencia respecto al medio.`;
  }

  return (
    <section className="lg:col-span-3 flex flex-col gap-3">
      {/* Main system card */}
      <div className="bg-[#EDF3F9] dark:bg-slate-800 shadow-neu-card dark:shadow-none rounded-2xl p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-slate-800 dark:text-white text-sm">Estado actual del sistema</h2>
          <button className="text-slate-400 hover:text-slate-600 p-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><circle cx="5" cy="10" r="1.5"></circle><circle cx="10" cy="10" r="1.5"></circle><circle cx="15" cy="10" r="1.5"></circle></svg>
          </button>
        </div>
        
        {/* Live Digital Gauge + Realistic Vertical Thermometer */}
        <div className="flex items-center justify-between gap-2 px-1">
          <div>
            <div className="text-4xl font-extrabold tracking-tight text-slate-800 dark:text-white">{currentTemp.toFixed(1)} °C</div>
            <div className="text-xs font-semibold text-slate-500 mt-0.5">Temperatura actual</div>
          </div>
          
          {/* Neumorphic Thermometer with dynamic liquid meniscus */}
          <div className="relative flex items-center gap-1.5 pr-2">
            <div className="flex flex-col justify-between h-36 text-[9px] font-bold text-slate-500 py-1 text-right">
              <span>100</span><span>80</span><span>60</span><span>40</span><span>20</span><span>0</span>
            </div>
            <div className="relative flex flex-col items-center">
              <div className="w-4 h-32 bg-[#E1EAF3] dark:bg-slate-700 shadow-neu-pressed dark:shadow-none rounded-t-full p-0.5 flex flex-col justify-end overflow-hidden relative border border-slate-300/40 dark:border-slate-600">
                <div 
                  className="w-full bg-gradient-to-t from-red-600 via-rose-500 to-amber-400 rounded-t-sm transition-all duration-150" 
                  style={{ height: `${thermoPercent}%` }}
                ></div>
                <div className="absolute inset-y-1 left-0.5 w-1 bg-white/50 rounded-full pointer-events-none"></div>
              </div>
              <div className="w-8 h-8 rounded-full bg-red-600 -mt-2 shadow-md relative border-2 border-[#EDF3F9] dark:border-slate-800 flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-white/60 absolute top-1.5 left-1.5"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Parameter Summary List */}
        <div className="bg-[#E5ECF4] dark:bg-slate-900 shadow-neu-pressed dark:shadow-none p-2.5 rounded-xl flex flex-col gap-1.5 text-xs">
          <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
            <span>Temperatura inicial (<i>T</i><sub>0</sub>)</span>
            <span className="font-bold text-slate-800 dark:text-white">{T0.toFixed(1)} °C</span>
          </div>
          <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
            <span>Temperatura ambiente (<i>T</i><sub>m</sub>)</span>
            <span className="font-bold text-slate-800 dark:text-white">{Tm.toFixed(1)} °C</span>
          </div>
          <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
            <span>Constante de enf. (<i>k</i>)</span>
            <span className="font-bold text-slate-800 dark:text-white">{k.toFixed(3)}</span>
          </div>
          <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
            <span>Tiempo simulado</span>
            <span className="font-bold text-slate-800 dark:text-white">{time.toFixed(2)} min</span>
          </div>
          <div className="flex justify-between items-center text-slate-600 dark:text-slate-400 border-t border-slate-300/70 dark:border-slate-700 pt-1 mt-0.5">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Diferencia térmica (Δ<i>T</i>)</span>
            <span className="font-extrabold text-blue-600 dark:text-blue-400">{Math.abs(deltaT).toFixed(1)} °C</span>
          </div>
        </div>

        {/* Physics Explanation Card */}
        <div className="bg-[#EDF3F9] dark:bg-slate-700 shadow-neu-flat dark:shadow-none rounded-xl p-3 flex items-start gap-2.5">
          <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path></svg>
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800 dark:text-white">Explicación física</h4>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed mt-0.5">{physicsText}</p>
          </div>
        </div>
      </div>

      {/* Target Solver Card */}
      <div className="bg-[#EDF3F9] dark:bg-slate-800 shadow-neu-card dark:shadow-none rounded-2xl p-3.5 flex flex-col gap-2.5">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <span>Calcular tiempo objetivo</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <label className="text-[10px] text-slate-500 font-medium block">Temp. (°C)</label>
            <input 
              className="w-full mt-1 bg-[#E5ECF4] dark:bg-slate-900 shadow-neu-pressed dark:shadow-none border-none rounded-xl text-xs font-bold text-slate-800 dark:text-white px-3 py-1.5 focus:ring-2 focus:ring-blue-500" 
              type="number" step="0.5" 
              value={targetTemp} 
              onChange={(e) => setTargetTemp(Number(e.target.value))} 
            />
          </div>
          <button 
            onClick={handleCalculate}
            className="self-end px-3.5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-neu-accent transition-all"
          >
            Calcular
          </button>
        </div>
        <div className="flex items-center justify-between bg-[#E5ECF4] dark:bg-slate-900 shadow-neu-pressed dark:shadow-none px-3 py-2 rounded-xl text-xs mt-1">
          <div>
            <span className="text-[10px] text-slate-500 block">Tiempo estimado:</span>
            <span className="font-extrabold text-slate-800 dark:text-white text-sm">
              {estimatedTime === null || isNaN(estimatedTime) ? 'Inalcanzable' : `${estimatedTime.toFixed(2)} min`}
            </span>
          </div>
          <button 
            disabled={estimatedTime === null || isNaN(estimatedTime)}
            onClick={handleGotoTarget}
            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#EDF3F9] dark:bg-slate-700 shadow-neu-btn dark:shadow-none text-blue-600 hover:bg-white dark:hover:bg-slate-600 transition-all disabled:opacity-40"
          >
            Ir a momento
          </button>
        </div>
      </div>
    </section>
  );
};

export default StatePanel;
