import { Suspense, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls, ContactShadows, Cloud, Sparkles } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { useSimulationStore } from '../store/simulationStore';
import * as THREE from 'three';
import { temperatureAtTime } from '../engine/coolingModel';

import CoffeeMug from './objects/CoffeeMug';
import WaterGlass from './objects/WaterGlass';
import MilkGlass from './objects/MilkGlass';
import TeaCup from './objects/TeaCup';
import SoupBowl from './objects/SoupBowl';
import AluminumBlock from './objects/AluminumBlock';
import HumanBody from './objects/HumanBody';
import { FluidAura } from './objects/utils';

const Steam = ({ currentTemp }: { currentTemp: number }) => {
  if (currentTemp < 45) return null;
  const intensity = Math.min(1, (currentTemp - 45) / 55);

  return (
    <group position={[0, 1.4, 0]}>
      {/* Hyperrealistic dynamic smoke cloud */}
      <Cloud
        opacity={0.3 * intensity}
        speed={0.8}
        segments={30}
        color="#ffffff"
        scale={[1, 1.5, 1]}
      />
      {/* Small hot moisture particles */}
      <Sparkles
        count={50 * intensity}
        scale={[1.5, 2, 1.5]}
        size={2.5}
        speed={1.5}
        opacity={0.5 * intensity}
        color="#ffecd1"
      />
    </group>
  );
};

const HeatmapAura = ({ currentTemp, deltaT }: { currentTemp: number, deltaT: number }) => {
  return (
    <group position={[0, 0.4, 0]}>
      <FluidAura currentTemp={currentTemp} deltaT={deltaT} isTransfer={false} />
    </group>
  );
};

