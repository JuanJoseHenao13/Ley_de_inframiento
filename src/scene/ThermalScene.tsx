import React, { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, OrbitControls, ContactShadows, Sparkles, Sphere } from '@react-three/drei';
import { useSimulationStore } from '../store/simulationStore';
import * as THREE from 'three';
import { temperatureAtTime } from '../engine/coolingModel';

// Import our object models
import CoffeeMug from './objects/CoffeeMug';
import WaterGlass from './objects/WaterGlass';
import MilkGlass from './objects/MilkGlass';
import TeaCup from './objects/TeaCup';
import SoupBowl from './objects/SoupBowl';
import AluminumBlock from './objects/AluminumBlock';
import HumanBody from './objects/HumanBody';

// Helper for interpolating thermal colors
const getThermalColor = (temp: number) => {
  const t = Math.max(0, Math.min(1, (temp + 10) / 110)); 
  const blue = new THREE.Color('#0015ff');
  const cyan = new THREE.Color('#00ffff');
  const yellow = new THREE.Color('#ffff00');
  const red = new THREE.Color('#ff0000');
  const white = new THREE.Color('#ffffff');

  if (t < 0.25) return blue.clone().lerp(cyan, t / 0.25);
  if (t < 0.5) return cyan.clone().lerp(yellow, (t - 0.25) / 0.25);
  if (t < 0.75) return yellow.clone().lerp(red, (t - 0.5) / 0.25);
  return red.clone().lerp(white, (t - 0.75) / 0.25);
};

// Steam Component
const Steam = ({ currentTemp }: { currentTemp: number }) => {
  if (currentTemp < 45) return null; // Only emit steam if hot enough
  const intensity = Math.min(1, (currentTemp - 45) / 55);
  return (
    <Sparkles 
      position={[0, 1.8, 0]} 
      count={Math.floor(50 * intensity)} 
      scale={[0.8, 2, 0.8]} 
      size={6 * intensity} 
      speed={0.4} 
      opacity={0.3 * intensity} 
      color="#ffffff" 
    />
  );
};

// Transfer Particles Component (Convection flow)
const HeatTransferLines = ({ deltaT, isHotterThanEnv }: { deltaT: number, isHotterThanEnv: boolean }) => {
  const intensity = Math.min(1, Math.abs(deltaT) / 50);
  if (intensity < 0.05) return null;

  return (
    <group>
      {/* Sparkles flowing out or in */}
      <Sparkles 
        position={[0, 1.5, 0]} 
        count={Math.floor(100 * intensity)} 
        scale={[3, 3, 3]} 
        size={4} 
        speed={isHotterThanEnv ? 0.8 : -0.8} 
        opacity={0.6 * intensity} 
        color={isHotterThanEnv ? "#ef4444" : "#3b82f6"} 
      />
      {/* Central aura ring */}
      <mesh position={[0, 0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.5, 0.05, 16, 64]} />
        <meshBasicMaterial color={isHotterThanEnv ? "#ef4444" : "#3b82f6"} transparent opacity={0.3 * intensity} />
      </mesh>
    </group>
  );
};

// Heatmap Aura Component
const HeatmapAura = ({ currentTemp, deltaT }: { currentTemp: number, deltaT: number }) => {
  const thermalColor = useMemo(() => getThermalColor(currentTemp), [currentTemp]);
  const intensity = Math.min(1, Math.abs(deltaT) / 40);
  
  return (
    <group position={[0, 0.5, 0]}>
      {/* Inner strong aura */}
      <Sphere args={[1.2, 32, 32]}>
        <meshBasicMaterial color={thermalColor} transparent opacity={0.3} blending={THREE.AdditiveBlending} depthWrite={false} />
      </Sphere>
      {/* Outer weak aura */}
      <Sphere args={[2.5, 32, 32]}>
        <meshBasicMaterial color={thermalColor} transparent opacity={0.1 * intensity} blending={THREE.AdditiveBlending} depthWrite={false} />
      </Sphere>
    </group>
  );
};

// Realistic Environment Setup
const EnvironmentProps = ({ envType, viewMode }: { envType: string, viewMode: string }) => {
  // If thermal view, the environment should look cold or neutral depending on Tm
  const tableColor = viewMode === 'Thermal' ? '#0015ff' : 
                     envType === 'Room' ? '#d4a373' : 
                     envType === 'Fridge' || envType === 'Freezer' ? '#e2e8f0' : '#8b5a2b';
                     
  const tableRoughness = envType === 'Fridge' ? 0.1 : 0.8;
  const tableMetalness = envType === 'Fridge' ? 0.5 : 0.0;

  return (
    <group>
      {/* High-quality table/surface */}
      <mesh receiveShadow position={[0, -0.05, 0]}>
        <cylinderGeometry args={[4, 4, 0.1, 64]} />
        <meshStandardMaterial 
          color={tableColor} 
          roughness={viewMode === 'Thermal' ? 1 : tableRoughness} 
          metalness={viewMode === 'Thermal' ? 0 : tableMetalness} 
        />
      </mesh>
      
      {/* Additional environmental details for realism */}
      {envType === 'Room' && viewMode === 'Normal' && (
        <mesh position={[2, -0.05, -2]} receiveShadow>
          <boxGeometry args={[1, 0.05, 1.5]} />
          <meshStandardMaterial color="#ffffff" roughness={0.9} />
        </mesh>
      )}
      
      {/* Fridge/Freezer grid lines on surface */}
      {(envType === 'Fridge' || envType === 'Freezer') && viewMode === 'Normal' && (
        <gridHelper args={[8, 16, '#94a3b8', '#cbd5e1']} position={[0, 0.01, 0]} />
      )}
    </group>
  );
};

