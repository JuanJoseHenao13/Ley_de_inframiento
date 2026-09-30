import React, { Suspense } from 'react';
import { useSimulationStore } from '../../store/simulationStore';
import type { ViewMode } from '../../store/simulationStore';
import { useSimulationLoop } from '../../engine/useSimulationLoop';
import { Canvas } from '@react-three/fiber';
import ThermalScene from '../../scene/ThermalScene';

const SimulationHero = () => {
  const { 
    viewMode, setViewMode, 
    isPlaying, setIsPlaying, 
    playbackSpeed, setPlaybackSpeed,
    currentTime: time, setCurrentTime: setTime, duration
  } = useSimulationStore();
  
  useSimulationLoop();

  const handlePlayPause = () => setIsPlaying(!isPlaying);
  const handleReset = () => { setIsPlaying(false); setTime(0); };

  const viewDescriptions = {
    Normal: { title: "Vista normal", desc: "Representación visual del objeto y su entorno." },
    Thermal: { title: "Vista térmica", desc: "Cámara termográfica infrarroja por gradiente de color de radiación." },
    Heatmap: { title: "Mapa de calor", desc: "Dispersión convectiva y campo térmico radial en torno a la fuente." },
    Transfer: { title: "Transferencia", desc: "Líneas de flujo y vectores de disipación de calor al medio circundante." }
  };

  const safeViewMode = viewDescriptions[viewMode as keyof typeof viewDescriptions] ? viewMode : 'Normal';

  return (
    <section className="lg:col-span-6 flex flex-col gap-3">
      {/* Top segmented view modes */}
      <div className="bg-[#EDF3F9] dark:bg-slate-800 shadow-neu-card dark:shadow-none rounded-2xl p-1.5 flex items-center justify-between gap-1.5">
        <button 
          onClick={() => setViewMode('Normal')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${viewMode === 'Normal' ? 'bg-blue-600 text-white shadow-neu-accent' : 'text-slate-600 dark:text-slate-400 hover:text-blue-600'}`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
          Vista normal
        </button>
        <button 
          onClick={() => setViewMode('Thermal')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${viewMode === 'Thermal' ? 'bg-blue-600 text-white shadow-neu-accent' : 'text-slate-600 dark:text-slate-400 hover:text-blue-600'}`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
          Vista térmica
        </button>
        <button 
          onClick={() => setViewMode('Heatmap')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${viewMode === 'Heatmap' ? 'bg-blue-600 text-white shadow-neu-accent' : 'text-slate-600 dark:text-slate-400 hover:text-blue-600'}`}
        >
          <span className="w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-amber-500 via-pink-500 to-indigo-500 inline-block"></span>
          Mapa de calor
        </button>
        <button 
          onClick={() => setViewMode('Transfer')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${viewMode === 'Transfer' ? 'bg-blue-600 text-white shadow-neu-accent' : 'text-slate-600 dark:text-slate-400 hover:text-blue-600'}`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
          Transferencia
        </button>
      </div>

      {/* Main Canvas */}
      <div className="relative bg-slate-900 rounded-2xl shadow-neu-card overflow-hidden h-[370px] flex items-center justify-center border border-slate-700/20">
        <Suspense fallback={null}>
          <ThermalScene />
        </Suspense>

        {/* Top-Left Info Label */}
        <div className="absolute top-3.5 left-4 bg-black/45 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10 text-white max-w-[200px] pointer-events-none z-10">
          <h3 className="text-xs font-bold leading-tight">{viewDescriptions[safeViewMode as keyof typeof viewDescriptions].title}</h3>
          <p className="text-[10px] text-slate-300 mt-0.5 leading-snug">{viewDescriptions[safeViewMode as keyof typeof viewDescriptions].desc}</p>
        </div>

        {/* Thermal Scale */}
        <div className={`absolute left-4 bottom-4 bg-black/60 backdrop-blur-md px-2 py-2 rounded-lg border border-white/10 flex flex-col items-center gap-1 z-10 ${viewMode !== 'Thermal' ? 'hidden' : ''}`}>
          <span className="text-[9px] font-bold text-white">100°C</span>
          <div className="w-2.5 h-24 rounded bg-gradient-to-t from-black via-blue-700 via-teal-400 via-yellow-400 via-orange-500 to-white"></div>
          <span className="text-[9px] font-bold text-white">0°C</span>
        </div>

        {/* Right thumbnails */}
        <div className="absolute right-3 top-3 bottom-3 flex flex-col justify-between py-1 gap-2 z-10">
          <button onClick={() => setViewMode('Normal')} className={`w-14 h-16 rounded-xl bg-slate-800/80 border-2 overflow-hidden relative shadow-md transition-transform hover:scale-105 ${viewMode === 'Normal' ? 'border-blue-500' : 'border-transparent'}`}>
            <div className="w-full h-full bg-gradient-to-b from-stone-700 via-stone-800 to-amber-950 flex items-center justify-center">
              <span className="text-xl">☕</span>
            </div>
            <span className="absolute bottom-0 inset-x-0 bg-black/70 text-[9px] text-white py-0.5 text-center font-medium">Normal</span>
          </button>
          <button onClick={() => setViewMode('Thermal')} className={`w-14 h-16 rounded-xl bg-slate-800/80 border-2 overflow-hidden relative shadow-md transition-transform hover:scale-105 ${viewMode === 'Thermal' ? 'border-blue-500' : 'border-transparent'}`}>
            <div className="w-full h-full bg-gradient-to-tr from-blue-900 via-yellow-400 to-red-600 flex items-center justify-center">
              <span className="text-xs font-bold text-white">IR</span>
            </div>
            <span className="absolute bottom-0 inset-x-0 bg-black/70 text-[9px] text-white py-0.5 text-center font-medium">Térmica</span>
          </button>
          <button onClick={() => setViewMode('Heatmap')} className={`w-14 h-16 rounded-xl bg-slate-800/80 border-2 overflow-hidden relative shadow-md transition-transform hover:scale-105 ${viewMode === 'Heatmap' ? 'border-blue-500' : 'border-transparent'}`}>
            <div className="w-full h-full bg-gradient-to-t from-blue-600 via-amber-400 to-rose-600 flex items-center justify-center opacity-85">
              <span className="text-[10px] font-bold text-white">HEAT</span>
            </div>
            <span className="absolute bottom-0 inset-x-0 bg-black/70 text-[9px] text-white py-0.5 text-center font-medium">Mapa</span>
          </button>
          <button onClick={() => setViewMode('Transfer')} className={`w-14 h-16 rounded-xl bg-slate-800/80 border-2 overflow-hidden relative shadow-md transition-transform hover:scale-105 ${viewMode === 'Transfer' ? 'border-blue-500' : 'border-transparent'}`}>
            <div className="w-full h-full bg-gradient-to-b from-amber-700 via-indigo-900 to-black flex items-center justify-center">
              <span className="text-xs text-amber-300">〰️🔥</span>
            </div>
            <span className="absolute bottom-0 inset-x-0 bg-black/70 text-[9px] text-white py-0.5 text-center font-medium">Transf.</span>
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-[#EDF3F9] dark:bg-slate-800 shadow-neu-card dark:shadow-none rounded-2xl p-3.5 flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button 
              onClick={handlePlayPause}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white shadow-neu-accent transition-all ${isPlaying ? 'bg-blue-700 ring-2 ring-blue-400' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {isPlaying ? (
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
              ) : (
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4l12 6-12 6V4z"></path></svg>
              )}
              {isPlaying ? 'Pausar' : 'Iniciar'}
            </button>
            <button onClick={handleReset} className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-[#EDF3F9] dark:bg-slate-700 shadow-neu-btn dark:shadow-none hover:text-blue-600 transition-all">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
              Reiniciar
            </button>
          </div>

          <div className="flex items-center gap-1 bg-[#E2EAF2] dark:bg-slate-900 shadow-neu-pressed dark:shadow-none p-1 rounded-xl text-[11px] font-semibold text-slate-600 dark:text-slate-400">
            <span className="px-1.5 text-slate-500 font-medium">Velocidad:</span>
            {[0.5, 1, 2, 5, 10].map(speed => (
              <button 
                key={speed}
                onClick={() => setPlaybackSpeed(speed)}
                className={`px-2 py-0.5 rounded-lg transition-colors ${playbackSpeed === speed ? 'bg-blue-600 text-white shadow-neu-accent' : ''}`}
              >
                {speed}x
              </button>
            ))}
          </div>

          <div className="flex flex-col items-end">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Tiempo simulado</span>
            <div className="text-base font-extrabold text-slate-800 dark:text-white tracking-tight">{time.toFixed(2)} min</div>
          </div>
        </div>

        <div className="w-full flex flex-col gap-1">
          <input 
            className="w-full" 
            type="range" 
            min="0" max={duration} step="0.05" 
            value={time} 
            onChange={(e) => setTime(Number(e.target.value))} 
          />
          <div className="flex justify-between text-[11px] font-semibold text-slate-500 px-0.5">
            <span>0 min</span>
            <span>{duration} min</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SimulationHero;