const GlowingArrow = ({ angle, intensity, isHotter }: { angle: number, intensity: number, isHotter: boolean }) => {
  const arrowRef = useRef<THREE.Group>(null);

  const radiusStart = 0.8;
  const radiusEnd = 1.4;
  const heightStart = 0.2;
  const heightEnd = 1.2;

  const start = new THREE.Vector3(Math.cos(angle) * radiusStart, heightStart, Math.sin(angle) * radiusStart);
  const end = new THREE.Vector3(Math.cos(angle) * radiusEnd, heightEnd, Math.sin(angle) * radiusEnd);
  const control = new THREE.Vector3(Math.cos(angle) * (radiusStart + 0.3), heightStart + 0.5, Math.sin(angle) * (radiusStart + 0.3));

  const curve = useMemo(() => new THREE.QuadraticBezierCurve3(start, control, end), [start, control, end]);

  useFrame(({ clock }) => {
    if (arrowRef.current) {
      const t = (clock.getElapsedTime() + angle) % 2;
      arrowRef.current.position.y = Math.sin(t * Math.PI) * 0.1;
      arrowRef.current.scale.setScalar(0.8 + Math.sin(t * Math.PI) * 0.2);
    }
  });

  const color = isHotter ? "#ff5500" : "#00aaff";

  return (
    <group ref={arrowRef}>
      <mesh>
        <tubeGeometry args={[curve, 32, 0.015, 8, false]} />
        <meshBasicMaterial color={color} transparent opacity={0.6 * intensity} depthWrite={false} />
      </mesh>
      {/* Arrowhead */}
      <mesh position={end} rotation={[0, -angle + Math.PI / 2, -Math.PI / 6]}>
        <coneGeometry args={[0.06, 0.15, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.8 * intensity} depthWrite={false} />
      </mesh>
    </group>
  );
};

const HeatTransferLines = ({ currentTemp, deltaT, isHotterThanEnv, viewMode }: { currentTemp: number, deltaT: number, isHotterThanEnv: boolean, viewMode: string }) => {
  const intensity = Math.min(1, Math.abs(deltaT) / 50);
  if (intensity < 0.05) return null;

  return (
    <group position={[0, 0.2, 0]}>
      {viewMode === 'Transfer' && <FluidAura currentTemp={currentTemp} deltaT={deltaT} isTransfer={true} />}

      {/* Glowing curved arrows around the object */}
      {[0, Math.PI / 3, (2 * Math.PI) / 3, Math.PI, (4 * Math.PI) / 3, (5 * Math.PI) / 3].map((angle, i) => (
        <GlowingArrow key={i} angle={angle} intensity={intensity} isHotter={isHotterThanEnv} />
      ))}

      {/* Sparkles */}
      <Sparkles
        count={100 * intensity}
        scale={[2.5, 3, 2.5]}
        size={3}
        speed={isHotterThanEnv ? 2.5 : -2.5}
        opacity={0.6 * intensity}
        color={isHotterThanEnv ? "#ff3300" : "#00ffff"}
      />
    </group>
  );
};

const EnvironmentProps = ({ envType, viewMode }: { envType: string, viewMode: string }) => {
  const isThermal = viewMode === 'Thermal' || viewMode === 'Heatmap' || viewMode === 'Transfer';
  const tableColor = isThermal
    ? '#000000'
    : envType === 'Room' ? '#c8d0da'
    : envType === 'Fridge' || envType === 'Freezer' ? '#e8eef5'
    : '#a8a8b0';

  return (
    <group>
      {/* Mesa limpia y plana sin geometría de cilindro que genera ruido */}
      <mesh receiveShadow position={[0, -0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[5, 128]} />
        {isThermal ? (
          // En modo térmico: superficie absolutamente negra (fría = negro en FLIR)
          <meshBasicMaterial color="#000000" />
        ) : (
          <meshStandardMaterial
            color={tableColor}
            roughness={0.25}
            metalness={0.15}
          />
        )}
      </mesh>

      {/* Pedestal solo en modo normal */}
      {!isThermal && (
        <mesh receiveShadow castShadow position={[0, 0.04, 0]}>
          <cylinderGeometry args={[1.35, 1.45, 0.08, 64]} />
          <meshPhysicalMaterial
            color="#f5f5f5"
            roughness={0.08}
            metalness={0.05}
            clearcoat={1.0}
            clearcoatRoughness={0.05}
          />
        </mesh>
      )}

      {/* Aro de luz naranja alrededor del pedestal (solo Normal) */}
      {!isThermal && (
        <mesh position={[0, 0.06, 0]}>
          <torusGeometry args={[1.4, 0.012, 16, 64]} />
          <meshBasicMaterial color="#ff8800" transparent opacity={0.45} />
        </mesh>
      )}
    </group>
  );
};

const SceneContent = () => {
  const { objectType, viewMode, environment, T0, Tm, k, currentTime, theme } = useSimulationStore();
  const currentTemp = temperatureAtTime({ T0, Tm, k }, currentTime);
  const deltaT = currentTemp - Tm;
  const isHotterThanEnv = currentTemp > Tm;
  const isThermal = viewMode === 'Thermal' || viewMode === 'Heatmap' || viewMode === 'Transfer';

  // Fondo FLIR real: totalmente negro en modo térmico, sin niebla que diluya los colores
  const bgColor = isThermal ? '#000000' : theme === 'dark' ? '#0f172a' : '#e2e8f0';

  return (
    <>
      <color attach="background" args={[bgColor]} />
      {!isThermal && <fog attach="fog" args={[bgColor, 6, 18]} />}

      {/* En modo térmico: luz ambiental mínima para que los emissives sean los protagonistas */}
      <ambientLight intensity={isThermal ? 0.05 : 0.45} color="#ffffff" />

      <directionalLight
        position={[4, 6, 2]}
        intensity={isThermal ? 0 : 0.9}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0005}
      />

      {viewMode === 'Normal' && (
        <Environment preset="apartment" background={false} blur={0.6} />
      )}

      <group position={[0, -0.5, 0]}>
        <EnvironmentProps envType={environment} viewMode={viewMode} />

        {/* Deep, highly detailed contact shadow */}
        <ContactShadows position={[0, 0, 0]} opacity={isThermal ? 0.1 : 0.7} scale={12} blur={2.5} far={3} resolution={2048} color="#000000" />

        <Suspense fallback={null}>
          {objectType === 'Coffee' && <CoffeeMug currentTemp={currentTemp} viewMode={viewMode} />}
          {objectType === 'Water' && <WaterGlass currentTemp={currentTemp} viewMode={viewMode} />}
          {objectType === 'Milk' && <MilkGlass currentTemp={currentTemp} viewMode={viewMode} />}
          {objectType === 'Tea' && <TeaCup currentTemp={currentTemp} viewMode={viewMode} />}
          {objectType === 'Soup' && <SoupBowl currentTemp={currentTemp} viewMode={viewMode} />}
          {objectType === 'Aluminum' && <AluminumBlock currentTemp={currentTemp} viewMode={viewMode} />}
          {objectType === 'Body' && <HumanBody currentTemp={currentTemp} viewMode={viewMode} />}
        </Suspense>

        {/* In the mockup, arrows are shown even in Normal view. Let's show them in Normal and Transfer modes */}
        {(viewMode === 'Normal' || viewMode === 'Transfer' || viewMode === 'Heatmap') && <Steam currentTemp={currentTemp} />}
        {viewMode === 'Heatmap' && <HeatmapAura currentTemp={currentTemp} deltaT={deltaT} />}
        {(viewMode === 'Transfer' || viewMode === 'Normal') && <HeatTransferLines currentTemp={currentTemp} deltaT={deltaT} isHotterThanEnv={isHotterThanEnv} viewMode={viewMode} />}
      </group>

      <OrbitControls
        makeDefault
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.05}
        minDistance={2}
        maxDistance={8}
        enablePan={false}
        autoRotate={viewMode === 'Normal' || isThermal}
        autoRotateSpeed={0.8}
      />

      {/* Cinematic Post-Processing: Bloom threshold 1.0 means ONLY emissive materials glow */}
      <EffectComposer enableNormalPass={false}>
        <Bloom
          luminanceThreshold={1.0}
          mipmapBlur
          intensity={isThermal ? 2.5 : 1.0}
          radius={0.8}
        />
      </EffectComposer>
    </>
  );
};

const ThermalScene = () => {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 2, 5.5], fov: 45 }}
      gl={{ antialias: true, alpha: false, toneMapping: THREE.ACESFilmicToneMapping }}
    >
      <SceneContent />
    </Canvas>
  );
};

export default ThermalScene;
