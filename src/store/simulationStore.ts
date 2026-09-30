import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ViewMode = 'Normal' | 'Thermal' | 'Heatmap' | 'Transfer';
export type ObjectType = 'Coffee' | 'Water' | 'Milk' | 'Tea' | 'Soup' | 'Aluminum' | 'Body';
export type Environment = 'Room' | 'Fridge' | 'Freezer' | 'Outside' | 'Custom';
export type Theme = 'light' | 'dark';

export interface Scenario {
  T0: number;
  Tm: number;
  k: number;
}

interface SimulationState {
  // Tab State
  activeTab: string;
  setActiveTab: (tab: string) => void;
  
  // Theme & Preferences
  theme: Theme;
  setTheme: (theme: Theme) => void;
  
  // Mathematical Parameters
  T0: number;
  Tm: number;
  k: number;
  duration: number; // in minutes
  measurementInterval: number; // in minutes
  
  setT0: (val: number) => void;
  setTm: (val: number) => void;
  setK: (val: number) => void;
  setDuration: (val: number) => void;
  setMeasurementInterval: (val: number) => void;

  // Runtime State
  currentTime: number; // current time in simulation
  playbackSpeed: number; // 0.5, 1, 2, 5, 10
  isPlaying: boolean;
  
  setCurrentTime: (val: number) => void;
  setPlaybackSpeed: (val: number) => void;
  setIsPlaying: (val: boolean) => void;
  togglePlay: () => void;
  resetTime: () => void;

  // Visual State
  objectType: ObjectType;
  environment: Environment;
  viewMode: ViewMode;
  
  setObjectType: (obj: ObjectType) => void;
  setEnvironment: (env: Environment) => void;
  setViewMode: (mode: ViewMode) => void;

  // Analysis State
  targetTemperature: number | null;
  setTargetTemperature: (val: number | null) => void;

  // Comparison Scenarios
  scenarioA: Scenario;
  scenarioB: Scenario;
  setScenarioB: (scenario: Scenario) => void;
}

export const useSimulationStore = create<SimulationState>()(
  persist(
    (set) => ({
      // Tab
      activeTab: 'Simulación',
      setActiveTab: (activeTab) => set({ activeTab }),

      // Theme
      theme: 'light',
      setTheme: (theme) => set({ theme }),

      // Mathematical
      T0: 80,
      Tm: 30,
      k: -0.032,
      duration: 60,
      measurementInterval: 3,

      setT0: (T0) => set({ T0 }),
      setTm: (Tm) => set({ Tm, environment: 'Custom' }),
      setK: (k) => set({ k }),
      setDuration: (duration) => set({ duration }),
      setMeasurementInterval: (measurementInterval) => set({ measurementInterval }),

      // Runtime
      currentTime: 0,
      playbackSpeed: 1,
      isPlaying: false,

      setCurrentTime: (currentTime) => set({ currentTime }),
      setPlaybackSpeed: (playbackSpeed) => set({ playbackSpeed }),
      setIsPlaying: (isPlaying) => set({ isPlaying }),
      togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
      resetTime: () => set({ currentTime: 0, isPlaying: false }),

      // Visuals
      objectType: 'Coffee',
      environment: 'Room',
      viewMode: 'Normal',

      setObjectType: (objectType) => set({ objectType }),
      setEnvironment: (environment) => {
        let newTm = 30;
        if (environment === 'Room') newTm = 30;
        if (environment === 'Fridge') newTm = 4;
        if (environment === 'Freezer') newTm = -18;
        if (environment === 'Outside') newTm = 15;
        
        set({ environment, Tm: environment === 'Custom' ? useSimulationStore.getState().Tm : newTm });
      },
      setViewMode: (viewMode) => set({ viewMode }),

      // Analysis
      targetTemperature: 40,
      setTargetTemperature: (targetTemperature) => set({ targetTemperature }),

      // Comparison
      scenarioA: { T0: 80, Tm: 30, k: -0.032 }, // Usually synced with main if needed, or kept separate
      scenarioB: { T0: 100, Tm: 20, k: -0.065 },
      setScenarioB: (scenarioB) => set({ scenarioB }),
    }),
    {
      name: 'newton-cooling-storage',
      partialize: (state) => ({
        theme: state.theme,
        T0: state.T0,
        Tm: state.Tm,
        k: state.k,
        duration: state.duration,
        measurementInterval: state.measurementInterval,
        objectType: state.objectType,
        environment: state.environment,
        scenarioB: state.scenarioB,
      }),
    }
  )
);
