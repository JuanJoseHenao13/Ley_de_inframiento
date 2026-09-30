import { useEffect, useRef } from 'react';
import { useSimulationStore } from '../store/simulationStore';

export const useSimulationLoop = () => {
  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();

  const animate = (time: number) => {
    if (previousTimeRef.current !== undefined) {
      const deltaTimeMs = time - previousTimeRef.current;
      
      const state = useSimulationStore.getState();
      
      if (state.isPlaying && state.currentTime < state.duration) {
        // Delta time in minutes based on playback speed
        // Let's assume 1 real second = 1 simulation minute if speed is 1x.
        // If duration is 60 minutes, it takes 60 seconds at 1x.
        const speed = state.playbackSpeed;
        const deltaSimulationMin = (deltaTimeMs / 1000) * speed;
        
        let newTime = state.currentTime + deltaSimulationMin;
        
        if (newTime >= state.duration) {
          newTime = state.duration;
          state.setIsPlaying(false);
        }
        
        state.setCurrentTime(newTime);
      }
    }
    
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);
};
