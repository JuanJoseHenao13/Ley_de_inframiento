import React, { useState } from 'react';
import { useSimulationStore } from '../../store/simulationStore';
import { timeToTarget } from '../../engine/coolingModel';

const CalculatorPanel = () => {
  const { T0, Tm, k } = useSimulationStore();
  const [targetTempStr, setTargetTempStr] = useState('40');
  const [resultMsg, setResultMsg] = useState<{ text: string; error?: boolean }>({ text: '' });

  const calculate = () => {
    const targetTemp = parseFloat(targetTempStr);
    if (isNaN(targetTemp)) {
      setResultMsg({ text: 'Valor inválido.', error: true });
      return;
    }

    const t = timeToTarget({ T0, Tm, k }, targetTemp);

    if (t === null) {
      setResultMsg({ text: 'Temperatura inalcanzable.', error: true });
    } else if (t === 0) {
      setResultMsg({ text: 'Ya se encuentra en esa temperatura.', error: false });
    } else if (t === Infinity) {
      setResultMsg({ text: 'El sistema solo se aproxima asintóticamente.', error: true });
    } else {
      setResultMsg({ text: `${t.toFixed(2)} minutos`, error: false });
    }
  };

  const jumpToTime = () => {
    const targetTemp = parseFloat(targetTempStr);
    if (isNaN(targetTemp)) return;
    const t = timeToTarget({ T0, Tm, k }, targetTemp);
    if (t !== null && t !== Infinity) {
      useSimulationStore.getState().setCurrentTime(t);
      // Also stop playing if we jump
      useSimulationStore.getState().setIsPlaying(false);
    }
  };

  return (
    <div className="neu-card p-6 flex flex-col gap-4 h-full relative z-10">
      <div className="flex items-center gap-2">
        <span className="text-xl">🧮</span>
        <h2 className="font-bold text-[15px] leading-tight">Calcular tiempo para alcanzar una temperatura</h2>
      </div>

      <div className="flex items-end gap-3 mt-2">
        <div className="flex-grow">
          <label className="text-xs font-medium text-gray-500 mb-1 block">Temperatura objetivo (°C)</label>
          <input 
            type="number"
            value={targetTempStr}
            onChange={(e) => setTargetTempStr(e.target.value)}
            className="neu-input py-2.5 font-medium tabular-nums"
            placeholder="Ej: 40"
          />
        </div>
        <button onClick={calculate} className="neu-button-primary px-6 py-2.5 h-[42px]">
          Calcular
        </button>
      </div>

      <div className="flex-grow flex flex-col justify-center min-h-[60px]">
        {resultMsg.text && (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 font-medium">Tiempo estimado:</p>
              <p className={`font-bold text-xl ${resultMsg.error ? 'text-red-500' : 'text-slate-800 dark:text-white'}`}>
                {resultMsg.text}
              </p>
            </div>
            
            {!resultMsg.error && resultMsg.text !== '' && resultMsg.text !== 'Ya se encuentra en esa temperatura.' && (
              <button 
                onClick={jumpToTime}
                className="text-primary text-sm font-medium hover:underline bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 rounded-lg transition-colors"
              >
                Ir a ese momento
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CalculatorPanel;
