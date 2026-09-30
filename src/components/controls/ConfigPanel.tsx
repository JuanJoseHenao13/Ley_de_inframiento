import React from 'react';
import { useSimulationStore } from '../../store/simulationStore';
import type { ObjectType, Environment } from '../../store/simulationStore';

const ConfigPanel = () => {
  const { 
    objectType, setObjectType, 
    environment, setEnvironment,
    T0, setT0, 
    Tm, setTm, 
    k, setK,
    duration, setDuration,
    measurementInterval: interval, setMeasurementInterval: setInterval
  } = useSimulationStore();

  return (
    <section className="lg:col-span-3 bg-[#EDF3F9] dark:bg-slate-800 shadow-neu-card dark:shadow-none rounded-2xl p-4 flex flex-col gap-4">
      <h2 className="font-bold text-slate-800 dark:text-white text-base flex items-center gap-2">
        <span>Configuración del experimento</span>
      </h2>
      
      {/* Object Selector */}
      <div>
        <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1.5 mb-1.5">
          <svg className="w-3.5 h-3.5 text-blue-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" clipRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"></path></svg>
          Objeto
        </label>
        <div className="relative">
          <select 
            value={objectType}
            onChange={(e) => setObjectType(e.target.value as ObjectType)}
            className="w-full bg-[#E5ECF4] dark:bg-slate-900 shadow-neu-pressed dark:shadow-none text-sm font-medium text-slate-700 dark:text-slate-300 py-2.5 px-3 rounded-xl border-none focus:ring-2 focus:ring-blue-500 cursor-pointer appearance-none"
          >
            <option value="Coffee">☕ Café caliente</option>
            <option value="Tea">🍵 Té de hierbas</option>
            <option value="Water">🥛 Agua hirviendo</option>
            <option value="Milk">🍼 Leche fría</option>
            <option value="Soup">🍲 Sopa</option>
            <option value="Aluminum">🔩 Bloque de aluminio</option>
            <option value="Body">🧍 Cuerpo humano (Forense)</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
          </div>
        </div>
      </div>
      
      {/* Environment Selector */}
      <div>
        <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1.5 mb-1.5">
          <svg className="w-3.5 h-3.5 text-blue-600" fill="currentColor" viewBox="0 0 20 20"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path></svg>
          Medio / Entorno
        </label>
        <div className="relative">
          <select 
            value={environment}
            onChange={(e) => setEnvironment(e.target.value as Environment)}
            className="w-full bg-[#E5ECF4] dark:bg-slate-900 shadow-neu-pressed dark:shadow-none text-sm font-medium text-slate-700 dark:text-slate-300 py-2.5 px-3 rounded-xl border-none focus:ring-2 focus:ring-blue-500 cursor-pointer appearance-none"
          >
            <option value="Room">🏠 Habitación (30 °C)</option>
            <option value="Fridge">❄️ Refrigerador (5 °C)</option>
            <option value="Freezer">🧊 Congelador (-10 °C)</option>
            <option value="Outside">☀️ Exterior soleado (38 °C)</option>
            <option value="Custom">⚙️ Personalizado</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
          </div>
        </div>
      </div>
      
      {/* Slider 1: T0 */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
          <span>Temperatura inicial <i>T</i><sub>0</sub> (°C)</span>
          <div className="w-12 text-center py-1 bg-[#EDF3F9] dark:bg-slate-700 shadow-neu-flat dark:shadow-none rounded-lg font-bold text-slate-800 dark:text-white text-sm">{T0}</div>
        </div>
        <input 
          className="w-full mt-1" 
          type="range" 
          min="0" max="100" step="1" 
          value={T0} 
          onChange={(e) => setT0(Number(e.target.value))} 
        />
        <div className="flex justify-between text-[10px] text-slate-400 font-medium px-0.5">
          <span>0</span><span>50</span><span>100</span>
        </div>
      </div>

      {/* Slider 2: Tm */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
          <span>Temperatura ambiente <i>T</i><sub>m</sub> (°C)</span>
          <div className="w-12 text-center py-1 bg-[#EDF3F9] dark:bg-slate-700 shadow-neu-flat dark:shadow-none rounded-lg font-bold text-slate-800 dark:text-white text-sm">{Tm}</div>
        </div>
        <input 
          className="w-full mt-1" 
          type="range" 
          min="-10" max="50" step="1" 
          value={Tm} 
          onChange={(e) => setTm(Number(e.target.value))} 
        />
        <div className="flex justify-between text-[10px] text-slate-400 font-medium px-0.5">
          <span>-10</span><span>20</span><span>50</span>
        </div>
      </div>

      {/* Slider 3: k */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
          <span>Constante de enf. <i>k</i></span>
          <div className="w-14 text-center py-1 bg-[#EDF3F9] dark:bg-slate-700 shadow-neu-flat dark:shadow-none rounded-lg font-bold text-slate-800 dark:text-white text-xs">{k.toFixed(3)}</div>
        </div>
        <input 
          className="w-full mt-1" 
          type="range" 
          min="-0.200" max="-0.005" step="0.001" 
          value={k} 
          onChange={(e) => setK(Number(e.target.value))} 
        />
        <div className="flex justify-between text-[10px] text-slate-400 font-medium px-0.5">
          <span>-0.2</span><span>-0.05</span><span>0</span>
        </div>
      </div>

      {/* Slider 4: Duration */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
          <span>Duración (min)</span>
          <div className="w-12 text-center py-1 bg-[#EDF3F9] dark:bg-slate-700 shadow-neu-flat dark:shadow-none rounded-lg font-bold text-slate-800 dark:text-white text-sm">{duration}</div>
        </div>
        <input 
          className="w-full mt-1" 
          type="range" 
          min="10" max="120" step="5" 
          value={duration} 
          onChange={(e) => setDuration(Number(e.target.value))} 
        />
        <div className="flex justify-between text-[10px] text-slate-400 font-medium px-0.5">
          <span>10</span><span>60</span><span>120</span>
        </div>
      </div>

      {/* Slider 5: Interval */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
          <span>Intervalo (min)</span>
          <div className="w-12 text-center py-1 bg-[#EDF3F9] dark:bg-slate-700 shadow-neu-flat dark:shadow-none rounded-lg font-bold text-slate-800 dark:text-white text-sm">{interval}</div>
        </div>
        <input 
          className="w-full mt-1" 
          type="range" 
          min="1" max="10" step="1" 
          value={interval} 
          onChange={(e) => setInterval(Number(e.target.value))} 
        />
        <div className="flex justify-between text-[10px] text-slate-400 font-medium px-0.5">
          <span>1</span><span>5</span><span>10</span>
        </div>
      </div>
    </section>
  );
};

export default ConfigPanel;
