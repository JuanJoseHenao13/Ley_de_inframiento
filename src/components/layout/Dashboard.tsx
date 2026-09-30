import React from 'react';
import { useSimulationStore } from '../../store/simulationStore';
import ConfigPanel from '../controls/ConfigPanel';
import StatePanel from '../controls/StatePanel';
import SimulationHero from '../simulation/SimulationHero';
import ChartPanel from '../charts/ChartPanel';
import ResultsTable from '../results/ResultsTable';
import MathModelPanel from '../math/MathModelPanel';
import ComparePanel from '../comparison/ComparePanel';

const Dashboard = () => {
  const { activeTab, setObjectType, setTm, setT0, resetTime, setActiveTab } = useSimulationStore();

  const loadPreset = (preset: any) => {
    setObjectType(preset.object);
    setT0(preset.T0);
    setTm(preset.Tm);
    resetTime();
    setActiveTab('Simulación');
  };

  if (activeTab === 'Simulación') {
    return (
      <div className="flex flex-col gap-4">
        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left Config Panel */}
          <ConfigPanel />
          
          {/* Center Simulation Area */}
          <SimulationHero />
          
          {/* Right Status Panel */}
          <StatePanel />
        </div>

        {/* Bottom Analytics Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <ChartPanel />
          <ResultsTable />
          <MathModelPanel />
          <ComparePanel />
        </div>
      </div>
    );
  }

  // Handle other tabs
  if (activeTab === 'Comparar') {
    return (
      <div className="max-w-4xl mx-auto h-[600px] w-full">
        <ComparePanel />
      </div>
    );
  }

  if (activeTab === 'Resultados') {
    return (
      <div className="max-w-4xl mx-auto flex flex-col gap-4 w-full">
        <div className="h-[400px]">
          <ResultsTable />
        </div>
        <div className="flex justify-end">
          <button 
            onClick={() => alert("Exportando a CSV...")}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl shadow-neu-accent font-bold"
          >
            Exportar CSV
          </button>
        </div>
      </div>
    );
  }

  if (activeTab === 'Modelo matemático') {
    return (
      <div className="max-w-3xl mx-auto h-[500px] w-full">
        <MathModelPanel />
      </div>
    );
  }

  if (activeTab === 'Experimentos') {
    return (
      <div className="max-w-4xl mx-auto bg-[#EDF3F9] shadow-neu-card rounded-2xl p-8 w-full dark:bg-slate-800 dark:shadow-none">
        <h2 className="font-bold text-2xl mb-6 text-slate-800 dark:text-white">Experimentos Predefinidos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button onClick={() => loadPreset({ object: 'Coffee', T0: 85, Tm: 25 })} className="bg-[#E5ECF4] shadow-neu-pressed p-4 rounded-xl flex flex-col items-start gap-2 hover:bg-white transition-colors dark:bg-slate-700">
            <span className="font-bold text-slate-800 dark:text-white">Café en habitación</span>
            <span className="text-sm text-slate-500">T₀ = 85°C | Tm = 25°C</span>
          </button>
          <button onClick={() => loadPreset({ object: 'Water', T0: 90, Tm: 4 })} className="bg-[#E5ECF4] shadow-neu-pressed p-4 rounded-xl flex flex-col items-start gap-2 hover:bg-white transition-colors dark:bg-slate-700">
            <span className="font-bold text-slate-800 dark:text-white">Agua caliente en refrigerador</span>
            <span className="text-sm text-slate-500">T₀ = 90°C | Tm = 4°C</span>
          </button>
          <button onClick={() => loadPreset({ object: 'Aluminum', T0: 150, Tm: 20 })} className="bg-[#E5ECF4] shadow-neu-pressed p-4 rounded-xl flex flex-col items-start gap-2 hover:bg-white transition-colors dark:bg-slate-700">
            <span className="font-bold text-slate-800 dark:text-white">Bloque de aluminio al aire</span>
            <span className="text-sm text-slate-500">T₀ = 150°C | Tm = 20°C</span>
          </button>
          <button onClick={() => loadPreset({ object: 'Milk', T0: 4, Tm: 25 })} className="bg-[#E5ECF4] shadow-neu-pressed p-4 rounded-xl flex flex-col items-start gap-2 hover:bg-white transition-colors dark:bg-slate-700">
            <span className="font-bold text-slate-800 dark:text-white">Leche fría calentándose</span>
            <span className="text-sm text-slate-500">T₀ = 4°C | Tm = 25°C</span>
          </button>
          <button onClick={() => loadPreset({ object: 'Body', T0: 37, Tm: 15 })} className="bg-[#E5ECF4] shadow-neu-pressed p-4 rounded-xl flex flex-col items-start gap-2 hover:bg-white transition-colors md:col-span-2 dark:bg-slate-700">
            <span className="font-bold text-slate-800 dark:text-white">Forense: Pérdida de calor postmortem</span>
            <span className="text-sm text-slate-500">T₀ = 37°C | Tm = 15°C</span>
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default Dashboard;
