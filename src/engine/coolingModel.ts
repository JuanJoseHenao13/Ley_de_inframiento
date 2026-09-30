// src/engine/coolingModel.ts

/**
 * Newton's Law of Cooling
 * T(t) = Tm + (T0 - Tm) * e^(kt)
 */

export interface CoolingParams {
  T0: number; // Initial temperature
  Tm: number; // Ambient temperature
  k: number;  // Cooling constant (negative for cooling)
}

export interface Sample {
  time: number;
  temperature: number;
  deltaT: number;
  rate: number;
}

/**
 * Calculates the temperature at a specific time t.
 */
export const temperatureAtTime = (params: CoolingParams, t: number): number => {
  const { T0, Tm, k } = params;
  return Tm + (T0 - Tm) * Math.exp(k * t);
};

/**
 * Calculates the rate of temperature change (dT/dt) at a specific temperature T.
 * dT/dt = k(T - Tm)
 */
export const temperatureRate = (params: CoolingParams, currentT: number): number => {
  const { Tm, k } = params;
  return k * (currentT - Tm);
};

/**
 * Calculates the time required to reach a target temperature.
 * t = ln((Target - Tm) / (T0 - Tm)) / k
 * Returns null if the target is unreachable (e.g., target is beyond Tm in the wrong direction).
 */
export const timeToTarget = (params: CoolingParams, targetT: number): number | null => {
  const { T0, Tm, k } = params;
  
  if (T0 === targetT) return 0;
  
  // If target is exactly ambient, it takes infinite time as it's an asymptote
  if (targetT === Tm) return Infinity;
  
  if (k === 0) return null;

  const ratio = (targetT - Tm) / (T0 - Tm);
  
  // If ratio is negative or 0, target is unreachable
  if (ratio <= 0) return null;

  return Math.log(ratio) / k;
};

/**
 * Generates an array of samples for the table/chart.
 */
export const generateSamples = (params: CoolingParams, duration: number, interval: number): Sample[] => {
  const samples: Sample[] = [];
  const step = Math.max(0.1, interval);
  
  for (let t = 0; t <= duration; t += step) {
    const T = temperatureAtTime(params, t);
    const rate = temperatureRate(params, T);
    samples.push({
      time: t,
      temperature: T,
      deltaT: T - params.Tm,
      rate,
    });
  }
  
  // Ensure the exact duration is included if not hit by interval
  if (samples.length > 0 && samples[samples.length - 1].time !== duration) {
    const T = temperatureAtTime(params, duration);
    const rate = temperatureRate(params, T);
    samples.push({
      time: duration,
      temperature: T,
      deltaT: T - params.Tm,
      rate,
    });
  }

  return samples;
};