const SceneContent = () => {
  const { objectType, viewMode, environment, T0, Tm, k, currentTime, theme } = useSimulationStore();
  const currentTemp = temperatureAtTime({ T0, Tm, k }, currentTime);
  const deltaT = currentTemp - Tm;
  const isHotterThanEnv = currentTemp > Tm;

  // Background color mapping
  const bgColor = theme === 'dark' ? '#0f172a' : '#EBF1F7';
  
  return (
    <>
      <color attach="background" args={[viewMode === 'Thermal' ? '#000022' : bgColor]} />
      
      {/* Lighting setup based on viewMode and environment */}
      <ambientLight intensity={viewMode === 'Thermal' ? 0.5 : (environment === 'Outside' ? 1.0 : 0.5)} color={viewMode === 'Thermal' ? '#ffffff' : '#ffffff'} />
      <directionalLight 
        position={[5, 10, 5]} 
        intensity={viewMode === 'Thermal' ? 0 : (environment === 'Outside' ? 1.5 : 1.0)} 
        castShadow 
        shadow-mapSize-width={1024} 
        shadow-mapSize-height={1024}
      />
      {viewMode === 'Normal' && <directionalLight position={[-5, 5, -5]} intensity={0.3} color="#93c5fd" />}
      
      {viewMode === 'Normal' && (
        <Environment preset={environment === 'Outside' ? 'city' : (environment === 'Fridge' || environment === 'Freezer' ? 'studio' : 'apartment')} />
      )}

      <group position={[0, -0.5, 0]}>
        {/* Environment surface */}
        <EnvironmentProps envType={environment} viewMode={viewMode} />
        
        {/* Crisp Contact Shadow */}
        <ContactShadows position={[0, 0, 0]} opacity={viewMode === 'Thermal' ? 0 : 0.65} scale={10} blur={1.5} far={4} resolution={1024} />

        <Suspense fallback={null}>
          {objectType === 'Coffee' && <CoffeeMug currentTemp={currentTemp} viewMode={viewMode} />}
          {objectType === 'Water' && <WaterGlass currentTemp={currentTemp} viewMode={viewMode} />}
          {objectType === 'Milk' && <MilkGlass currentTemp={currentTemp} viewMode={viewMode} />}
          {objectType === 'Tea' && <TeaCup currentTemp={currentTemp} viewMode={viewMode} />}
          {objectType === 'Soup' && <SoupBowl currentTemp={currentTemp} viewMode={viewMode} />}
          {objectType === 'Aluminum' && <AluminumBlock currentTemp={currentTemp} viewMode={viewMode} />}
          {objectType === 'Body' && <HumanBody currentTemp={currentTemp} viewMode={viewMode} />}
        </Suspense>

        {/* Steam effect (only visible in Normal mode) */}
        {viewMode === 'Normal' && <Steam currentTemp={currentTemp} />}

        {/* Visual Modes */}
        {viewMode === 'Heatmap' && <HeatmapAura currentTemp={currentTemp} deltaT={deltaT} />}
        {viewMode === 'Transfer' && <HeatTransferLines deltaT={deltaT} isHotterThanEnv={isHotterThanEnv} />}
      </group>

      <OrbitControls 
        makeDefault 
        minPolarAngle={Math.PI / 4} 
        maxPolarAngle={Math.PI / 2.1} 
        minDistance={2.5} 
        maxDistance={12} 
        enablePan={false}
        autoRotate={viewMode === 'Normal'}
        autoRotateSpeed={0.5}
      />
    </>
  );
};

// Exporting standard wrapper for standard R3F usage, if needed elsewhere.
// But actually, SimulationHero now imports ThermalScene and expects the Canvas inside, 
// OR wait, earlier I removed the Canvas from SimulationHero? 
// Let's re-add Canvas here since SimulationHero doesn't have it anymore!
const ThermalScene = () => {
  return (
    <Canvas 
      shadows 
      camera={{ position: [0, 2, 6], fov: 45 }}
      gl={{ antialias: true, alpha: false }}
    >
      <SceneContent />
    </Canvas>
  );
};

export default ThermalScene;
